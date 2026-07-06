export const SITE_URL =
  import.meta.env.VITE_SITE_URL?.replace(/\/$/, '') ??
  'https://geo-ai-resume.vercel.app'

export const SITE_NAME = 'GeoAIResume'

export const DEFAULT_AUTHOR = 'GeoAIResume Editorial Team'

export const DEFAULT_LASTMOD = '2026-06-10'

export const GOOGLE_SITE_VERIFICATION = import.meta.env.VITE_GOOGLE_SITE_VERIFICATION
