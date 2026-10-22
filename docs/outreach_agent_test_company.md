# Outreach Agent test company: GeoAIResume

Current status: ready for local integration testing, but no recipient mailbox is configured or verified.

| Field | Value |
|---|---|
| Company name | GeoAIResume |
| Classification | `OWNER_CONTROLLED_TEST` |
| Official website | `https://geo-ai-resume.vercel.app` |
| Test recipient email | `yuxuan.chen.1031@outlook.com` |
| Recipient approval | Owner-approved |
| Mail reception verification | Not verified |
| Research status | Technical test only; not formal research recruitment |

The machine-readable configuration is [integration/site.json](/Users/melc/Documents/App%20Design/GeoAIResume/integration/site.json). The owner-approved Outreach Agent recipient is `yuxuan.chen.1031@outlook.com`. The intended website configuration variable is `VITE_PUBLIC_TEST_CONTACT_EMAIL`; it remains blank in `.env.example`, and the site renders no email or `mailto:` link.

## Audit findings

- The canonical production URL is configured in `src/config/site.ts` and `.env.example` as `https://geo-ai-resume.vercel.app`.
- No business, support, or public contact email is published by the website.
- `VITE_PUBLIC_TEST_CONTACT_EMAIL` remains unset in the current local environment.
- The owner has approved `yuxuan.chen.1031@outlook.com` as the Outreach Agent test recipient; this is integration configuration, not website publication.
- A Git author email exists in repository metadata, but it is not treated as an owner-controlled public mailbox and is not exposed here.
- No dedicated test email exists in project configuration.
- The website currently does not publish a contact email because the contact variable is unset.
- Mailbox functionality and external mail reception have not been verified. No test email was sent.

## Outreach Agent requirements before use

The Agent may use `yuxuan.chen.1031@outlook.com` as the owner-approved test recipient, subject to separate approval before sending any invitation or questionnaire. Do not configure `VITE_PUBLIC_TEST_CONTACT_EMAIL`; the address must not be published on the website. The Agent should read the classification and exclusions from `integration/site.json`, use only the canonical website, and label all interaction as an owner-controlled technical test.

The Agent must not treat GeoAIResume as a real SMB or hotel, include it in company-discovery or recruitment cohorts, infer company size/revenue/clients, or claim research results. No message should be sent until the owner explicitly approves the recipient and outbound test.
