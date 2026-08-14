# LinkedIn Company Page — fresh setup for NMD Associates

Facebook Page and Instagram Business account already exist (System User
token setup for those is in `SOCIAL_AUTOMATION.md` Sections 6a/6b). This
doc covers the one piece that's still missing: a **LinkedIn Company Page**
for NMD Associates, created fresh, plus API access so the pipeline's
LinkedIn branch can actually publish to it.

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

## 3. Create a LinkedIn Developer app for API access

1. Go to [developer.linkedin.com](https://developer.linkedin.com/) → **My apps**
   → **Create app**.
2. Link it to the Company Page created in Step 1 (LinkedIn requires the app
   be associated with a Page you admin).
3. Under **Products**, request access to the **Community Management API** —
   this is the product that allows posting to an organization's feed.
   **This requires LinkedIn's review and approval, which can take a few
   days** — apply for this early, it's the long pole before the LinkedIn
   branch of the pipeline can go live. (Instagram/Facebook, by contrast, get
   instant access via a Meta System User token — no such wait there.)
4. Once approved, note the **Client ID** and **Client Secret** from the
   app's Auth tab.

## 4. Run the OAuth flow once, get tokens

1. In the app's Auth tab, add scopes: `w_organization_social`,
   `r_organization_social`.
2. Run LinkedIn's standard OAuth 2.0 3-legged authorization flow (full
   request/response detail in `SOCIAL_AUTOMATION.md` Section 6c) to get an
   **access token** and **refresh token**.
3. In n8n, create a **LinkedIn OAuth2** credential (n8n has a native
   LinkedIn credential type) using the Client ID/Secret from Step 3 — n8n
   drives the OAuth flow itself through its UI, no manual token copy-paste
   needed if you use the native credential type.

## 5. Find the organization URN

The workflow's LinkedIn nodes need `urn:li:organization:<ORG_ID>`. Find the
numeric ID: Company Page → **Admin tools** → the page's admin URL contains
it (`linkedin.com/company/<ORG_ID>/admin/`), or call
`GET https://api.linkedin.com/rest/organizationAcls?q=roleAssignee` with the
new token to list organizations you administer.

## 6. Token expiry — the recurring manual step

LinkedIn access tokens expire in ~60 days. Unlike Meta's permanent System
User tokens, there's no "set it once forever" option here. Set a calendar
reminder to re-run the OAuth flow (Step 4) before expiry, or rely on the
refresh token if n8n's native credential type handles renewal automatically.

## Once this is done

Update the two `<ORG_ID>` placeholders in `nmd-social-workflow.json` (LI
Init Upload and LI Publish Post nodes) and attach the LinkedIn OAuth2
credential to the three LinkedIn HTTP Request nodes — then the LinkedIn
branch is live alongside the already-working Instagram/Facebook branches.
