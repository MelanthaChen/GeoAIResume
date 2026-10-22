export function getPublicTestContactEmail(env) {
  const email = env?.VITE_PUBLIC_TEST_CONTACT_EMAIL?.trim()
  return email || null
}
