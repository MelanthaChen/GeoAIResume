import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import { resolve } from 'node:path'
import { sha256 } from '../../scripts/integration-lib.mjs'
import { validateProposal } from '../../scripts/proposal-validation.mjs'
import { buildVerificationReceipt, verificationState } from '../../scripts/verify-deployment.mjs'
import { getPublicTestContactEmail } from '../../src/config/contact.mjs'

const manifest = { shared_template_fanout: { 'shared.ts': ['gar:article:a', 'gar:article:b'] } }
const base = (overrides = {}) => ({ proposal_id: 'fixture-one-page', page_id: 'gar:article:a', source_git_revision: 'rev-1', strategy_id: 'strategy-fixture', experiment_reference: 'experiment-fixture', approval_status: 'approved', exact_original_text: 'Original sentence.', original_text_sha256: sha256('Original sentence.'), replacement_text: 'Replacement sentence.', source_field_locator: { source_file: 'page.ts', field_path: 'analysis', original_text_sha256: sha256('Original sentence.') }, expected_affected_pages: ['gar:article:a'], ...overrides })

test('one-page content change applies exactly once', () => {
  const result = validateProposal({ source: 'Before. Original sentence. After.', proposal: base(), manifest: { shared_template_fanout: {} }, currentRevision: 'rev-1' })
  assert.equal(result.source, 'Before. Replacement sentence. After.')
})

test('shared-template protection requires complete fan-out', () => {
  assert.throws(() => validateProposal({ source: 'Original sentence.', proposal: base({ source_field_locator: { source_file: 'shared.ts', original_text_sha256: sha256('Original sentence.') } }), manifest, currentRevision: 'rev-1' }), /fan-out/)
  const result = validateProposal({ source: 'Original sentence.', proposal: base({ source_field_locator: { source_file: 'shared.ts', original_text_sha256: sha256('Original sentence.') }, expected_affected_pages: manifest.shared_template_fanout['shared.ts'] }), manifest, currentRevision: 'rev-1' })
  assert.equal(result.fanout.length, 2)
})

test('stale proposals and unapproved proposals are rejected', () => {
  assert.throws(() => validateProposal({ source: 'Original sentence.', proposal: base({ source_git_revision: 'old-rev' }), manifest: { shared_template_fanout: {} }, currentRevision: 'rev-1' }), /stale/)
  assert.throws(() => validateProposal({ source: 'Original sentence.', proposal: base({ approval_status: 'pending' }), manifest: { shared_template_fanout: {} }, currentRevision: 'rev-1' }), /approval/)
})

test('ambiguous matches are rejected', () => {
  assert.throws(() => validateProposal({ source: 'Original sentence. Original sentence.', proposal: base(), manifest: { shared_template_fanout: {} }, currentRevision: 'rev-1' }), /exactly one/)
})

test('manifest is deterministic and contains the v1 fields', async () => {
  const first = await readFile(resolve('integration/content_manifest.json'), 'utf8')
  const second = JSON.stringify(JSON.parse(first), null, 2) + '\n'
  assert.equal(first, second)
  const parsed = JSON.parse(first)
  assert.equal(parsed.contract_version, 'geo-research-integration/v1')
  assert.ok(parsed.pages.length > 0)
  assert.ok(parsed.pages.every((page) => page.page_id && page.canonical_url && page.content_hash && page.source_git_revision && 'shared_across_multiple_pages' in page))
})

test('contact email is disabled by default and supports an owner-supplied value', async () => {
  const site = JSON.parse(await readFile(resolve('integration/site.json'), 'utf8'))
  assert.equal(site.website.public_contact.email_enabled, false)
  assert.equal(site.website.public_contact.test_email, null)
  assert.equal(site.website.public_contact.verified_test_recipient_email, null)
  assert.equal(site.website.outreach_agent.verified_test_recipient_email, 'yuxuan.chen.1031@outlook.com')
  assert.equal(site.website.outreach_agent.recipient_approval_status, 'owner_approved')
  assert.equal(site.website.outreach_agent.mail_reception_verified, false)
  assert.equal(site.website.outreach_agent.website_contact_published, false)
  assert.equal(site.website.outreach_agent.company_classification, 'OWNER_CONTROLLED_TEST')
  assert.equal(getPublicTestContactEmail({}), null)
  assert.equal(getPublicTestContactEmail({ VITE_PUBLIC_TEST_CONTACT_EMAIL: ' owner@example.test ' }), 'owner@example.test')
})

test('deployment verification distinguishes each state', () => {
  assert.equal(verificationState({ sourceChanged: true }), 'source_only')
  assert.equal(verificationState({ gitRevision: true }), 'git_only')
  assert.equal(verificationState({ deploymentReady: true }), 'deployment_ready')
  assert.equal(verificationState({ publicVerified: true }), 'public_verified')
})

test('deployment verification includes expected hash, timestamp, and available Git revision', () => {
  const expected = 'Expected public text.'
  const response = new Response(`Before ${expected} after`, { status: 200, headers: { date: 'Thu, 22 Oct 2026 12:00:00 GMT', 'x-vercel-git-commit-sha': 'rev-public' } })
  const receipt = buildVerificationReceipt({ url: 'https://geo-ai-resume.vercel.app/example', response, body: 'Before Expected public text. after', expectedText: expected, expectedContentHash: sha256(expected) })
  assert.equal(receipt.verification.status, 'public_verified')
  assert.equal(receipt.verification.git_revision, 'rev-public')
  assert.equal(receipt.verification.deployment_timestamp, 'Thu, 22 Oct 2026 12:00:00 GMT')
})
