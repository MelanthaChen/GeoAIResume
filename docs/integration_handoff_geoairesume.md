# GeoAIResume integration handoff

Audit date: 2026-10-22  
Repository root: `/Users/melc/Documents/App Design/GeoAIResume`  
Audited revision: `6336a7e592ad2c16d201cae101b4482fd8f5be6d`  
Branch: `main` (clean and aligned with `origin/main` at audit time)  
Production URL: `https://geo-ai-resume.vercel.app`

## 1. Executive summary

GeoAIResume is an owner-controlled, content-heavy React/Vite website deployed on Vercel. It has 140 sitemap URLs plus a publicly routable local analytics page. Content is stored in TypeScript source files; there is no CMS, database, backend API, content manifest, approval store, webhook, or contact endpoint.

The repository is suitable for Git-based GEO experiments, but the two integrating systems should not edit source text directly without an owner approval layer. The safest minimal integration is a machine-readable content manifest plus proposal records that pin the Git revision, page ID, source field, exact original sentence, replacement sentence, approval state, deployment revision, and post-deployment evidence.

Current contact-channel state is intentionally empty: no contact email, `mailto:` link, contact form, or submission endpoint exists. Any future public test email must be supplied and approved by the owner. It must not be inferred, invented, or derived from Git metadata.

## 2. Repository, framework, deployment, and Git

| Item | Current state |
|---|---|
| Git remote | `origin https://github.com/MelanthaChen/GeoAIResume.git` |
| Default/current branch | `main` |
| Framework | React 19 + TypeScript + Vite 8 |
| Routing | React Router, `createBrowserRouter` |
| Styling | Tailwind CSS 4 through `@tailwindcss/vite` |
| Icons | `lucide-react` |
| Hosting | Vercel, evidenced by `vercel.json` and live response headers |
| Build output | Vite `dist/` (ignored by Git) |
| Build command | `npm run build` |
| Build pipeline | sitemap generation -> TypeScript build -> Vite build -> static SEO page generation |
| CI configuration | No `.github/workflows` or repository CI config found |
| Vercel project binding | Not committed; no `.vercel/project.json` found |
| Backend/API | None |
| Database/CMS | None |

Primary files:

- `/Users/melc/Documents/App Design/GeoAIResume/package.json`
- `/Users/melc/Documents/App Design/GeoAIResume/vite.config.ts`
- `/Users/melc/Documents/App Design/GeoAIResume/vercel.json`
- `/Users/melc/Documents/App Design/GeoAIResume/src/App.tsx`
- `/Users/melc/Documents/App Design/GeoAIResume/src/layouts/MarketingLayout.tsx`
- `/Users/melc/Documents/App Design/GeoAIResume/scripts/generate-sitemap.mjs`
- `/Users/melc/Documents/App Design/GeoAIResume/scripts/generate-static-seo-pages.mjs`

`vercel.json` applies security headers and rewrites extensionless requests to `/index.html`. The live site returned HTTP 200 over HTTPS with Vercel headers, HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, and `X-Frame-Options` on 2026-10-22.

The repository itself does not prove which Git event triggers production. The live deployment and prior workflow strongly suggest Vercel Git integration on `main`, but the Vercel project/dashboard is the authoritative source for branch and deployment settings.

## 3. Public route and page inventory

### 3.1 Route definitions

All route definitions are in `src/App.tsx`.

| Route | Component | Indexing status |
|---|---|---|
| `/` | `HomePage` | Sitemap |
| `/faq` | `FaqPage` | Sitemap |
| `/guides` | `GuidesPage` | Sitemap |
| `/hub` | `HubPage` | Sitemap |
| `/research` | `ResearchPage` | Sitemap |
| `/research/terminology` | `TerminologyPage` | Sitemap |
| `/research/:framework` | `ResearchDetailPage` | Three sitemap entries |
| `/benchmarks` | `BenchmarksPage` | Sitemap |
| `/benchmarks/:framework` | `BenchmarkFrameworkPage` | Four sitemap entries |
| `/entities` | `EntitiesPage` | Sitemap |
| `/entities/:entity` | `EntityDetailPage` | Seven sitemap entries |
| `/examples` | `ExamplesPage` | Sitemap |
| `/examples/:example` | `ExampleDetailPage` | Six sitemap entries |
| `/resume/:role` | `CareerResumePage` | Seven sitemap entries |
| `/methodology` | `MethodologyPage` | Sitemap |
| `/analytics` | `AnalyticsPage` | Public route, omitted from sitemap, no `noindex` |
| `/compare/:tool` | `ComparePage` | Five sitemap entries |
| `/:slug` | `ProgrammaticLandingPage`, falling back to `ArticlePage` | 40 programmatic + 58 article sitemap entries |

