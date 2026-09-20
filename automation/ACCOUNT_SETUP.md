# LinkedIn Company Page — setup for NMD Associates

Facebook Page and Instagram Business account already exist (System User
token setup for those is in `SOCIAL_AUTOMATION.md` Sections 6a/6b). The
**LinkedIn Company Page itself now exists** (`NMD Associates`, org ID
`143243127`, verified `linkedin.com/company/143243127`) — Steps 1-2 below
are kept for reference only.

**Steps 3-6 (the original raw-API path) are superseded.** A LinkedIn
Developer app for this org (`NMD Social Automation`, Client ID
`865vp2opy4mm6c`) was created and its Community Management API request came
back **"Access denied — Identity vetting failed"**: LinkedIn couldn't
verify NMD Associates as a legally registered, active entity. Appealing
needs business registration documents that aren't on hand yet — see the
`click here` link on the app's Products page (`Access was denied` popup)
for the appeal form (`linkedin.com/help/linkedin/ask/dsapi`, Form Type
"Vetting Appeal") if/when those documents are available.

**Until then, the pipeline posts to LinkedIn via Make.com instead** — see
"Make.com route" below. This sidesteps LinkedIn Developer Portal vetting
entirely: Make holds its own already-approved LinkedIn Pages integration,
and posting only needs OAuth login as page admin through Make's UI, not a
self-owned, vetted developer app. (Zapier was tried first, but its
Webhooks module is Premium/paid-plan-only — Make's is free.)

These steps need a human logged into LinkedIn with business verification —
I can't perform them; this is a checklist for whoever does.

## Before you start, have ready

- Legal business name: NMD Associates
- A business email (not a personal Gmail) to verify the page
- A phone number for verification
- Logo file — reuse `website/assets/images/nmd-logo.svg` (convert to PNG if
  LinkedIn's upload rejects SVG)
- Company size and industry (Insurance/Financial Services)

## 1. Create the Company Page

1. Go to linkedin.com → **Work** menu (top right) → **Create a Company Page**.
2. Choose **Company** (not Showcase Page or Educational Institution).
3. Fill in: Page name (NMD Associates), LinkedIn public URL, website URL
   (point at the live nmdassociates site), industry, company size.
4. Upload the logo and a cover image.
5. Verify you're not a robot, click **Create page**.

## 2. Assign admin

You're automatically the page's first admin (Super Admin) as the creator.
If someone else at NMD needs access: Page → **Admin tools → Manage admins**
→ add them by name, assign **Content Admin** at minimum (needed to post).

## 3-6. Superseded — raw LinkedIn API path (kept for future reference)

The steps below are what you'd do if the Community Management API vetting
appeal (see top of doc) later succeeds. Not needed for the current Make.com
route.

1. [developer.linkedin.com](https://developer.linkedin.com/) → **My apps**
   → app linked to the Company Page → **Products** → request
   **Community Management API** (needs LinkedIn review, days-long, and
   passing identity vetting).
2. Once approved: Auth tab → add scopes `w_organization_social`,
   `r_organization_social` → run OAuth 2.0 3-legged flow (detail in
   `SOCIAL_AUTOMATION.md` Section 6c) → create a native **LinkedIn OAuth2**
   credential in n8n.
3. Organization URN: `urn:li:organization:143243127` (already known, no
   lookup needed).
4. Tokens expire ~60 days — no permanent option like Meta's System User
   tokens; set a calendar reminder to re-run OAuth before expiry.
5. Restore the three-node LinkedIn HTTP Request chain (Init Upload / Upload
   Binary / Publish Post — see git history prior to the Make.com switch for
   the exact node JSON) in place of the single "LI Post via Make" node.

## Make.com route (current)

1. Sign into (or create) a Make.com account — free plan, no card needed.
2. Create a scenario: trigger **Webhooks → Custom webhook**. Name it, click
   "Create a webhook", copy the generated URL (already done — see webhook
   URL below).
3. Action module: **LinkedIn Pages → Create a Post** (exact label may vary
   by Make version). Authorize Make against LinkedIn as Company Page admin
   (OAuth login through Make's UI — no LinkedIn Developer Portal, no
   vetting). Map the post text to the webhook's `caption` field and the
   image to the webhook's `publicUrl` field.
4. Turn the scenario on.
5. Webhook URL (already filled into `nmd-social-workflow.json`'s
   **LI Post via Make** node):
   `https://hook.eu1.make.com/jurnq23dha3fheesxy8ramfsb03om0vn`
6. Make's free plan: 1,000 operations/month, Webhooks module included free
   (unlike Zapier, which gates "Webhooks by Zapier" behind a paid plan) —
   comfortably covers a small business's posting cadence at 2 ops/post
   (webhook + LinkedIn action).

## Once this is done

The webhook URL is already filled into the "LI Post via Make" node in
`nmd-social-workflow.json` — remaining step is adding the LinkedIn Pages
action module in the Make scenario (step 3 above) and authorizing it, then
the LinkedIn branch is live alongside the already-working Instagram/
Facebook branches, with no LinkedIn API vetting dependency.
