# صفحة أميمة رمضان — Landing Page

Astro landing page for lead generation (private biology tutoring), deployed to Cloudflare Workers.

## What's here

- `src/pages/index.astro` — the single landing page (Arabic, RTL).
- `src/pages/api/lead.ts` — a Worker API route that validates and stores each form
  submission in Cloudflare KV.
- `wrangler.toml` — Cloudflare Workers config, including the KV binding (`LEADS`).
- `public/logo.png`, `public/favicon.svg` — brand assets.

The WhatsApp number is set once, near the top of `src/pages/index.astro`:

```ts
const WHATSAPP_NUMBER = '201090422816';
```

To switch the post-submit CTA from a direct chat to a WhatsApp **group** invite instead,
replace the `wa.me/...` links (there are two: the header button and the success-panel
button built in the `<script>` block) with your `https://chat.whatsapp.com/...` invite
link.

## One-time setup

```bash
npm install

# Create the KV namespace that stores submitted leads
npx wrangler login
npx wrangler kv namespace create LEADS
npx wrangler kv namespace create LEADS --preview
```

Each command prints an `id`. Paste them into `wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "LEADS"
id = "<id from the first command>"
preview_id = "<id from the --preview command>"
```

## Local development

```bash
npm run dev
```

Note: the KV binding is only available under `wrangler`/the Cloudflare runtime. In plain
`astro dev` the API route logs submissions to the console instead of failing, so the form
still works for local testing — use `npm run preview` (after `npm run build`) to test
against the real Workers runtime and KV locally.

## Deploy

Fastest path — deploy directly from your machine:

```bash
npm run build
npx wrangler deploy
```

### Deploying from GitHub (recommended for ongoing updates)

1. Push this project to a GitHub repo.
2. In the Cloudflare dashboard: **Workers & Pages → Create → Connect to Git**, pick the
   repo. Cloudflare will detect the Astro/Wrangler setup automatically (build command
   `npm run build`, deploy uses `wrangler.toml`).
3. Under the Worker's **Settings → Bindings**, confirm the `LEADS` KV binding is present
   (it's created automatically from `wrangler.toml` on first deploy, or add it manually
   if needed).
4. Every push to your main branch redeploys the site.

## Reading the collected leads

```bash
npx wrangler kv key list --binding=LEADS
npx wrangler kv key get "<key>" --binding=LEADS
```

Or bulk-export with `npx wrangler kv key list --binding=LEADS --remote` and a small script
looping `kv key get` — ask Claude for a one-off export script any time.

## Brand assets

`public/logo.png` and the color/type choices in `index.astro` come from the brand kit
in the "أ / اميمة" Google Drive folder. The favicon is a small original SVG made to match
that palette (not pulled from the brand kit).
