# WhatsApp — connecting your existing Business app number to the Cloud API

You already run the **WhatsApp Business app** on a phone with a live NMD
number. `SOCIAL_AUTOMATION.md` Section 5 (Approach A) assumes a number
that's already registered in Meta's **Cloud API** — this doc bridges that
gap: how to bring your *existing* app-based number into the Cloud API so
the pipeline's Fetch WhatsApp node can actually poll it.

**Important — verify this against Meta's current docs before doing it.**
Meta has changed how this migration works more than once (full migration
vs. a newer "coexistence" mode that keeps the app and API working on the
same number simultaneously). Check
[developers.facebook.com/docs/whatsapp/cloud-api](https://developers.facebook.com/docs/whatsapp/cloud-api)
for the current behavior at the time you do this — what's below is the
general shape, not a guaranteed-current exact click-path.

## 1. Decide: migrate fully, or use coexistence

- **Full migration**: the number moves entirely to the Cloud API. The
  WhatsApp Business app stops working on that number afterward — anyone
  who manually messages from the app on that phone loses that capability.
- **Coexistence** (if still available when you do this): the app keeps
  working for manual chats, while the Cloud API can also send/receive on
  the same number — this is almost certainly what NMD wants, since
  presumably someone still needs to reply to customers manually from the
  phone while the automation just reads new posts.

Pick coexistence unless you're certain nobody needs the app on that number
anymore.

## 2. Add the number in Meta Developer Console

1. Go to [developers.facebook.com](https://developers.facebook.com/) → your
   app (the same Business-type app created for
   `META_TOKENS_SETUP.md`, or a new one) → add the **WhatsApp** product.
2. In the WhatsApp product's setup, choose **Add phone number** (not "use
   test number") → enter the existing NMD number.
3. It will detect the number is already active on WhatsApp (as a Business
   app account) and prompt you into the migration/coexistence flow rather
   than treating it as brand new.

## 3. Verify the number

1. Meta sends an OTP (SMS or voice call) to that same phone.
2. Enter the OTP in the console to confirm ownership.
3. If coexistence is offered, you'll see an explicit toggle/prompt for it —
   take it, per Step 1's recommendation.

## 4. Get the Phone Number ID + permanent token

1. Once verified, the WhatsApp product's **API Setup** page shows a
   **Phone number ID** — this is the `<PHONE_NUMBER_ID>` placeholder in
   `nmd-social-workflow.json`'s `Fetch WhatsApp (Graph API)` node.
2. For the token: reuse the same System User from
   `META_TOKENS_SETUP.md` (Business Settings → System Users) — assign it
   the WhatsApp Business Account under **Assign Assets**, then generate a
   token with the `whatsapp_business_messaging` scope added alongside the
   existing Instagram/Facebook scopes. One token, one credential, covers
   all four platforms' System-User-based calls (everything except
   LinkedIn).
3. Store it as an n8n Credential, attach to `Fetch WhatsApp (Graph API)`.

## 5. Test before relying on it

Send a test image + caption from the WhatsApp Business app on the phone to
itself or through the normal flow you'll actually use, then run the n8n
workflow's **Manual Trigger** and confirm `Fetch WhatsApp (Graph API)`
picks it up. Do this before turning on the 15-minute Schedule Trigger.

## If coexistence isn't available for your account

Some accounts/regions may only offer full migration. If so, plan for who
handles manual customer replies going forward — either a second number for
manual chats, or accept that the Business app stops working on this number
once migrated.
