# Md Alamgir Hossain — Angular Portfolio

A responsive, component-based Angular portfolio ready for Vercel. Shared navigation and footer stay consistent while each subject has its own lazy-loaded page.

## Run and build

```bash
npm install
npm start
```

Open `http://localhost:4200`. Create a production build with `npm run build`.

## Content editing (no component changes required)

All growing lists are JSON-driven in `public/data/`:

- `portfolio.json` — four portfolio areas, images, work items and repository links
- `education.json` — BBA, MBA and BIS details and searchable courses
- `media.json` — featured and listed YouTube videos
- `pm-faciliter-modules.json` — training modules, videos and evaluations
- `events.json` — four featured cards plus scrollable archive
- `resources.json` — books and articles with repository links

Use only the YouTube video ID (the part after `youtu.be/` or `watch?v=`). Lower `priority` values appear first. Lists become scrollable as they grow, so you can add entries without changing the page layout. Put new images in `public/` and reference their filename in JSON. Empty URLs intentionally display as placeholders.

## Add a new page

1. Create a standalone component under `src/app/pages/`.
2. Add its lazy route to `src/app/app.routes.ts`.
3. Add one navigation record in `src/app/app.component.ts`.

The shared sidebar, top bar and footer remain unchanged.

## Member login with Supabase

1. Create a free Supabase project and enable Email authentication.
2. Copy the project URL and **anon/publishable** key into `src/environments/environment.ts`.
3. Add your deployed URL to Supabase Authentication → URL Configuration.

Never put the service-role key in Angular. The `/pm-faciliter/member` route is protected. For production-grade authorization of private files or records, also enforce Supabase Row Level Security policies; a client-side route guard alone is not a data security boundary.

## Contact form

The form posts to the Vercel function at `api/contact.mjs`, which uses Resend. In Vercel Project Settings → Environment Variables add:

- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL` (defaults to `alamgircanb@gmail.com`)
- `CONTACT_FROM_EMAIL` (use an address on your verified Resend domain)

Copy `.env.example` only as a reference and never commit real keys. Resend’s testing sender may have recipient restrictions; verify your domain before public launch.

## Deploy to Vercel

1. Push this project to a GitHub repository.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Vercel detects Angular. Build command: `npm run build`; output directory: `dist/portfolio/browser`.
4. Add the contact environment variables and deploy.
5. In Project Settings → Domains, add your custom domain and follow the DNS instructions.
6. Add the final domain to Supabase’s allowed URLs.

`vercel.json` provides Angular route fallback while leaving `/api/*` serverless functions available.

## Main structure

```text
src/app/
  core/          # auth, services, shared models
  pages/         # one standalone component per page
public/data/     # editable content database
api/             # Vercel contact function
```
