import { sha256 } from './integration-lib.mjs'

export function validateProposal({ source, proposal, manifest, currentRevision }) {
  const location = proposal.source_field_locator ?? proposal.location ?? {}
  const original = proposal.exact_original_text ?? proposal.original_text
  const replacement = proposal.replacement_text ?? proposal.proposed_text
  if (!proposal.page_id || !proposal.strategy_id || !proposal.experiment_reference) throw new Error('page_id, strategy_id, and experiment_reference are required')
  if (proposal.approval_status !== 'approved' && proposal.human_approval_status !== 'approved' && proposal.approval?.status !== 'approved') throw new Error('human approval is required')
  if (proposal.source_git_revision !== currentRevision) throw new Error('source Git revision is stale')
  if (!original || !replacement) throw new Error('exact original and replacement text are required')
  if (sha256(original) !== (location.original_text_sha256 ?? proposal.original_text_sha256)) throw new Error('original text SHA-256 does not match')
  const matches = source.split(original).length - 1
  if (matches !== 1) throw new Error(`expected exactly one text match, found ${matches}`)
  const fanout = manifest.shared_template_fanout?.[location.source_file] ?? []
  const expected = proposal.expected_affected_pages ?? []
  if (!expected.includes(proposal.page_id)) throw new Error('expected affected pages must include the proposal page')
  if (fanout.length > 0 && (expected.length !== fanout.length || expected.some((id) => !fanout.includes(id)))) throw new Error('shared-template fan-out does not match expected affected pages')
  return { source: source.replace(original, replacement), fanout }
}