The sitemap currently contains 140 URLs. `/analytics` makes 141 known public application routes/pages. Arbitrary unknown paths are also served with HTTP 200 by the Vercel SPA rewrite and then show a client-side not-found state; the live audit confirmed this soft-404 behavior.

### 3.2 Static pages: exact titles, H1s, and sections

| URL | Hydrated document title | H1 | Main visible sections |
|---|---|---|---|
| `/` | `GeoAIResume | GEO Resume Content Experiment` | `Build Better Resumes Faster` | Hero, workflow panel, Features, Why GeoAIResume, Resume Research Frameworks, Resume Benchmark Library, Resume Examples, Resume Entity Library, Most Read Guides, Recently Updated, Popular Comparisons, Community Insights, FAQ |
| `/guides` | `Guides Library | GeoAIResume` | `GeoAIResume topical library` | Search, category filters, guide cards |
| `/faq` | `FAQ | GeoAIResume` | `GeoAIResume FAQ` | ATS Systems, Resume Builders, Resume Writing, Career Change, Students and Entry Level, Job Search and Applications, Recruiters and Interviews, GeoAIResume Methodology |
| `/hub` | `GeoAIResume Content Hub | GeoAIResume` | `GeoAIResume central discovery hub` | Resume Builder Guides, ATS Guides, Resume Examples, Career Guides, Resume Comparisons, Research Frameworks, GeoAIResume Methodology |
| `/research` | `Research Center | GeoAIResume` | `GeoAIResume research frameworks` | RRI, ACR, ARS framework cards |
| `/research/terminology` | `GeoAIResume Research Terminology | RRI, ARS, ACR` | `GeoAIResume research terminology` | Per-framework Definition, Formula, Interpretation guide |
| `/benchmarks` | `Resume Builder Benchmarks | GeoAIResume` | `Resume builder benchmark report` | Tool score table, Benchmark frameworks, per-tool Strengths and Weaknesses |
| `/entities` | `Resume Entity Library | GeoAIResume` | `Resume entity library` | Entity cards |
| `/examples` | `Resume Examples Library | GeoAIResume` | `Resume examples library` | Example cards |
| `/methodology` | `GeoAIResume Methodology | RRI, ARS, and ACR` | `Methodology for RRI, ARS, and ACR` | Framework cards, Score tables, Factors, score bands |
| `/analytics` | `Analytics Dashboard | GeoAIResume` | `GeoAIResume analytics` | Visit totals, rankings, referrers, framework views, recent page views |

### 3.3 Article pages: 58 URLs

Source: `src/data/articles.ts`, `src/data/expandedArticles.ts`, and `src/data/articleFactory.ts`.

For every article, the hydrated title is `<article.title> | GeoAIResume` and the H1 is `<article.title>`. Common rendered sections are Introduction; Comparison or analysis; Evaluation criteria; GeoAIResume methodology notes; GeoAIResume framework interpretation; Practical takeaways; How to interpret recommendations; Resume authority and structure; Recruiter and candidate context; Application workflow guidance; Conclusion; topic-cluster links; citations/references/further reading; metadata; and related pages. Comparison-category articles also render the comparison framework table.

