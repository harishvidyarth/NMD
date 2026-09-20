# NMD Associates — Free, Sleep-Proof WhatsApp → Instagram + Facebook + LinkedIn Pipeline (n8n)

A completely free content pipeline running locally via **n8n Community
Edition** (native install, not Docker). It watches a WhatsApp source for a
new post (image + caption) and auto-publishes it to **Instagram**,
**Facebook Page**, and **LinkedIn Company Page**. Designed to survive the
laptop sleeping (polling, not real-time webhooks), to never double-post, and
to keep running unattended in the background via the OS's own service
manager (launchd on macOS, Task Scheduler on Windows).

> **Cost:** $0. n8n CE is free and self-hosted; Meta Graph API and LinkedIn
> API publishing are free; the image host options below all have free tiers.

---

## 0. Architecture at a glance

```
Schedule Trigger (every 15 min) ┐
Manual Trigger (test in n8n)    ┼──► Normalize Input ──► Fetch new WhatsApp posts ──► Dedup check (per-post)
Webhook (bookmark to force sync)┘         (Approach A or B)         (seen? stop)
                                                                          │ new
                                                                          ▼
                                        Upload media to public host ──► get public URL
                                                                          │
                        ┌─────────────────────────────┬─────────────────┴─────────────────┐
                        ▼                              ▼                                   ▼
              IF: instagram done?              IF: facebook done?                  IF: linkedin done?
                        │ no                          │ no                                 │ no
                        ▼                              ▼                                   ▼
        IG: create container ──► publish   FB: POST /{page}/photos      LI: init upload ──► PUT image ──► POST /posts
                        │                              │                                   │
                        └─────────────────┬────────────┴───────────────────┬───────────────┘
                                           ▼                                ▼
                                    Merge (wait for all 3)
                                           │
                                           ▼
                          Save per-platform published flags to dedup log
```

