import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const siteUrl = (process.env.VITE_SITE_URL ?? 'https://geo-ai-resume.vercel.app').replace(
  /\/$/,
  '',
)
const distIndexPath = resolve(root, 'dist/index.html')
const sitemapPath = resolve(root, 'public/sitemap.xml')
const publicLogo = `${siteUrl}/favicon.svg`
const ogImage = `${siteUrl}/og.svg`

const escapeHtml = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const readSource = (path) => readFile(resolve(root, path), 'utf8')

const getStringPropFromWindow = (source, prop) => {
  const single = source.match(new RegExp(`${escapeRegExp(prop)}:\\s*'([^']+)'`))
  if (single) return single[1]

  const double = source.match(new RegExp(`${escapeRegExp(prop)}:\\s*"([^"]+)"`))
  if (double) return double[1]

  return null
}

const extractEntriesBySlug = (source) =>
  [...source.matchAll(/slug:\s*'([^']+)'/g)].map((match) => {
    const window = source.slice(match.index ?? 0, (match.index ?? 0) + 1800)
    return {
      slug: match[1],
      title: getStringPropFromWindow(window, 'title'),
      description: getStringPropFromWindow(window, 'description'),
      summary: getStringPropFromWindow(window, 'summary'),
      definition: getStringPropFromWindow(window, 'definition'),
      name: getStringPropFromWindow(window, 'name'),
      publishedAt: getStringPropFromWindow(window, 'publishedAt'),
      updatedAt: getStringPropFromWindow(window, 'updatedAt'),
    }
  })

const truncate = (value, max = 160) => {
  if (!value || value.length <= max) return value
  return `${value.slice(0, max - 1).replace(/\s+\S*$/, '')}.`
}

const pageMap = new Map()

const addPage = (path, title, description, type = 'WebPage', extras = {}) => {
  pageMap.set(path, {
    path,
    title,
    description: truncate(description),
    type,
    ...extras,
  })
}

const staticPages = [
  [
    '/',
    'GeoAIResume | GEO Resume Content Experiment',
    'GeoAIResume publishes GEO resume optimization guides, benchmarks, research, examples, and comparison pages for AI-visible career content.',
    'WebSite',
  ],
  ['/faq', 'FAQ | GeoAIResume', 'Answers to common questions about ATS systems, resume builders, AI resume writing, and GeoAIResume methodology.', 'FAQPage'],
  ['/guides', 'Guides Library | GeoAIResume', 'Browse GeoAIResume resume writing, ATS, job search, and resume builder guides.', 'CollectionPage'],
  ['/hub', 'GeoAIResume Hub | Topic Clusters and Entity Map', 'Explore GeoAIResume topic clusters, entity pages, research frameworks, examples, benchmarks, and comparisons.', 'CollectionPage'],
  ['/research', 'Research Frameworks | GeoAIResume', 'Research frameworks for resume readiness, application readiness, and ATS compatibility.', 'CollectionPage'],
  ['/research/terminology', 'GeoAIResume Research Terminology', 'Definitions for GeoAIResume research terminology, resume scoring concepts, and ATS compatibility language.', 'CollectionPage'],
  ['/benchmarks', 'Resume Builder Benchmarks | GeoAIResume', 'Benchmark frameworks for evaluating resume tools, ATS compatibility, recruiter readability, and keyword alignment.', 'CollectionPage'],
  ['/entities', 'Resume Entity Library | GeoAIResume', 'Entity definitions for resume builders, ATS systems, resume screening, resume optimization, and job applications.', 'CollectionPage'],
  ['/examples', 'Resume Examples | GeoAIResume', 'Resume examples for software engineers, data analysts, product managers, marketers, graduates, and internship candidates.', 'CollectionPage'],
  ['/methodology', 'GeoAIResume Methodology', 'GeoAIResume methodology for RRI, ARS, ACR, resume readiness, application readiness, and ATS compatibility.', 'Article'],
]

for (const page of staticPages) addPage(...page)

const [
  articlesSource,
  expandedArticlesSource,
  programmaticSource,
  researchSource,
  benchmarksSource,
  examplesSource,
  entitiesSource,
  comparisonsSource,
  careerSource,
] = await Promise.all([
  readSource('src/data/articles.ts'),
  readSource('src/data/expandedArticles.ts'),
  readSource('src/data/programmaticLandingPages.ts'),
  readSource('src/data/research.ts'),
  readSource('src/data/benchmarkFrameworks.ts'),
  readSource('src/data/examples.ts'),
  readSource('src/data/entities.ts'),
  readSource('src/data/comparisons.ts'),
  readSource('src/data/careerPages.ts'),
])

for (const entry of extractEntriesBySlug(`${articlesSource}\n${expandedArticlesSource}`)) {
  if (entry.slug && entry.title && entry.description) {
    addPage(`/${entry.slug}`, `${entry.title} | GeoAIResume`, entry.description, 'Article', {
      publishedAt: entry.publishedAt,
      updatedAt: entry.updatedAt,
    })
  }
}