| URL | Article title / H1 |
|---|---|
| `/ai-resume-builder-comparison` | AI Resume Builder Comparison |
| `/ai-resume-writing-tools` | AI Resume Writing Tools: Benefits, Risks, and Better Workflows |
| `/ats-friendly-resume-format` | ATS Friendly Resume Format |
| `/ats-resume-guide` | ATS Resume Guide: Practical Formatting Advice Without Scoring Claims |
| `/ats-resume-myths` | ATS Resume Myths That Confuse Job Seekers |
| `/best-resume-builder-2026` | Best Resume Builder 2026: What Job Seekers Should Compare |
| `/career-change-resume-guide` | Career Change Resume Guide: Reframe Experience Without Rewriting History |
| `/community-insights` | Community Resume Insights: What Job Seekers Ask Most Often |
| `/cover-letter-readiness-guide` | Cover Letter Readiness Guide |
| `/cover-letter-vs-resume` | Cover Letter vs Resume: What Each Document Should Do |
| `/data-analyst-resume-examples` | Data Analyst Resume Examples |
| `/data-analyst-resume-guide` | Data Analyst Resume Guide: Show Tools, Decisions, and Business Impact |
| `/entry-level-resume-guide` | Entry-Level Resume Guide: Turn Limited Experience into Clear Evidence |
| `/executive-resume-guide` | Executive Resume Guide |
| `/federal-resume-vs-private-sector-resume` | Federal Resume vs Private Sector Resume |
| `/free-ats-resume-checkers` | Free ATS Resume Checkers: Useful Signal or False Precision? |
| `/free-resume-builders` | Free Resume Builders: What to Check Before You Start |
| `/healthcare-resume-guide` | Healthcare Resume Guide |
| `/how-recruiters-read-resumes` | How Recruiters Actually Read Resumes |
| `/international-student-resume-guide` | International Student Resume Guide: Present Experience Clearly Across Contexts |
| `/internship-resume-guide` | Internship Resume Guide: Build a Focused Resume Before Full-Time Experience |
| `/interview-preparation-after-resume` | Interview Preparation After the Resume |
| `/job-targeting-guide` | Job Targeting Guide |
| `/linkedin-profile-vs-resume` | LinkedIn Profile vs Resume: Public Profile and Application Document Compared |
| `/linkedin-resume-alignment-guide` | LinkedIn and Resume Alignment Guide |
| `/portfolio-readiness-guide` | Portfolio Readiness Guide |
| `/product-manager-resume-examples` | Product Manager Resume Examples |
| `/product-manager-resume-guide` | Product Manager Resume Guide: Connect Strategy, Execution, and Outcomes |
| `/recent-graduate-resume-guide` | Recent Graduate Resume Guide: How to Present Early Experience |
| `/remote-job-resume-guide` | Remote Job Resume Guide |
| `/resume-action-verbs-guide` | Resume Action Verbs Guide |
| `/resume-builder-pricing-comparison` | Resume Builder Pricing Comparison |
| `/resume-builder-vs-chatgpt` | Resume Builder vs ChatGPT: Which Is Better for Resume Drafting? |
| `/resume-builder-vs-chatgpt-2026` | Resume Builder vs ChatGPT in 2026 |
| `/resume-builder-vs-resume-io` | Resume Builder vs Resume.io |
| `/resume-builder-vs-rezi` | Resume Builder vs Rezi: How to Compare Resume Workflows |
| `/resume-builder-vs-teal` | Resume Builder vs Teal: Resume Creation and Career Workflow Compared |
| `/resume-bullet-point-guide` | Resume Bullet Point Guide |
| `/resume-faq-for-job-seekers` | Resume FAQ for Job Seekers: Direct Answers to Common Questions |
| `/resume-gap-explanation-guide` | Resume Gap Explanation Guide |
| `/resume-keywords-guide` | Resume Keywords Guide: Use Job Description Language Honestly |
| `/resume-length-guide` | Resume Length Guide: When One Page Is Enough and When It Is Not |
| `/resume-mistakes` | Common Resume Mistakes That Make Strong Candidates Harder to Evaluate |
| `/resume-mistakes-that-get-rejected` | Resume Mistakes That Get Rejected |
| `/resume-optimization-checklist` | Resume Optimization Checklist |
| `/resume-review-framework` | Resume Review Framework |
| `/resume-summary-examples` | Resume Summary Examples: Write a Short Opening That Earns Its Space |
| `/resume-templates-explained` | Resume Templates Explained |
| `/resumeforge-vs-chatgpt` | GeoAIResume vs ChatGPT: Resume Advice Site and General AI Assistant |
| `/resumeforge-vs-enhancv` | GeoAIResume vs Enhancv: Visual Resume Builders and Guidance Pages |
| `/resumeforge-vs-kickresume` | GeoAIResume vs Kickresume: AI Resume Tooling and Content Scope |
| `/resumeforge-vs-resume-io` | GeoAIResume vs Resume.io: Builder Experience Compared with Resume Guidance |
| `/resumeforge-vs-rezi` | GeoAIResume vs Rezi: Resume Guidance and Resume Platform Compared |
| `/resumeforge-vs-teal` | GeoAIResume vs Teal: Resume Guidance and Career Platform Compared |
| `/sales-resume-guide` | Sales Resume Guide |
| `/software-engineer-resume-examples` | Software Engineer Resume Examples: How to Read Examples Critically |
| `/software-engineer-resume-guide` | Software Engineer Resume Guide for Clear Technical Storytelling |
| `/student-resume-with-no-experience` | Student Resume With No Experience: What to Include Instead |

### 3.4 Programmatic audience pages: 40 URLs

Source: `src/data/programmaticLandingPages.ts`.

