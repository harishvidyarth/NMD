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

**Until then, the pipeline posts to LinkedIn via Zapier instead** — see
"Zapier route" below. This sidesteps LinkedIn Developer Portal vetting
entirely: Zapier holds its own already-approved LinkedIn Pages
integration, and posting only needs OAuth login as page admin through
Zapier's UI, not a self-owned, vetted developer app.

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
appeal (see top of doc) later succeeds. Not needed for the current Zapier
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
   Binary / Publish Post — see git history prior to the Zapier switch for
   the exact node JSON) in place of the single "LI Post via Zapier" node.

## Zapier route (current)

1. Create a free Zapier account (or use an existing one).
2. Create a Zap: trigger **Webhooks by Zapier → Catch Hook**. Copy the
   generated webhook URL.
3. Action: **LinkedIn Pages → Share an Update**. Authorize Zapier against
   LinkedIn as a Company Page admin (OAuth login through Zapier's UI —
   no LinkedIn Developer Portal, no vetting). Map the update text to the
   webhook's `caption` field and the image to the webhook's `publicUrl`
   field.
4. Turn the Zap on.
5. In `nmd-social-workflow.json`, paste the webhook URL from Step 2 into
   the `<ZAPIER_WEBHOOK_URL>` placeholder on the **LI Post via Zapier**
   node. No LinkedIn credential needs attaching in n8n for this branch.
6. Zapier free tier caps at 100 tasks/month — fine for a small business
   posting cadence; upgrade only if volume grows.

## Once this is done

Paste the Zapier webhook URL into the `<ZAPIER_WEBHOOK_URL>` placeholder on
the "LI Post via Zapier" node in `nmd-social-workflow.json` — then the
LinkedIn branch is live alongside the already-working Instagram/Facebook
branches, with no LinkedIn API vetting dependency.
