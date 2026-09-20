# NMD Social Automation — Setup on a New Laptop

Zero-assumptions setup for whoever installs this pipeline on the enterprise
laptop. Read `SOCIAL_AUTOMATION.md` first for the full design — this is just
the checklist.

All commands below assume you're inside this `automation/` folder:

```bash
cd automation
```

## 1. Install n8n

```bash
# macOS / Windows — requires Node.js 18+ (https://nodejs.org)
npm install -g n8n
```

## 2. Set up auto-start for this machine's OS

**macOS:**
```bash
cp com.nmd.n8n.plist ~/Library/LaunchAgents/com.nmd.n8n.plist
# Edit the plist: replace /usr/local/bin/n8n with the output of `which n8n`
launchctl load ~/Library/LaunchAgents/com.nmd.n8n.plist
```

**Windows:**
```powershell
# Edit nmd-n8n-task.xml: replace %APPDATA%\npm\n8n.cmd with the output of `where n8n`
schtasks /create /tn "NMD n8n" /xml nmd-n8n-task.xml
```

## 3. Open n8n and create the local owner account

`http://localhost:5678` — first visit prompts you to create an account. This
is local-only, not shared with anyone else's n8n.

## 4. Import the workflow

n8n menu (top right) → **Import from file** → select `nmd-social-workflow.json`.
It imports with placeholder IDs and no credentials attached — safe, nothing
to strip out.

## 5. Create credentials for this laptop's accounts

Do **not** reuse credentials from another machine — set these up fresh
against this laptop's own Meta Business Manager / LinkedIn Company Page
access:

| Credential | Where used | Setup reference |
|---|---|---|
| Meta System User token (Instagram) | IG Create Container, IG Publish | `SOCIAL_AUTOMATION.md` Section 6a |
| Meta Page Access Token (Facebook) | FB Publish Photo | `SOCIAL_AUTOMATION.md` Section 6b |
| Supabase (or Imgur/Airtable) key | Upload to Public Host | `SOCIAL_AUTOMATION.md` Section 4 |
| WhatsApp Business token | Fetch WhatsApp (Graph API), Get Media URL, Download Media Binary | `SOCIAL_AUTOMATION.md` Section 5 |

LinkedIn needs **no n8n credential** — its Community Management API
request was denied (identity vetting, see `ACCOUNT_SETUP.md`), so the
`LI Post via Zapier` node instead calls a Zapier webhook that posts on
LinkedIn's behalf using Zapier's own already-approved connection
(`SOCIAL_AUTOMATION.md` Section 6c).

In n8n: open each HTTP Request node listed above → **Credential** dropdown →
create new → paste the token. Then replace the placeholders in each node's
URL/body (`<PHONE_NUMBER_ID>`, `<IG_USER_ID>`, `<PROJECT>`, `<FILENAME>`,
`<ZAPIER_WEBHOOK_URL>`) with this business's real values — `<PAGE_ID>` and
`<ORG_ID>` are already filled in.

## 6. Test before enabling the schedule

1. Click **Manual Trigger** → **Execute Workflow** on one known WhatsApp
   post.
2. Confirm the post appears on Instagram, Facebook, and LinkedIn.
3. Only then enable the **Schedule Trigger** node (it's disabled by default
   on import) for the automatic 15-minute cadence.

## 7. Confirm it survives a restart

Reboot the laptop, wait for login, and check `http://localhost:5678` comes
back up on its own with no manual step. If it doesn't, re-check step 2 —
the auto-start config is the most common thing to get wrong on a new
machine (wrong `n8n` binary path is the usual culprit).

## Ongoing

- Meta tokens (Instagram, Facebook) are permanent and need no renewal.
- LinkedIn posting runs through the Zapier webhook, not a token n8n
  manages — nothing to renew there either, as long as the Zap's own
  LinkedIn connection stays authorized on Zapier's side.
- If the identity vetting appeal later succeeds and the raw LinkedIn API
  path is restored (`SOCIAL_AUTOMATION.md` Section 6c-alt), its access
  token expires roughly every 60 days — re-run the OAuth flow before then.