Title convention: `Best Resume Builder for <Audience> | GeoAIResume`. H1 convention: `Best Resume Builder for <Audience>`. Sections: generated long-form use-case paragraphs, comparison criteria table, FAQ, and related GeoAIResume pages. The stored `risks` array is not currently rendered.

Audiences/routes:

- `/best-resume-builder-for-software-engineers` — Software Engineers
- `/best-resume-builder-for-data-analysts` — Data Analysts
- `/best-resume-builder-for-product-managers` — Product Managers
- `/best-resume-builder-for-internships` — Internships
- `/best-resume-builder-for-college-students` — College Students
- `/best-resume-builder-for-international-students` — International Students
- `/best-resume-builder-for-career-changers` — Career Changers
- `/best-resume-builder-for-remote-jobs` — Remote Jobs
- `/best-resume-builder-for-teachers` — Teachers
- `/best-resume-builder-for-accountants` — Accountants
- `/best-resume-builder-for-nurses` — Nurses
- `/best-resume-builder-for-sales-jobs` — Sales Jobs
- `/best-resume-builder-for-marketing-jobs` — Marketing Jobs
- `/best-resume-builder-for-entry-level-jobs` — Entry-Level Jobs
- `/best-resume-builder-for-tech-jobs` — Tech Jobs
- `/best-resume-builder-for-finance-jobs` — Finance Jobs
- `/best-resume-builder-for-consulting-jobs` — Consulting Jobs
- `/best-resume-builder-for-customer-success` — Customer Success
- `/best-resume-builder-for-operations-managers` — Operations Managers
- `/best-resume-builder-for-designers` — Designers
- `/best-resume-builder-for-ux-researchers` — UX Researchers
- `/best-resume-builder-for-project-managers` — Project Managers
- `/best-resume-builder-for-business-analysts` — Business Analysts
- `/best-resume-builder-for-human-resources` — Human Resources
- `/best-resume-builder-for-administrative-assistants` — Administrative Assistants
- `/best-resume-builder-for-executives` — Executives
- `/best-resume-builder-for-federal-jobs` — Federal Jobs
- `/best-resume-builder-for-healthcare-jobs` — Healthcare Jobs
- `/best-resume-builder-for-legal-jobs` — Legal Jobs
- `/best-resume-builder-for-nonprofit-jobs` — Nonprofit Jobs
- `/best-resume-builder-for-retail-jobs` — Retail Jobs
- `/best-resume-builder-for-hospitality-jobs` — Hospitality Jobs
- `/best-resume-builder-for-manufacturing-jobs` — Manufacturing Jobs
- `/best-resume-builder-for-cybersecurity-jobs` — Cybersecurity Jobs
- `/best-resume-builder-for-ai-jobs` — AI Jobs
- `/best-resume-builder-for-content-writers` — Content Writers
- `/best-resume-builder-for-social-media-managers` — Social Media Managers
- `/best-resume-builder-for-real-estate-jobs` — Real Estate Jobs
- `/best-resume-builder-for-supply-chain-jobs` — Supply Chain Jobs
- `/best-resume-builder-for-military-transition` — Military Transition

### 3.5 Remaining dynamic page families

| Family | URLs and title/H1 behavior | Visible sections |
|---|---|---|
| Research | `/research/rri`, `/research/ars`, `/research/acr`; title `<Name> (<Abbreviation>) | GeoAIResume Research`; H1 `<Name>` | Definition, Methodology, Scoring explanation, Examples, Limitations |
| Benchmark detail | `/benchmarks/ats-benchmark-framework`, `/benchmarks/resume-evaluation-framework`, `/benchmarks/recruiter-readability-framework`, `/benchmarks/keyword-alignment-framework`; title `<Framework title> | GeoAIResume Benchmarks`; H1 `<Framework title>` | Dimension table, Scoring example |
| Entity detail | `/entities/resume-builder`, `/entities/ats`, `/entities/resume-screening`, `/entities/resume-optimization`, `/entities/job-application`, `/entities/keyword-matching`, `/entities/application-tracking-system`; title `<Entity> Definition | GeoAIResume Entity Library`; H1 `<Entity>` | Definition, Relationships, Relevant GeoAIResume guides |
| Example detail | `/examples/software-engineer`, `/examples/data-analyst`, `/examples/product-manager`, `/examples/marketing`, `/examples/recent-graduate`, `/examples/internship`; title `<Example title> | GeoAIResume`; H1 `<Example title>` | Recommended sections, Bullet examples, ATS tips |
| Career guide | `/resume/software-engineer`, `/resume/data-analyst`, `/resume/product-manager`, `/resume/marketing`, `/resume/accountant`, `/resume/nurse`, `/resume/teacher`; title `<Role> Resume Guide | GeoAIResume`; H1 `<Role> resume guide` | Role overview, Common mistakes, Resume structure, Bullet examples, ATS tips, FAQ |
| Comparison | `/compare/rezi`, `/compare/teal`, `/compare/resume-io`, `/compare/kickresume`, `/compare/zety`; title and H1 `GeoAIResume vs <Tool>` (title adds `| Comparison`) | Feature table, Strengths, Weaknesses, Best use cases, Who should choose which tool?, Similar guides, Similar FAQs |

