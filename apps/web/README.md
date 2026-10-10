# Lekana Web

The SvelteKit app: landing pages, sign-in (Clerk), the visual workflow editor, the run/monitor pages, the review queue and the API docs.

The browser talks only to this app. Its server routes proxy to the backends and add the user's Clerk token:

| Route | Upstream |
|-------|----------|
| `/api/*` | workflow-builder (`WORKFLOW_BASE`) |
| `/rime/*` | runtime `/api/v1/*` (`RUNTIME_BASE`) |
| `/rime/workflows/:id/events` | runtime SSE stream |
| `/enterprise/*` | optional `ENTERPRISE_BASE` |

## Develop

```bash
cp .env.example .env && npm install
npm run dev            # http://localhost:5173
npm run check && npm run lint
```

## Build

- **Docker / VM / Cloud Run:** `docker build --build-arg PUBLIC_CLERK_PUBLISHABLE_KEY=… --build-arg PUBLIC_API_URL=… .` (this sets `SVELTE_ADAPTER=node`)
- **Vercel / Netlify / Cloudflare:** deploy as-is; `adapter-auto` detects the platform.

All variables are listed in [docs/configuration.md](../../docs/configuration.md#web-appsweb).
