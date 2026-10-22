import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { affectedTemplatePages, pageDescriptor, pageId, root, sha256, sitemapPaths, sourceRevision, sharedTemplates } from './integration-lib.mjs'

const paths = await sitemapPaths()
const revision = sourceRevision()
const records = []
for (const path of paths.sort()) {
  const descriptor = pageDescriptor(path)
  const source = await readFile(resolve(root, descriptor.sourceFile), 'utf8')
  const marker = descriptor.key && descriptor.key !== 'home' ? Math.max(0, source.indexOf(descriptor.key)) : 0
  const sample = source.slice(marker, marker + 1600)
  records.push({
    page_id: pageId(descriptor.type, descriptor.key),
    canonical_url: `https://geo-ai-resume.vercel.app${path}`,
    page_type: descriptor.type,
    source_file: descriptor.sourceFile,
    record_selector: descriptor.selector,
    editable_field_paths: descriptor.fields,
    content_hash: sha256(JSON.stringify({ path, source_file: descriptor.sourceFile, selector: descriptor.selector, sample })),
    source_git_revision: revision,
    shared_across_multiple_pages: Boolean(sharedTemplates[descriptor.sourceFile]),
  })
}
const templateFanout = Object.fromEntries(Object.entries(sharedTemplates).map(([file, type]) => [file, affectedTemplatePages(paths, type)]))
const manifest = { contract_version: 'geo-research-integration/v1', generated_at: 'source-revision-derived', source_git_revision: revision, pages: records, shared_template_fanout: templateFanout }
await mkdir(resolve(root, 'integration'), { recursive: true })
await writeFile(resolve(root, 'integration/content_manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`)
console.log(`Generated integration/content_manifest.json with ${records.length} pages`)
