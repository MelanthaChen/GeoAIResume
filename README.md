# GeoAIResume

Production React/Vite implementation of the GeoAIResume website.

## Stack

- React
- TypeScript
- Vite
- React Router
- TailwindCSS

## Development

```bash
npm install
npm run dev
```

## Production

```bash
npm run build
npm run preview
```

The build runs `scripts/generate-sitemap.mjs` before TypeScript and Vite.

## SEO Configuration

Set these environment variables for deployment-specific SEO behavior:

```bash
VITE_SITE_URL=https://your-production-domain.com
VITE_GOOGLE_SITE_VERIFICATION=your-google-verification-token
```

The site includes canonical URLs, OpenGraph, Twitter Cards, JSON-LD, robots.txt, Google verification support, and generated sitemap XML.

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