Three triggers all feed the **same** first processing node ("Normalize
Input"), so automation, manual test, and a forced sync run identical logic.
After the shared media upload, the flow **fans out** into three independent
platform branches so a failure on one platform never blocks or duplicates
the others (see Section 3).

---

## 1. Launch n8n locally (native install + auto-start, no Docker)

Docker Desktop's Linux VM adds ~1-2GB of RAM overhead just to run one small
Node process inside it. Skipping Docker and installing n8n directly gets the
same result for a fraction of the RAM, and integrates with the OS's own
"start on boot, restart on crash" service manager instead of needing Docker
Desktop open at all times.

### macOS

```bash
# Requires Node.js 18+ (install via https://nodejs.org or `brew install node`)
npm install -g n8n
```

Create `~/Library/LaunchAgents/com.nmd.n8n.plist` (template provided at
`com.nmd.n8n.plist` in this repo — copy it in, fill in your actual `n8n`
binary path from `which n8n`):

```bash
cp com.nmd.n8n.plist ~/Library/LaunchAgents/com.nmd.n8n.plist
launchctl load ~/Library/LaunchAgents/com.nmd.n8n.plist
```

This starts n8n immediately and on every future login (`RunAtLoad`), and
relaunches it automatically if the process ever crashes (`KeepAlive`). All
workflow/credential data persists under `~/.n8n` (n8n's default data dir)
across restarts.

**Why this beats Docker here:** it's a true background daemon, not tied to
a Terminal window, a browser tab, or the Docker Desktop menu-bar app —
closing any of those doesn't stop it. Only a full shutdown does, and
`RunAtLoad` brings it straight back on the next login.

To stop it: `launchctl unload ~/Library/LaunchAgents/com.nmd.n8n.plist`.

### Windows (for when this moves to the enterprise laptop)

```powershell
# Requires Node.js 18+ (install via https://nodejs.org)
npm install -g n8n
```

Register it as a scheduled task that starts at logon and restarts on
failure, using the template `nmd-n8n-task.xml` in this repo:

```powershell
schtasks /create /tn "NMD n8n" /xml nmd-n8n-task.xml
```

Data persists under `%USERPROFILE%\.n8n`. To stop: `schtasks /end /tn "NMD n8n"`;
to remove entirely: `schtasks /delete /tn "NMD n8n" /f`.

Either OS: open `http://localhost:5678` and create your local owner account
the first time.

---

## 2. The sleep-proof logic (why polling, not webhooks)

When the laptop sleeps, real-time webhook deliveries sent during that window
are **lost forever** — nothing is listening. A **Schedule Trigger** avoids
this: the moment the machine wakes, n8n's scheduler notices the missed
interval and fires immediately, catching up on anything posted while asleep.
As long as your fetch step pulls *recent history* (not just "messages since
the last webhook"), you never miss a post.

Three inputs, one entry point:
- **Schedule Trigger** — every 15 minutes (the automation).
- **Manual Trigger** — the "Execute Workflow" button for testing inside n8n.
- **Webhook** — a local URL (e.g. `http://localhost:5678/webhook/nmd-sync`)
  you bookmark; opening it forces an immediate sync.

Wire all three into a **Set / Code** node named "Normalize Input" so the rest
of the flow is trigger-agnostic.

---

## 3. Deduplication (never double-post, per platform)

Every candidate post has a stable ID (WhatsApp message ID, or a hash of the
image URL). With three independent platform APIs, a single "already
published" flag isn't enough: if Instagram succeeds but the LinkedIn call
fails, the next cycle must retry **only LinkedIn** — not re-post to
Instagram and Facebook too. So the dedup log tracks a flag **per post, per
platform**:

```js
// n8n Static Data (or Airtable/local file — same shape either way)
store.published = store.published || {};
// store.published["<dedupId>"] = { instagram: true, facebook: false, linkedin: false }
```

Flow logic:
1. **Post-level check** (right after fetch): if a post has no entry at all
   yet, it's brand new — create the entry with all three flags `false` and
   continue.
2. **Per-branch check** (right before each platform's publish call): an IF
   node reads `store.published[dedupId][platform]`; if already `true`, skip
   that branch this cycle.
3. **Per-branch save** (right after each platform's publish succeeds): flip
   that one flag to `true`. A crash or API failure on one platform leaves
   its flag `false`, so only that platform retries next cycle — the other
   two, already `true`, are never touched again.

Three free storage options for the `store` itself (same trade-offs as
before):
1. **n8n Static Data** (simplest, zero setup) — good for a single workflow
   on one machine.
2. **Local file** (`~/.n8n/published_ids.json` via Read/Write Binary File
   nodes).
3. **Free Airtable table** — one row per post, one column per platform, if
   you want a visible audit trail.

---

## 4. Public image URL bridge (required by all three platforms)

None of the Instagram, Facebook, or LinkedIn publish APIs can read a local
file or a private WhatsApp media binary — each needs a **public URL** (or,
for LinkedIn, a direct binary upload — see Section 6c) you give it. So the
flow pushes the raw media to a free public host once and reuses that same
public URL/binary for all three platform branches. Free options:

- **Supabase Storage** (recommended): create a free project, a public bucket
  (e.g. `nmd-social`), upload via the Storage REST API with your key, then
  use the public object URL. Generous free tier, real CDN URLs.
- **Imgur API**: free image upload with a Client-ID; returns a public link.
  Simplest, but rate-limited and less predictable.
- **Airtable attachment**: upload the binary as an attachment; Airtable
  returns a temporary public URL you can pass straight to Meta/LinkedIn.

Publish promptly after upload (temporary URLs can expire).

---

## 5. WhatsApp capture — two blueprints (pick one)

### Approach A — Official WhatsApp Business Cloud API (recommended, ToS-safe)

Meta's official API **cannot read public WhatsApp Channels**, but it *can*
receive messages sent to a WhatsApp Business number you control. Workflow: you
(or whoever curates content) forward the image and caption to that business
number; n8n pulls it.

> **Already have the WhatsApp Business app on a phone?** The steps below
> assume a number being registered fresh. If you're bringing an *existing*
> Business app number into the Cloud API instead, use
> `WHATSAPP_SETUP.md` — the migration/coexistence path is different from a
> from-scratch registration.

Setup:
1. In the Meta Developer Console, create an app, add the **WhatsApp** product,
   and get a **Business phone number ID** and a **permanent System User token**.
2. Because the machine sleeps, prefer **polling** the messages endpoint on
   the Schedule Trigger rather than relying solely on the webhook. You can
   also register the webhook as a secondary path for when it's awake.
3. For each new message of type image: read the media ID, then call the Graph
   API to get the media URL, then download that URL **with the Bearer token** to
   get the binary.
4. Pass the binary to the media-host node (Section 4) and the caption forward.

n8n nodes: HTTP Request (list/download messages and media), then IF
(type is image), then media host, then the three publish branches. There is
also a native WhatsApp Business Cloud node for sending; for *reading*, the
HTTP Request plus Graph API calls above are the reliable path.

### Approach B — Public WhatsApp Channel web scraper

If the source is a **public WhatsApp Channel**, scrape its public web view.

1. HTTP Request node fetches the channel's public URL, returning HTML.
2. HTML (Extract) node or a Code node parses the latest post: the image `src`
   attribute and the caption text.
3. If the page is JavaScript-rendered, run a **Puppeteer** step via the Code
   node (or the community Puppeteer node) to render then extract.
4. Feed image URL and caption into dedup, then media host, then the three
   publish branches.

> Caveat: scraping HTML is brittle (markup changes break it) and may bump into
> WhatsApp's terms. Approach A is sturdier; use B only for genuinely public
> channels where A cannot apply.

---

## 6. Publish to each platform

### 6a. Instagram (Graph API, two-step)

1. **Create media container:** POST to the IG user's `/media` endpoint with
   the public image URL, the caption, and the access token; returns a
   creation ID.
2. **Publish container:** POST to the IG user's `/media_publish` endpoint
   with that creation ID and the access token.

Meta Developer Console setup (one time):
1. Convert the Instagram account to a **Business** account, linked to a
   **Facebook Page**.
2. In the Meta app, add the **Instagram Graph API** product.
3. Create a **System User** in Business Settings and generate a
   **permanent (non-expiring) token**.
4. Grant permissions: `instagram_basic`, `instagram_content_publish`,
   `pages_show_list`, `pages_read_engagement`, `business_management`.
5. Find the **IG User ID** from the page's `instagram_business_account`
   field.

### 6b. Facebook Page (Graph API, single call)

One call publishes an image + caption directly to the Page's feed:

```
POST https://graph.facebook.com/v21.0/<PAGE_ID>/photos
  url=<public image URL>
  caption=<caption text>
  access_token=<Page Access Token>
```

**Page Access Token** is a different token from Instagram's System User
token — generate it from the same Meta Business Settings:
1. In Business Settings → your System User → **Add Assets** → assign the
   Facebook Page with **Manage permission**.
2. Generate the System User token with page-level scopes:
   `pages_manage_posts`, `pages_read_engagement`.
3. Use `/{page-id}?fields=access_token` (with the System User token) to
   fetch the actual **Page Access Token** to use for the `/photos` call
   above — Meta requires the page-scoped token, not the System User token
   directly, for this endpoint.

n8n node: single HTTP Request node, `POST`, with the Page Access Token
stored as an n8n Credential.

### 6c. LinkedIn Company Page — via Zapier (current implementation)

The NMD Social Automation LinkedIn Developer app (Client ID
`865vp2opy4mm6c`) requested the Community Management API and got
**"Access denied — Identity vetting failed"**: LinkedIn couldn't verify
NMD Associates as a legally registered, active entity, and the appeal
needs registration documents not currently on hand (see `ACCOUNT_SETUP.md`
for the appeal path).

So the pipeline's LinkedIn branch is a single HTTP Request node
(`LI Post via Zapier`) that POSTs `{ publicUrl, caption, dedupId }` as JSON
to a Zapier webhook — no LinkedIn credential attached in n8n at all:

```
POST <ZAPIER_WEBHOOK_URL>
Body: { "publicUrl": "<image url>", "caption": "<caption text>", "dedupId": "<id>" }
```

On the Zapier side: a Zap with trigger **Webhooks by Zapier → Catch Hook**
feeding action **LinkedIn Pages → Share an Update**, mapping `caption` and
`publicUrl` from the webhook payload. The Zap's LinkedIn connection is
authorized once via Zapier's own UI (OAuth login as Company Page admin) —
this uses Zapier's already-approved LinkedIn Pages integration, so it
completely bypasses LinkedIn Developer Portal vetting. Free tier (100
tasks/month) is enough for this posting cadence.

Setup, one time: create the Zap as above, paste its webhook URL into the
`<ZAPIER_WEBHOOK_URL>` placeholder on the `LI Post via Zapier` node.

### 6c-alt. Raw LinkedIn API path (fallback, once vetting appeal succeeds)

If the Community Management API vetting appeal (see `ACCOUNT_SETUP.md`)
succeeds later, LinkedIn's own image posting is a three-call sequence that
can replace the Zapier node:

1. **Initialize upload:**
   ```
   POST https://api.linkedin.com/rest/images?action=initializeUpload
   Body: { "initializeUploadRequest": { "owner": "urn:li:organization:143243127" } }
   ```
   Returns an `uploadUrl` and an `image` asset URN.
2. **Upload the binary:**
   ```
   PUT <uploadUrl>
   Body: <raw image binary>
   ```
3. **Create the post:**
   ```
   POST https://api.linkedin.com/rest/posts
   Body: {
     "author": "urn:li:organization:143243127",
     "commentary": "<caption text>",
     "visibility": "PUBLIC",
     "distribution": { "feedDistribution": "MAIN_FEED" },
     "content": { "media": { "id": "<image asset URN from step 1>" } },
     "lifecycleState": "PUBLISHED"
   }
   ```

n8n nodes: three chained HTTP Request nodes (init → upload → post), each
using a LinkedIn OAuth2 credential (`w_organization_social`,
`r_organization_social` scopes; standard 3-legged OAuth flow; n8n's native
LinkedIn credential type handles this). Tokens expire ~60 days — set a
calendar reminder to re-authorize, unlike Meta's non-expiring System User
tokens.

---

## 7. Copy-pasteable workflow JSON

Import `nmd-social-workflow.json` (in this repo) directly: **n8n top-right
menu → Import from clipboard/file**. It wires the three triggers into one
normalize node, checks per-platform dedup, and stubs the fetch/host/publish
HTTP calls for you to point at your real endpoints and credentials — no
secrets are embedded in the export; every HTTP node references a named
n8n Credential you attach after import.

After importing:
1. Open each HTTP Request node and attach the right **Credential** (Meta
   System User token, Meta Page token, Supabase key). Never hardcode tokens
   in URLs. The LinkedIn branch needs no n8n credential — it posts through
   a Zapier webhook instead (see Section 6c).
2. Replace every remaining `<PLACEHOLDER>` (`<PHONE_NUMBER_ID>`,
   `<IG_USER_ID>`, `<PROJECT>`, `<FILENAME>`, `<ZAPIER_WEBHOOK_URL>`).
   `<PAGE_ID>` and `<ORG_ID>` are already filled in.
3. In "Fetch WhatsApp", add filtering so only image messages with a caption
   proceed (an IF node or a few lines in the Code node).
4. Test with the **Manual Trigger** first, using one known post, before
   enabling the schedule.
5. Bookmark `http://localhost:5678/webhook/nmd-sync` for on-demand syncs.

---

## 8. Operational notes

- **Approve-before-post option:** insert a manual approval step (e.g. a
  Telegram/email "approve?" node, or an Airtable "approved" checkbox the flow
  checks) before the publish branches if you later want a human gate.
- **Rate limits:** Instagram allows roughly 25 API-published posts per 24h;
  Facebook Pages have a similar generous limit; LinkedIn's organization
  posting limit is also well above a 15-minute-poll cadence. All comfortably
  within normal usage.
- **Failure retries:** because each platform's flag is saved only after
  *that platform's* successful publish, a crash or API error on one platform
  simply retries that platform next cycle — the other two are untouched.
- **Keep the service running:** on macOS, `launchctl load` with `RunAtLoad`
  + `KeepAlive` (Section 1) means the schedule survives login and crashes;
  the laptop must be powered on (asleep is fine — it catches up on wake;
  full shutdown is not). On Windows, the Task Scheduler task with a "log on"
  trigger and "restart on failure" setting is the equivalent.
- **LinkedIn token expiry:** re-authorize before the ~60-day expiry (see
  Section 6c) — the only credential in this pipeline that isn't a permanent
  token.

---

## 9. Packaging for the enterprise laptop

This pipeline is built and verified locally first, then handed off as a
portable package — **not** the whole `~/.n8n` data folder, since its
credential store is encrypted with a key tied to this specific install and
won't decrypt on another machine. The receiving laptop creates its own
credentials against its own Meta/LinkedIn business accounts.

What to hand off:
- `SOCIAL_AUTOMATION.md` — this doc.
- `nmd-social-workflow.json` — the workflow export (no credentials attached).
- `com.nmd.n8n.plist` — macOS autostart template.
- `nmd-n8n-task.xml` — Windows autostart template (for when the laptop
  moves to Windows).
- `README-SETUP.md` — zero-assumptions setup steps for whoever installs
  this on the enterprise laptop.

Nothing else is required — no Docker, no local database, no shared secrets
in the transferred files.