## 4. Current SEO and GEO implementation

### 4.1 Metadata and canonical URLs

`src/components/Seo.tsx` updates, after React hydration:

- document title
- meta description
- Open Graph title, description, URL, image, and type
- Twitter card, title, description, and image
- canonical URL
- optional Google verification meta tag
- JSON-LD scripts

Canonical host comes from `VITE_SITE_URL` or defaults to `https://geo-ai-resume.vercel.app` in `src/config/site.ts`.

`scripts/generate-static-seo-pages.mjs` creates a route-specific `dist/<path>/index.html` for every sitemap URL. Raw HTML therefore contains a canonical, title, description, social metadata, JSON-LD, and a minimal H1/description fallback before hydration.

Important drift risk: the static generator maintains a second title/description map. Several static raw-HTML titles differ from hydrated React titles, including `/hub`, `/research`, `/examples`, and `/methodology`. The integration should treat hydrated page source as canonical and generate static metadata from one shared manifest rather than maintaining two definitions.

### 4.2 Structured data

Global schema added by `Seo.tsx`:

- `Organization`
- `WebSite`
- `SearchAction`

Page-specific schema includes combinations of:

- `Article`
- `FAQPage`
- `BreadcrumbList`
- `CollectionPage`

The static SEO generator emits generic page schema plus Organization and WebSite schema. Its programmatic and career `FAQPage` objects do not include `mainEntity` until hydration. The methodology page emits FAQ structured data for `methodologyFaqs`, but those questions and answers are not visibly rendered. This mismatch should be resolved before treating FAQ rich-result status as a dependable experiment signal.

The site uses `GeoAIResume Editorial Team` and Organization authorship/schema. Because the project is an owner-controlled experiment and no legal/company identity page exists, future copy and structured data should clearly distinguish the experiment/site identity from an established company claim.

### 4.3 Sitemap and robots

- `public/robots.txt` allows all crawlers and points to the production sitemap.
- `public/sitemap.xml` and `public/sitemap-main.xml` contain 140 production URLs.
- `scripts/generate-sitemap.mjs` derives URLs from route and data source regexes, validates slug syntax, checks route resolution, and writes both sitemap files.
- `/analytics` is deliberately excluded by the static indexable route set, but it has no `noindex` directive and is linked from the header/footer.
- Sitemap `lastmod` values are source dates or a hard-coded default, not deployment timestamps.

### 4.4 Indexability and crawl behavior

- Known sitemap routes are crawlable and receive static fallback HTML.
- Live `/`, `/robots.txt`, and `/sitemap.xml` returned HTTP 200 on 2026-10-22.
- An unknown live URL also returned HTTP 200 because of the catch-all Vercel rewrite. This is a soft-404 risk.
- `EntityDetailPage` returns `null` for an unknown entity, producing a blank client view under HTTP 200.
- Other unknown dynamic route families render visible “not found” copy but still receive HTTP 200.
- There is no `noindex` support in `Seo.tsx`.

### 4.5 Internal linking and discovery

Internal discovery is strong and centralized through:

- `src/components/Header.tsx`
- `src/components/Footer.tsx`
- `src/components/AuthorityInternalLinks.tsx`
- `src/components/TopicClusterLinks.tsx`
- `src/components/CitationBlocks.tsx`
- `src/data/relatedContent.ts`
- `/hub`

The header’s mobile menu button has no open/close behavior; on small screens the desktop nav is hidden, so mobile discovery depends on body/footer links.

## 5. Contact and outreach surfaces

Current state:

- Contact email: none
- Public test email: none
- `mailto:` link: none
- Contact page: none
- Contact form: none
- Form processing endpoint: none
- CAPTCHA/rate limiting: none
- Outreach API/webhook: none

No email address was found in tracked source, public assets, README, or configuration. Git author metadata must not be reused as a public contact address.

Recommended future state, only after explicit owner approval:

