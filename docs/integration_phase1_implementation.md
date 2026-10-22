# GeoAIResume Phase 1 integration implementation

Implemented locally on 2026-10-22 for the `geo-research-integration/v1` contract. No deployment, commit, or push was performed.

## Implemented

- Added an owner-controlled contact section to the shared marketing layout. It reads `VITE_PUBLIC_TEST_CONTACT_EMAIL`; when absent, it renders only “A public test contact channel is not enabled.” There is no form, endpoint, automatic email, or invented address.
- Added `integration/site.json` with the contact channel disabled by default.
- Added deterministic `integration/content_manifest.json` for the 140 sitemap pages. Each entry includes a stable page ID, canonical URL, page type, source file, record selector, editable field paths, content hash, source Git revision, and shared-content flag. Shared-template fan-out is enumerated in the manifest.
- Added proposal validation and application tooling. `scripts/apply-proposal.mjs` requires human approval, the current Git revision, matching SHA-256, exactly one source-text match, and an exact expected affected-page list for shared templates. It writes a rollback snapshot under `integration/rollbacks/` before changing source. It never edits `dist/` or generated sitemap files.
- Added `integration/schemas/deployment-receipt.schema.json` and `scripts/verify-deployment.mjs`. The receipt distinguishes source-only, Git-only, deployment-ready, and public-verified states. Verification is read-only and checks expected text in the public response body, returning an evidence hash; it does not claim hydration or deployment from a Git push alone.
- Documented integration-blocking SEO concerns only: static metadata drift between the static generator and hydrated React metadata, and soft 404s caused by the SPA rewrite/unknown routes. No broad SEO rewrite was attempted.

## Tests and checks

Run:

```bash
npm run integration:manifest
npm run test:integration
```

The integration suite covers one-page edits, shared-template protection, stale proposal rejection, approval enforcement, ambiguous matches, manifest determinism, default-disabled contact, and deployment verification states. Fixtures are in `tests/fixtures/`.

`npm run test:integration` passed: 7 tests.

The repository-wide lint/type-check command was attempted, but the local ESLint/TypeScript processes did not complete in the available run and were interrupted; this is a local tooling/runtime limitation rather than a reported source diagnostic. The integration tests and manifest generation completed successfully.

## Owner information required before a live experiment

1. Supply and approve the public test email, if a contact channel is wanted, by setting `VITE_PUBLIC_TEST_CONTACT_EMAIL` in the deployment environment. This address will be public.
2. Approve the GEO Engine experiment/reference ID, target page IDs, hypothesis, replacement text, expected affected pages, and proposal approval record.
3. Confirm the production branch and Vercel project/deployment settings, then provide the Vercel deployment ID/URL after an owner-authorized deployment.
4. Define who may approve proposals and where approval evidence is retained.
5. After deployment, run verification against the canonical URL and record HTTP status, deployment identity, raw HTML evidence, hydrated DOM evidence, and verification time. A successful Git push is not deployment proof.

Do not begin with automatic email sending or a contact form; that would require a secure backend, spam controls, retention rules, and owner approval.
