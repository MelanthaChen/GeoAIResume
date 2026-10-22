import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

export function verificationState({ sourceChanged = false, gitRevision = false, deploymentReady = false, publicVerified = false }) {
  if (publicVerified) return 'public_verified'
  if (deploymentReady) return 'deployment_ready'
  if (gitRevision) return 'git_only'
  if (sourceChanged) return 'source_only'
  return 'not_run'
}

export function buildVerificationReceipt({ url, response, body, expectedText, expectedContentHash = null }) {
  const bodyHash = `sha256:${createHash('sha256').update(body).digest('hex')}`
  const expectedHash = `sha256:${createHash('sha256').update(expectedText).digest('hex')}`
  const contentMatch = response.ok && body.includes(expectedText) && (!expectedContentHash || expectedContentHash === expectedHash)
  const deploymentTimestamp = response.headers.get('date')
  const gitRevision = response.headers.get('x-vercel-git-commit-sha')
  return {
    contract_version: 'geo-research-integration/v1',
    deployment: { status: contentMatch ? 'public_verified' : 'deployment_ready', provider: 'vercel', production_url: url, deployed_at: deploymentTimestamp },
    verification: {
      status: contentMatch ? 'public_verified' : 'failed', checked_at: new Date().toISOString(), url, http_status: response.status,
      expected_content_hash: expectedHash, deployed_content_hash: bodyHash, content_match: contentMatch,
      deployment_timestamp: deploymentTimestamp, git_revision: gitRevision,
      notes: contentMatch ? ['Expected text and content hash verified in the public response body.'] : ['Expected public content was not verified; a Git revision alone is not deployment proof.'],
    },
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [url, expectedPath, expectedContentHash] = process.argv.slice(2)
  if (!url || !expectedPath) throw new Error('Usage: node scripts/verify-deployment.mjs <public-url> <expected-text-file> [expected-content-hash]')
  const expected = await readFile(expectedPath, 'utf8')
  const response = await fetch(url)
  const body = await response.text()
  const receipt = buildVerificationReceipt({ url, response, body, expectedText: expected, expectedContentHash: expectedContentHash || null })
  console.log(JSON.stringify(receipt, null, 2))
  if (receipt.verification.status !== 'public_verified') process.exitCode = 1
}