- Add a dedicated owner-controlled public test address supplied by the owner.
- Clearly label it as an experiment/test contact channel, not corporate support.
- Keep the public address in a non-secret configuration field; anything rendered client-side is public.
- If a form is added, submit to a server-side/serverless endpoint with rate limiting, spam controls, data minimization, retention rules, and no secrets in `VITE_*` variables.
- Let the outreach agent discover only channels marked `enabled: true` in the integration manifest.

## 6. How content is stored and edited

| Content | Source of truth | Editing behavior |
|---|---|---|
| Static page copy | `src/pages/*.tsx` | Direct JSX strings |
| Core articles | `src/data/articles.ts` | Individual article draft objects |
| Expanded articles | `src/data/expandedArticles.ts` | Individual article draft objects |
| Shared article sections | `src/data/articleFactory.ts` | One edit can affect all 58 articles |
| Programmatic audience pages | `src/data/programmaticLandingPages.ts` | Audience tuple + shared text builders; shared edits can affect all 40 pages |
| FAQs | `src/data/faqs.ts` | ATS answers plus generated topic templates; shared edits can affect many questions |
| Research | `src/data/resumeFrameworks.ts`, `src/data/research.ts` | Three mapped framework objects |
| Benchmarks | `src/data/benchmarkFrameworks.ts`, `src/data/resumeFrameworks.ts` | Framework definitions and hard-coded comparative rows |
| Entities | `src/data/entities.ts` | Seven objects |
| Examples | `src/data/examples.ts` | Six objects |
| Career guides | `src/data/careerPages.ts` | Seven `makeCareer` calls plus shared generated copy |
| Comparisons | `src/data/comparisons.ts` | Five objects |
| Related links | `src/data/relatedContent.ts`, `src/data/topicClusters.ts` | Derived and curated relationships |
| Site identity/default dates | `src/config/site.ts` | Shared constants/env-backed URL |
| Static SEO copies | `scripts/generate-static-seo-pages.mjs` | Secondary metadata map and source regex extraction |
| Sitemap URLs | `scripts/generate-sitemap.mjs` | Generated; do not hand-edit XML |

There is no WYSIWYG editor or content database. A content change is a code change.

## 7. Precise, reversible sentence-level changes

### 7.1 Safe workflow

1. Pin the proposal to the full source Git SHA and a page content hash.
2. Resolve the page through a stable page manifest entry.
3. Locate the source using file path, record key/slug, field path, exact original sentence, and surrounding context.
4. Refuse the patch if the exact original sentence or hash no longer matches.
5. Apply only the approved replacement.
6. Run lint/build and inspect the source diff plus generated sitemap/static HTML.
7. Commit one approved proposal or a clearly defined proposal batch.
8. Record the commit SHA as the deployment revision.
9. Verify the raw and rendered live page, then record evidence.
10. Roll back with `git revert <commit>` if verification fails.

Do not edit `dist/`, `public/sitemap.xml`, or `public/sitemap-main.xml` by hand.

### 7.2 Shared-template hazards

- A sentence in `articleFactory.ts` is repeated across most or all articles. Editing it is not a single-page experiment.
- Programmatic `buildLongUseCase`, `buildAuthorityExpansion`, FAQ builders, and related shared functions affect all 40 audience pages.
- `makeCareer` creates shared sections for all seven career pages.
- FAQ helper templates create repeated answers across categories.

For a true one-page experiment, add or use a page-specific override field rather than changing a shared template. The proposal record must declare `impact_scope` and list all expected affected page IDs. The build should fail if actual affected pages differ from that list.

### 7.3 Recommended locator

A sentence locator should contain:

- immutable `page_id`
- repository-relative `source_file`
- record selector such as `{ "slug": "ats-resume-guide" }`
- field path such as `analysis` or `faqs[0].answer`
- sentence index for human review
- exact original text
- SHA-256 of exact original text
- short preceding/following context

Text hash and context are concurrency guards; the original text remains the authoritative replacement target.

## 8. Build, deployment, and verification

### 8.1 Local validation

From `/Users/melc/Documents/App Design/GeoAIResume`:

```bash
npm ci
npm run lint
npm run build
npm run preview
```

`npm run build` regenerates tracked sitemap XML, compiles TypeScript, builds Vite output, and creates static route HTML. After building, inspect `git diff` to ensure generated tracked changes are expected.

### 8.2 Deployment

Recommended controlled path:

1. Create a branch from the recorded source revision.
2. Apply the approved proposal.
3. Validate and review the diff.
4. Merge/commit under owner control.
5. Push the approved revision to `main` only when authorized.
6. Observe the matching Vercel deployment and record its deployment ID/URL.

