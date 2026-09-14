# Deploying to ParsPack

ParsPack (پارس‌پک) builds and runs this app inside a container using the
built-in Next.js server (`next build` → `next start`). This project is already
configured to meet ParsPack's requirements. This page documents them.

## Requirements (already satisfied)

| Requirement | Status | Where |
| --- | --- | --- |
| `package.json` at the repo root | ✅ | repo root |
| Valid `scripts.build` + `scripts.start` | ✅ | `"build": "next build"`, `"start": "next start -H 0.0.0.0 -p 3000"` |
| Server binds to `0.0.0.0` (never `127.0.0.1`) | ✅ | explicit `-H 0.0.0.0` in `start` |
| Port `3000` | ✅ | explicit `-p 3000` |
| Node version satisfies every dependency | ✅ | `engines.node >= 20.9.0`; dependencies pinned to Node-20-compatible versions |
| Lock file committed | ✅ | `package-lock.json` (npm) |
| No secrets committed | ✅ | `.env*` git-ignored |

## Node version

- **Minimum required: Node `20.9.0`** (Next.js 16 requirement).
- The app runs correctly on Node 20, 22, and 24.
- `.nvmrc` / `.node-version` pin Node 20 for local tooling.
- In the ParsPack panel, set the **Node.js version to 20 (or higher)**.

> ⚠️ Why Node 20? The Supabase client libraries (`@supabase/*-js`) from v2.110
> onward require Node ≥ 22. To stay compatible with Node 20 (the most widely
> available runtime on Iranian PaaS), this project pins
> `@supabase/supabase-js@2.109.0` + `@supabase/ssr@0.12.0`. Do not upgrade
> Supabase beyond these without also raising the Node version everywhere
> (`.nvmrc`, `engines`, and the ParsPack panel setting).

## Deployment steps (ParsPack panel)

1. **Create app** → category **Node.js** (or Next.js).
2. **Application Port:** `3000`.
3. **Connect source code** → GitHub (OAuth or HTTPS URL) → select
   `hnmodeq/bumim`, branch `main`.
4. **Environment variables** (in the panel, *not* committed):
   - `NEXT_PUBLIC_SITE_URL`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server-only secret)
   - Client-exposed variables must be prefixed `NEXT_PUBLIC_`.
   - If uploading an env file, it must be named **exactly `.env`**.
5. **Resources:** choose server location (e.g. Tehran/nearest) + CPU/RAM plan.
6. **Create app** and watch the build/deploy in notifications.

## Webhook (auto-deploy)

To deploy automatically on every `git push`, add a webhook in the ParsPack
panel (see ParsPack webhook docs) pointed at the app.

## Reference

- [ParsPack — Next.js docs](https://docs.parspack.com/paas/deploy/programming-languages/next-js/)
- [ParsPack — sample Next.js repo](https://github.com/parspack-paas/nextjs)
