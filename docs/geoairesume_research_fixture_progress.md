# GeoAIResume research fixture progress

Status: implemented locally on 2026-10-22. GeoAIResume remains an owner-controlled test site. It is not deployed, committed, pushed, or represented as a real enrolled SMB or hotel participant.

## Owner-controlled fixture

The machine-readable fixture is in [integration/site.json](/Users/melc/Documents/App%20Design/GeoAIResume/integration/site.json).

- Canonical URL: `https://geo-ai-resume.vercel.app`
- Classification: `owner_controlled_test_site`
- Allowed crawl origin: the canonical origin only
- Allowed test contact: `public_contact.test_email_when_enabled`, enabled only when the owner supplies `VITE_PUBLIC_TEST_CONTACT_EMAIL`
- Contact forms and automatic email are disabled
- Owner approval is required for contact enablement, proposal application, production deployment, and public verification
- The site is explicitly excluded from company discovery, preliminary AI screening, recruitment outreach, research-consent cohorts, and SMB/hotel benchmarks
- No company size, revenue, client, benchmark, enrollment, or research-result claims are fabricated

The fixture is intended to exercise the outreach-first GEO workflow as infrastructure validation only. It must not be counted as a participant or used to infer results about real companies.

## Implemented support

- Contact rendering uses `VITE_PUBLIC_TEST_CONTACT_EMAIL`. Missing or blank configuration produces no email address and no `mailto:` link.
- `integration/content_manifest.json` contains deterministic records for the 140 indexable sitemap pages, including stable IDs, canonical URLs, source locations, editable fields, hashes, Git revision, and shared-content impact.
- Change proposals now require page ID, exact original text, replacement text, source hash/revision, strategy ID, approval status, experiment reference, and expected affected pages. `scripts/apply-proposal.mjs` refuses unapproved, stale, ambiguous, or unexpected shared-template edits and writes a rollback snapshot before applying a local source-only change.
- `integration/schemas/change-proposal.schema.json` and `integration/schemas/deployment-receipt.schema.json` describe the exchange records.
- `scripts/verify-deployment.mjs` is read-only. It checks a public URL for expected text and an expected-content hash, records response evidence, deployment timestamp when provided by headers, and the Vercel Git revision header when available. It distinguishes source-only, Git-only, deployment-ready, and public-verified states.
- No GEO Engine scoring, Outreach Agent databases, campaign logic, or automatic publishing was added.

## Test results

`npm run test:integration` passed with 8 tests covering:

- absent and owner-supplied contact email behavior
- deterministic manifest generation
- exact one-page edit targeting
- approval enforcement
- stale proposal rejection
- ambiguous text rejection
- shared-content fan-out safety
- deployment verification states, expected hash, timestamp, and available Git revision

No live verification was run because deployment was explicitly out of scope.

## Owner inputs required before a live experiment

1. Supply and approve the public test address, if wanted, through `VITE_PUBLIC_TEST_CONTACT_EMAIL`.
2. Approve the fixture’s crawl scope and maintain the formal cohort exclusions in the integration record.
3. Provide an approved GEO Engine strategy ID, experiment reference, target page IDs, hypothesis, exact replacement text, and expected affected pages.
4. Define the human approver and retain approval evidence with the proposal.
5. Authorize any deployment and provide the Vercel deployment ID/URL afterward.
6. Run public verification against the canonical URL and retain the receipt. A local source change or successful Git push is not proof of public deployment.