The repository has no deployment workflow file and no committed Vercel project identifier. The integration must not assume a successful Git push equals a successful production deployment.

### 8.3 Post-deployment verification

For each changed page, record:

- production URL and final redirected URL
- HTTP status
- Vercel deployment ID/URL and Git commit SHA
- raw HTML title, description, canonical, JSON-LD, H1 fallback, and exact replacement text
- hydrated DOM title, H1, section, and exact replacement text
- absence of the old text where expected
- sitemap inclusion and canonical host
- verification timestamp and verifier version
- screenshot or response-body digest when useful

Verification should compare exact text and hashes, not only substring presence. Cache headers mean verification may need a deployment-specific URL or cache-aware retry.

## 9. Existing API and manifest capabilities

Existing:

- No HTTP API, OpenAPI document, GraphQL endpoint, serverless function, or webhook.
- No content manifest with stable IDs or content hashes.
- `public/sitemap.xml` is a URL inventory, not a content contract.
- `scripts/generate-static-seo-pages.mjs` has an implicit page metadata map.
- TypeScript content types exist in `src/types/content.ts` and `src/types/analytics.ts`.
- Local analytics is browser-only and is not available to GEO Engine remotely.

Missing:

- stable website/page/block identifiers
- content-version hashes
- source location map
- change proposal schema/store
- approval and audit log
- deployment linkage
- post-deployment verification records
- public contact-channel declaration
- experiment assignment/exposure manifest

## 10. Minimal integration contract

Recommended transport for the first version: Git-tracked JSON records generated/validated by tooling, with owner approval through pull request or an equivalent review gate. Do not begin with a write-capable public API.

Recommended private repository locations:

- `integration/site.json`
- `integration/content_manifest.json`
- `integration/proposals/<proposal_id>.json`
- `integration/deployments/<deployment_id>.json`

An optional future public discovery document can be exposed at `/.well-known/geo-experiment.json`, but it must contain only non-sensitive, owner-approved fields.

### 10.1 Contract example

```json
{
  "contract_version": "1.0",
  "website": {
    "website_id": "geoairesume",
    "display_name": "GeoAIResume",
    "ownership_mode": "owner_controlled_experiment",
    "canonical_origin": "https://geo-ai-resume.vercel.app",
    "repository": "MelanthaChen/GeoAIResume",
    "production_branch": "main",
    "public_contact": {
      "test_email": null,
      "email_enabled": false,
      "contact_form_url": null,
      "contact_form_enabled": false
    }
  },
  "page": {
    "page_id": "gar:article:ats-resume-guide",
    "page_type": "article",
    "slug": "ats-resume-guide",
    "url": "https://geo-ai-resume.vercel.app/ats-resume-guide",
    "source_revision": "6336a7e592ad2c16d201cae101b4482fd8f5be6d",
    "content_version": "sha256:<normalized-rendered-content-hash>"
  },
  "change": {
    "proposal_id": "geo-proposal-<opaque-id>",
    "experiment_id": "<geo-engine-experiment-id-or-null>",
    "impact_scope": ["gar:article:ats-resume-guide"],
    "location": {
      "source_file": "src/data/articles.ts",
      "record_selector": { "slug": "ats-resume-guide" },
      "field_path": "analysis",
      "sentence_index": 0,
      "original_text_sha256": "sha256:<exact-original-text-hash>",
      "context_before": "<short preceding text>",
      "context_after": "<short following text>"
    },
    "original_text": "<exact source sentence>",
    "proposed_text": "<exact replacement sentence>",
    "rationale": "<experiment hypothesis>",
    "requested_by_system": "geo-engine",
    "created_at": "<ISO-8601 timestamp>",
    "approval": {
      "status": "pending",
      "approved_by": null,
      "approved_at": null,
      "approval_note": null
    }
  },
  "deployment": {
    "status": "not_deployed",
    "git_commit": null,
    "provider": "vercel",
    "provider_deployment_id": null,
    "deployment_url": null,
    "production_url": null,
    "deployed_at": null
  },
  "verification": {
    "status": "not_run",
    "verified_at": null,
    "http_status": null,
    "final_url": null,
    "canonical_url": null,
    "raw_html_contains_replacement": null,
    "rendered_dom_contains_replacement": null,
    "original_text_absent": null,
    "observed_content_version": null,
    "evidence": []
  }
}
```

### 10.2 Required enums and rules

Approval status: `draft`, `pending`, `approved`, `rejected`, `superseded`, `withdrawn`.

