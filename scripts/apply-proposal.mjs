import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { root, sha256, sourceRevision } from './integration-lib.mjs'
import { validateProposal } from './proposal-validation.mjs'

const proposalPath = process.argv[2]
if (!proposalPath) throw new Error('Usage: node scripts/apply-proposal.mjs integration/proposals/<proposal>.json')
const proposal = JSON.parse(await readFile(resolve(root, proposalPath), 'utf8'))
if (proposal.human_approval_status !== 'approved' && proposal.approval?.status !== 'approved') throw new Error('Proposal refused: human approval is required')
if (proposal.source_git_revision !== sourceRevision()) throw new Error('Proposal refused: source Git revision is stale')
const location = proposal.source_field_locator ?? proposal.location
const sourcePath = resolve(root, location.source_file)
const source = await readFile(sourcePath, 'utf8')
const manifest = JSON.parse(await readFile(resolve(root, 'integration/content_manifest.json'), 'utf8'))
const { source: updatedSource } = validateProposal({ source, proposal, manifest, currentRevision: sourceRevision() })
await mkdir(resolve(root, 'integration/rollbacks'), { recursive: true })
await writeFile(resolve(root, `integration/rollbacks/${proposal.proposal_id}.json`), JSON.stringify({ proposal_id: proposal.proposal_id, source_file: location.source_file, source_git_revision: sourceRevision(), original_source_sha256: sha256(source), original_source: source }, null, 2) + '\n')
await writeFile(sourcePath, updatedSource)
console.log(`Applied approved proposal ${proposal.proposal_id}; rollback saved under integration/rollbacks/`)
