# Meta tokens — literal click-path (Instagram + Facebook)

`SOCIAL_AUTOMATION.md` Sections 6a/6b describe *what* these tokens are and
*what scopes* they need. This doc is *where to click* to actually generate
them, since your Facebook Page and Instagram Business account already exist
— this is credential generation only, not account creation.

Both tokens come from the same place: **Meta Business Suite → Business
Settings**. You need to be an admin of the Business that owns the Page and
the Instagram account.

## 1. Get into Business Settings

1. Go to [business.facebook.com](https://business.facebook.com/) and log in
   with the account that admins the NMD Facebook Page.
2. If NMD doesn't already have a **Business** (the Meta Business Manager
   container, different from the Page itself), create one: bottom-left menu
   → **Business Settings** → prompts to create if none exists. Name it
   "NMD Associates".
3. Once in Business Settings, confirm both assets are attached:
   **Accounts → Pages** (should list the NMD Facebook Page) and
   **Accounts → Instagram accounts** (should list the linked IG Business
   account). If either is missing, **Add** → follow the prompt to claim/link
   it — you'll need to already be an admin on that Page/IG account for this
   to work.

## 2. Create the System User

1. Business Settings → **Users → System Users** → **Add**.
2. Name it something identifiable, e.g. `nmd-n8n-automation`.
3. Role: **Admin** (needed to generate tokens with full content-publish
   scope — Employee role can work too if you assign the specific assets in
   step 4, but Admin is simpler for a single-purpose automation account).
4. Click **Create System User**.

## 3. Assign assets to the System User

1. Still on the System User's page → **Assign Assets**.
2. Under **Pages**: select the NMD Facebook Page → toggle **Manage Page**.
3. Under **Instagram accounts**: select the linked NMD Instagram account →
   toggle **Manage Instagram Account**.
4. Save.

## 4. Generate the Instagram / System User token

1. Still on the System User's page → **Generate New Token**.
2. Select the app this token is for (create one first under
   **Business Settings → Accounts → Apps** if none exists yet — name it
   `NMD Social Automation`, type: **Business**).
3. Check these scopes: `instagram_basic`, `instagram_content_publish`,
   `pages_show_list`, `pages_read_engagement`, `business_management`.
4. Click **Generate Token**. **Copy it immediately and store it somewhere
   safe (a password manager, or straight into the n8n Credential) — Meta
   shows it once and will not display it again.**
5. This token does not expire on its own (System User tokens are
   permanent) unless you revoke it manually — this is the token for the
   Instagram Create Container / Publish nodes.

## 5. Derive the Facebook Page Access Token

The `/photos` endpoint (Section 6b) needs a **Page** token, not the System
User token directly — exchange one for the other with a single call:

```
GET https://graph.facebook.com/v21.0/<PAGE_ID>?fields=access_token
    &access_token=<the System User token from step 4>
```

Run this from a terminal (`curl`) or Postman — the response's
`access_token` field is the Page Access Token. This one is also
non-expiring as long as the System User token behind it stays valid.

## 6. Store both in n8n

- n8n → **Credentials → Add Credential → Header Auth** (or the built-in
  Facebook Graph API credential type if using n8n's native Facebook nodes).
- One credential holding the **System User token** → attach to the
  Instagram nodes (`IG Create Container`, `IG Publish`).
- One credential holding the **Page Access Token** → attach to
  `FB Publish Photo`.
- Never paste either token directly into a node's URL/body — always via
  Credential, so it isn't stored in plaintext in the exported workflow JSON.

## If a token ever needs revoking

Business Settings → System Users → select the user → **...** menu →
**Deactivate**, or regenerate a fresh token from the same **Generate New
Token** button — the old one stops working immediately.