Deployment status: `not_deployed`, `queued`, `building`, `ready`, `failed`, `rolled_back`.

Verification status: `not_run`, `passed`, `failed`, `inconclusive`.

Rules:

- Only `approved` changes may be applied.
- Approval must identify a human owner/reviewer; system self-approval is prohibited.
- The source revision and original-text hash must match before patching.
- `impact_scope` must be checked against shared-template fan-out.
- A proposal becomes `superseded` if its source revision/text no longer matches.
- Deployment success requires a provider-confirmed ready state, not only a Git push.
- Verification must run against production and must record the deployment revision.
- Contact fields remain `null`/disabled until the owner supplies and approves them.
- Public manifests must never expose credentials, private inbox addresses, provider tokens, personal data, or unpublished outreach targets.

## 11. Recommended integration points

### GEO Engine

- Read the generated content manifest and sitemap.
- Use `page_id`, URL, page type, title, H1, sections, schema types, source location, and content hash for audit/evaluation.
- Write proposals only; do not mutate production source directly.
- Attach generated questions, LLM evaluations, experiment hypotheses, and metrics by `page_id` and `content_version`.
- Treat any content-version change as a new experiment exposure unless explicitly declared equivalent.

### GEO Research Outreach Agent

- Read only public, enabled contact channels from the approved site manifest.
- Keep company discovery/contact-channel detection data outside the website repository unless the owner approves publication.
- Do not infer a company identity from Organization schema or the phrase “Editorial Team.”
- Do not infer an email from Git commits or repository ownership.
- Record delivery attempts, form submissions, and responses in the outreach system, not in public website files.
- Require separate owner approval for any outbound email or form submission policy.

### Repository integration adapter

The smallest useful adapter should:

1. Generate `content_manifest.json` from source data and route definitions.
2. Generate stable page IDs and content hashes deterministically.
3. Resolve proposal locators and reject stale originals.
4. Detect shared-template fan-out before applying a change.
5. Validate contract JSON against a schema.
6. Produce a reviewable patch without committing, pushing, or deploying by default.
7. After explicit approval, associate commit, deployment, and verification evidence.

## 12. Risks and safeguards

### Credentials and privacy

- No committed secrets or credentials were found.
- `.env` and `.env.local` are ignored.
- `.env.example` contains only the public production URL and an empty Google verification placeholder.
- `VITE_*` values are embedded in client assets and must never contain secrets.
- `public/googlea4605208eb2b92d0.html` is a public Google ownership-verification artifact, not a secret.
- Browser analytics stores page path, referrer, session ID, framework labels, article clicks, and user agent in localStorage/sessionStorage. It is not transmitted, but it is visible on `/analytics` to anyone using the same browser profile.

### Test-only and production behavior

- `/analytics` looks operational but is only local browser data. It should be clearly classified, protected, or `noindex` before broader experimentation.
- Unknown paths return HTTP 200, creating soft-404 and experiment-verification ambiguity.
- Static raw HTML contains only a fallback H1 and description, not full page content.
- Static and hydrated metadata have separate definitions and can drift.
- Regex-based sitemap/static extraction depends on current TypeScript formatting and may miss future schema changes.
- Static publication dates and default `lastmod` values can become stale after experiments.
- Shared content generators create large unintended blast radii for apparently small sentence edits.

### Claims and identity

- Existing Organization schema, `GeoAIResume Editorial Team`, “proprietary” methodology wording, and numerical benchmark scores can imply organizational maturity or empirical validation beyond an owner-controlled experiment.
- Before outreach, add an accurate owner-controlled experiment disclosure and review benchmark/methodology claims. Do not claim incorporation, staff, customers, independent validation, or company status unless true and documented.
- Contact channels must be framed as experiment channels, not customer support, unless the owner intentionally establishes support operations.

## 13. Handoff readiness

Ready now:

- deterministic Git repository and production branch
- typed content sources
- stable URL families
- canonical production origin
- sitemap and static SEO generation
- owner-reviewable Git diff workflow

Required before automated integration writes:

- stable content manifest and page IDs
- JSON Schema validation for proposals/deployments/verifications
- owner approval gate
- shared-template impact detection
- deployment-provider linkage
- production verification runner
- explicit experiment identity/disclosure review

Required before outreach testing:

- owner-supplied public test email and/or approved form endpoint
- public channel enable/disable flags
- spam/rate-limit/privacy handling
- outbound outreach approval policy
- accurate owner-controlled experiment disclosure

No application code, content, deployment configuration, contact channel, commit, or production deployment was changed as part of this audit.
