# PMPORT — Project Management, Learning & Practice
[![Architecture diagram of alamgircanb/pmport](https://gitdiagram.com/alamgircanb/pmport/diagram.png)](https://gitdiagram.com/alamgircanb/pmport?utm_source=readme&utm_medium=picture)
A responsive Angular learning platform and portfolio, with rotating Home banners, project artifacts, Diagram Studio, and a PERT/CPM calculator. See `PMPORT_UPDATE_GUIDE.md` for the updated structure and editing instructions.
## Run and build

```bash
npm install
npm start
```

Open `http://localhost:4200`. Create a production build with `npm run build`.

## Content editing (no component changes required)

All growing lists are JSON-driven in `public/data/`:

- `home-slides.json` — rotating Home banner content
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

## Repo map

A quick guide to where everything lives and which part of the site it powers.

```text
pmport/
├── .github/workflows/deploy.yml   # CI/CD workflow
├── api/
│   └── contact.mjs                # Vercel function for the contact form (Resend)
├── previews/                      # Screenshots used in docs (Home, Mobile, Diagram, CPM)
├── public/                        # Static assets served as-is
│   ├── card/index.html            # Digital business card -> pmport.ca/card
│   ├── data/                      # JSON content "database" (edit here, no code changes)
│   ├── datalab/                   # DataLab practice files (Excel workbook + CSVs)
│   ├── og/                        # Open Graph / social share images
│   └── *.webp, *.png              # Article covers, banners and icons
├── scripts/
│   ├── seo-pages.mjs              # Generates SEO page data
│   └── sample-questions.mjs       # Builds sample exam questions
├── src/
│   ├── index.html, main.ts, styles.css
│   ├── environments/environment.ts  # Supabase URL + public key
│   └── app/
│       ├── app.component.*        # Shell: sidebar, top bar, footer, navigation
│       ├── app.routes.ts          # All lazy-loaded routes
│       ├── app.config.ts
│       ├── core/                  # Shared logic used across pages
│       │   ├── auth/              # Auth service + route guard (Supabase)
│       │   ├── models/            # Shared TypeScript models
│       │   ├── progress/          # Learner progress tracking
│       │   ├── related/           # "Related reading" component
│       │   ├── search/            # Site-wide search
│       │   ├── seo/               # Page titles, meta tags, seo-pages.json
│       │   ├── services/          # content.service.ts (loads public/data JSON)
│       │   ├── analytics.ts       # Google Analytics 4 helper
│       │   ├── export-utils.ts    # Export/download helpers
│       │   └── navigation.ts
│       └── pages/                 # One folder per page (see table below)
├── angular.json, package.json     # Angular + npm config
├── vercel.json                    # Route fallback for the SPA + /api functions
└── *_GUIDE.md                     # Editing guides (update, portfolio, tools)
```

### Pages → site routes

| Folder in `src/app/pages/` | Route(s) on pmport.ca | What it is |
|---|---|---|
| `home` | `/` | Home with rotating banners |
| `start-here`, `about-pmport` | `/start-here`, `/about-pmport` | Orientation and about the site |
| `about`, `education`, `credentials` | `/about`, `/education`, `/credentials` | Profile, degrees, certifications |
| `portfolio` | `/portfolio`, `/portfolio/course-work`, `/portfolio/professional-work` | Portfolio areas and work items |
| `pm-tools`, `diagram`, `pert` | `/pm-tools`, `/pm-tools/ba`, `/pm-tools/teams`, `/pm-tools/diagram-studio`, `/pm-tools/pert-cpm` | Artifacts Lab, Diagram Studio, PERT/CPM |
| `calculators` | `/pm-calculators/...` | EVM, PERT, risk EMV and other calculators |
| `datalab` | `/pm-datalab`, `/pm-datalab/sql`, `/pm-datalab/excel` | DataLab: SQL / Excel / DAX / Python practice |
| `playground` | `/pm-playground`, `/pm-playground/chart-lab` | Chart Lab and simulations |
| `pm-faciliter`, `pmp-exam`, `member` | `/pm-faciliter/...` | Training modules, PMP/CAPM/ECBA/CBAP/CCMP/RMP/ITIL exam simulators, member area |
| `pm-handaid` | `/pm-handaid` | NotePad |
| `pm-jobs-prep` | `/pm-jobs-prep` | Job and interview prep |
| `journeys`, `daily-practice` | `/journeys`, `/my-progress`, `/daily-practice` | Learning paths and progress |
| `glossary` | `/pm-glossary` | PM glossary |
| `resources` + article folders | `/resources/...` | Books, articles and study guides |
| `tips-n-tech` | `/tips-n-tech/...` | Tips n Tech (GitHub URL tricks, Claude tips) |
| `learning-links` | `/pm-learninglink` | Curated learning links |
| `media`, `events` | `/media`, `/events` | YouTube videos and events |
| `contact` | — (`/contact` currently redirects to `/about-pmport`) | Contact form component (posts to `api/contact.mjs`) |
| `auth` | `/login` | Member login (only active once Supabase is configured) |
| `not-found` | `**` | 404 page |
