import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

export const root = resolve(decodeURIComponent(new URL('..', import.meta.url).pathname))
export const sha256 = (value) => `sha256:${createHash('sha256').update(value).digest('hex')}`
export const sourceRevision = () => execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim()
export const pageId = (type, key) => `gar:${type}:${key || 'home'}`

export const sharedTemplates = {
  'src/data/articleFactory.ts': 'article',
  'src/data/programmaticLandingPages.ts': 'programmatic',
  'src/data/careerPages.ts': 'career',
}

export async function sitemapPaths() {
  const xml = await readFile(resolve(root, 'public/sitemap.xml'), 'utf8')
  return [...xml.matchAll(/<loc>https:\/\/geo-ai-resume\.vercel\.app([^<]*)<\/loc>/g)].map((match) => match[1])
}

export function pageDescriptor(path) {
  if (path === '/') return { type: 'static', key: 'home', sourceFile: 'src/pages/HomePage.tsx', selector: { route: '/' }, fields: ['hero', 'sections'] }
  const rules = [
    [/^\/research\/([^/]+)$/, 'research', 'src/data/resumeFrameworks.ts', ['name', 'definition', 'methodology']],
    [/^\/benchmarks\/([^/]+)$/, 'benchmark', 'src/data/benchmarkFrameworks.ts', ['title', 'dimensions']],
    [/^\/entities\/([^/]+)$/, 'entity', 'src/data/entities.ts', ['name', 'definition']],
    [/^\/examples\/([^/]+)$/, 'example', 'src/data/examples.ts', ['title', 'sections']],
    [/^\/resume\/([^/]+)$/, 'career', 'src/data/careerPages.ts', ['title', 'sections']],
    [/^\/compare\/([^/]+)$/, 'comparison', 'src/data/comparisons.ts', ['title', 'strengths', 'weaknesses']],
    [/^\/best-resume-builder-for-([^/]+)$/, 'programmatic', 'src/data/programmaticLandingPages.ts', ['audience', 'longForm', 'faq']],
  ]
  for (const [pattern, type, sourceFile, fields] of rules) {
    const match = path.match(pattern)
    if (match) return { type, key: match[1], sourceFile, selector: { slug: match[1] }, fields }
  }
  if (path === '/research' || path === '/research/terminology') return { type: 'static', key: path.slice(1).replaceAll('/', '-'), sourceFile: 'src/pages/ResearchPage.tsx', selector: { route: path }, fields: ['frameworks', 'definitions'] }
  const staticPages = { '/faq': ['FaqPage.tsx', 'faqs'], '/guides': ['GuidesPage.tsx', 'guides'], '/hub': ['HubPage.tsx', 'sections'], '/benchmarks': ['BenchmarksPage.tsx', 'benchmarks'], '/entities': ['EntitiesPage.tsx', 'entities'], '/examples': ['ExamplesPage.tsx', 'examples'], '/methodology': ['MethodologyPage.tsx', 'frameworks'] }
  if (staticPages[path]) return { type: 'static', key: path.slice(1), sourceFile: `src/pages/${staticPages[path][0]}`, selector: { route: path }, fields: [staticPages[path][1]] }
  return { type: 'article', key: path.slice(1), sourceFile: 'src/data/articles.ts', selector: { slug: path.slice(1) }, fields: ['title', 'description', 'analysis', 'faqs'] }
}

export function affectedTemplatePages(paths, templateType) {
  return paths.filter((path) => pageDescriptor(path).type === templateType).map((path) => pageId(templateType, pageDescriptor(path).key))
}