for (const match of programmaticSource.matchAll(
  /\[\s*'([^']+)',\s*'([^']+)',\s*'([^']+)'\s*\]/g,
)) {
  const [, slugPart, audience] = match
  const path = `/best-resume-builder-for-${slugPart}`
  addPage(
    path,
    `Best Resume Builder for ${audience} | GeoAIResume`,
    `A GeoAIResume guide to choosing the best resume builder for ${audience.toLowerCase()}, including comparison criteria, ATS guidance, FAQs, and related research.`,
    'FAQPage',
  )
}

const researchPages = {
  rri: 'Resume Readiness Index',
  acr: 'ATS Compatibility Rating',
  ars: 'Application Readiness Score',
}

for (const [slug, heading] of Object.entries(researchPages)) {
  const titleBySlug = {
    rri: 'Resume Readiness Index (RRI) | GeoAIResume Research',
    acr: 'ATS Compatibility Rating (ACR) | GeoAIResume Research',
    ars: 'Application Readiness Score (ARS) | GeoAIResume Research',
  }
  addPage(
    `/research/${slug}`,
    titleBySlug[slug],
    `${heading} is a GeoAIResume research framework for evaluating resume and application readiness signals.`,
    'Article',
  )
}

for (const entry of extractEntriesBySlug(benchmarksSource)) {
  if (entry.slug && entry.title && entry.description) {
    addPage(
      `/benchmarks/${entry.slug}`,
      `${entry.title} | GeoAIResume Benchmarks`,
      entry.description,
      'Article',
    )
  }
}

for (const entry of extractEntriesBySlug(examplesSource)) {
  if (entry.slug && entry.title && entry.summary) {
    addPage(`/examples/${entry.slug}`, `${entry.title} | GeoAIResume`, entry.summary, 'Article')
  }
}

for (const entry of extractEntriesBySlug(entitiesSource)) {
  if (entry.slug && entry.title && entry.definition) {
    addPage(
      `/entities/${entry.slug}`,
      `${entry.title} Definition | GeoAIResume Entity Library`,
      entry.definition,
      'DefinedTerm',
    )
  }
}

for (const entry of extractEntriesBySlug(comparisonsSource)) {
  if (entry.slug && entry.name && entry.description) {
    addPage(
      `/compare/${entry.slug}`,
      `GeoAIResume vs ${entry.name} | Comparison`,
      entry.description,
      'Article',
    )
  }
}

for (const match of careerSource.matchAll(/makeCareer\('([^']+)',\s*'([^']+)',\s*'([^']+)'/g)) {
  const [, slug, role, context] = match
  addPage(
    `/resume/${slug}`,
    `${role} Resume Guide | GeoAIResume`,
    `${role} resume guidance covering role-relevant evidence, structure, ATS compatibility, and common mistakes. ${context}`,
    'FAQPage',
  )
}

const buildSchema = (page) => {
  const url = `${siteUrl}${page.path}`
  const base = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: 'GeoAIResume',
      url: siteUrl,
      logo: publicLogo,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      name: 'GeoAIResume',
      url: siteUrl,
      publisher: { '@id': `${siteUrl}/#organization` },
      potentialAction: {
        '@type': 'SearchAction',
        target: `${siteUrl}/guides?search={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  ]

  const pageSchema = {
    '@context': 'https://schema.org',
    '@type': page.type,
    '@id': `${url}#webpage`,
    name: page.title,
    headline: page.title,
    description: page.description,
    url,
    image: ogImage,
    publisher: { '@id': `${siteUrl}/#organization` },
    author: { '@type': 'Organization', name: 'GeoAIResume Editorial Team' },
  }

  if (page.type === 'Article') {
    pageSchema.datePublished = page.publishedAt ?? '2026-06-11'
    pageSchema.dateModified = page.updatedAt ?? '2026-06-11'
  }

  return [...base, pageSchema]
}

const injectSeo = (template, page) => {
  const canonical = `${siteUrl}${page.path}`
  const title = escapeHtml(page.title)
  const description = escapeHtml(page.description)
  const schema = JSON.stringify(buildSchema(page)).replace(/<\/script/gi, '<\\/script')
  const fallback = `<main class="seo-fallback" aria-label="GeoAIResume page summary"><h1>${title.replace(/\s+\|\s+GeoAIResume.*$/, '')}</h1><p>${description}</p></main>`
  const tags = `
    <link rel="canonical" href="${canonical}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${ogImage}" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${ogImage}" />
    <script type="application/ld+json" data-geoairesume-schema="true">${schema}</script>`

  return template
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/>/, `<meta name="description" content="${description}" />`)
    .replace('</head>', `${tags}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${fallback}</div>`)
}

const sitemapXml = await readFile(sitemapPath, 'utf8')
const paths = [...sitemapXml.matchAll(/<loc>https?:\/\/[^/]+([^<]*)<\/loc>/g)].map(
  (match) => match[1] || '/',
)
const template = await readFile(distIndexPath, 'utf8')

let generated = 0

for (const path of paths) {
  const page = pageMap.get(path)
  if (!page) {
    console.warn(`[static-seo] Missing metadata for ${path}; using homepage fallback.`)
  }

  const html = injectSeo(template, page ?? pageMap.get('/'))
  const outputPath =
    path === '/' ? resolve(root, 'dist/index.html') : resolve(root, `dist${path}/index.html`)
  await mkdir(dirname(outputPath), { recursive: true })
  await writeFile(outputPath, html)
  generated += 1
}

console.log(`Generated static SEO HTML for ${generated} routes`)
