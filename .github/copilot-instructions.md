# Next.js on Netlify Platform Starter - AI Coding Instructions

## Project Overview
This is a Next.js 16 (App Router) demonstration site showcasing Netlify Core Primitives (Edge Functions, Image CDN, Blob Store). It uses Tailwind CSS v4, React 19, and the React Compiler for optimizations.

## Design System
This project follows a **"Lodge & Luxury - Minimalist Travel UI"** design system. Reference [design-system.json](../../design-system.json) for comprehensive design tokens, component specifications, and visual guidelines. Key characteristics:
- **Color Palette**: Clean whites (#FFFFFF, #F8F8F8) with muted earth tones (Teal #7C9C95, Sage #A4B4A8)
- **Typography**: Clean geometric sans-serif (San Francisco, Inter, DM Sans) with strong hierarchy
- **Components**: Pill-shaped buttons, large border radius (24-32px), generous whitespace
- **Imagery**: High-fidelity architectural/nature photography with natural lighting
- **CSS**: Leverage Tailwind with design tokens (e.g., `rounded-full bg-black text-white` for pill buttons)

## Architecture & Key Concepts

### Backend & Database
- **Supabase**: This project uses Supabase as the backend database and authentication provider
- **⚠️ CRITICAL**: All backend/database operations MUST use the Supabase MCP server tools
- **Never use direct SQL** or database operations - always leverage the MCP Supabase tools for:
  - Database migrations (`apply_migration` tool)
  - SQL execution (`execute_sql` tool)
  - Branch management (dev/prod database branches)
  - Edge Function deployment
  - Type generation
- **Environment Variables**: Supabase connection requires `SUPABASE_URL` and `SUPABASE_ANON_KEY` environment variables

### Netlify-Specific Patterns
- **Development**: Always use `netlify dev` (NOT `npm run dev`) to run locally. This provides Edge Functions, Blob Store, and proper context environment variables
- **Environment Context**: Use `getNetlifyContext()` from `utils.js` to access `process.env.CONTEXT` (values: 'dev', 'deploy-preview', 'production', 'branch-deploy')
- **Edge Functions**: Located in `netlify/edge-functions/`. Example: `rewrite.js` uses geo-location to rewrite URLs based on country code
- **Blob Store**: Uses `@netlify/blobs` with `getStore()`. See `app/blobs/actions.js` for Server Actions pattern with `'use server'` directive

### Next.js Configuration Patterns
- **React Compiler**: Enabled via `reactCompiler: true` in `next.config.js`
- **Redirects & Rewrites**: Defined in `next.config.js` (NOT in middleware). Examples: `/api/health` rewrites to `/quotes/random`, `/blog` rewrites to `/classics`
- **Middleware**: Root-level `middleware.js` adds security headers and custom logging. Uses matcher config to exclude static assets

### Route Organization
- Demo pages organized by feature: `/edge`, `/blobs`, `/image-cdn`, `/revalidation`, `/routing`, `/middleware`, `/classics`
- API routes: `app/quotes/random/route.js` exports `GET()` handler with `export const dynamic = 'force-dynamic'` to prevent caching

### Component Patterns
- **Reusable UI**: Components in `components/` folder (e.g., `Card`, `Markdown`, `ContextAlert`)
- **Layout**: Single root layout at `app/layout.jsx` with Header/Footer wrapping all pages
- **Metadata**: Set via `export const metadata = { title: '...' }` in pages/layouts
- **Server Actions**: Use `'use server'` directive at top of file (see `app/blobs/actions.js`)

## Development Workflows

### Local Development
```bash
netlify link              # Link to deployed site (first time only)
netlify dev              # Run dev server (uses port 8888)
npm run build            # Build for production
npm run lint             # Run ESLint
```

### Supabase Database Operations
```javascript
// ⚠️ NEVER write database code directly - use MCP Supabase tools instead
// Use MCP tools like:
// - mcp_supabase_apply_migration for schema changes
// - mcp_supabase_execute_sql for queries  
// - mcp_supabase_generate_typescript_types for type generation
// - mcp_supabase_get_advisors for security/performance checks
```

### Blob Store Usage
```javascript
import { getStore } from '@netlify/blobs';

const store = getStore({ name: 'shapes', consistency: 'strong' });
await store.setJSON(key, data);      // Upload
const data = await store.get(key, { type: 'json' }); // Retrieve
const list = await store.list();    // List all
```

### Edge Function Pattern (framework-agnostic)
```javascript
// netlify/edge-functions/myfunction.js
export default async (request, context) => {
  // Access geo data via context.geo
  return new Response('Hello');
};
export const config = { path: '/my-route' };
```

## Project-Specific Conventions

### File Naming
- Components: PascalCase exports, kebab-case filenames (e.g., `context-alert.jsx` exports `ContextAlert`)
- Route files: lowercase with hyphens (e.g., `image-cdn/`, `not-australia/`)
- Configuration: ES modules (`.js` not `.mjs`), using `export default`

### Styling
- Tailwind v4 with PostCSS plugin architecture
- Global styles in `styles/globals.css`
- Blue theme with noise texture background: `bg-blue-900 bg-noise`

### Data & Static Assets
- Static JSON data in `data/` folder (e.g., `quotes.json`)
- Images in `public/images/`
- SVG icons in `public/` root

### Feature Flags
- `uploadDisabled` constant in `utils.js` controls blob upload functionality across the demo

## Important Gotchas

1. **Supabase MCP Required**: ALL database operations must use Supabase MCP server tools - never write raw SQL or direct database code
2. **Never use `npm run dev`** - must use `netlify dev` for proper Edge Function and Blob Store functionality
3. **Server Actions require `'use server'`** at the file top, not inline
4. **Dynamic routes need `export const dynamic = 'force-dynamic'`** to prevent Next.js caching
5. **Middleware matcher** must exclude `_next/static`, `_next/image`, and static assets
6. **Context-aware rendering**: Check `getNetlifyContext()` returns truthy before rendering context-dependent features
