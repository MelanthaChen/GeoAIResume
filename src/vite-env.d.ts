/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PUBLIC_TEST_CONTACT_EMAIL?: string
  readonly VITE_SITE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
