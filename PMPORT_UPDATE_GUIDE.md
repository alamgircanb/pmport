# PMPORT update guide

## Run and build

Use Node.js 20.19+ or 22.12+ (Angular 20 requirements).

1. Extract the ZIP.
2. Open a terminal in `pmport-main`.
3. Run `npm ci`.
4. Run `npm start` for local development, or `npm run build` for production.
5. Production browser files are in `dist/portfolio/browser`.

This package preserves the existing Vercel configuration, GitHub deployment workflow, contact API and member integration. Deployment does not happen when you extract the ZIP. Keep any existing environment settings when updating your repository.

## Navigation and existing content

Home is the PMPORT landing page. About PMPORT introduces the platform. Portfolio expands to About Alamgir, All selected work, Course Work, Professional Work, Education and Credentials.

The original `/about`, `/education`, `/portfolio`, `/credentials`, `/media`, `/events`, `/resources`, `/pm-tools`, `/pm-faciliter`, `/contact`, `/login` and member routes remain available.

- Sidebar: `src/app/app.component.ts` and `app.component.html`.
- Original images, YouTube IDs and JSON content remain unchanged.
- Course Work currently displays the data/analysis, systems development and academic portfolio areas. Professional Work displays the project/program/change leadership area. Adjust the area filter if you add a different classification later.

## Rotating Home banner

Edit `public/data/home-slides.json` to add or change slides. Fields: `id`, `label`, `title`, `description`, `image`, `alt`, `path`, `action`, `published`.

Slides follow the order in the file. Set `published` to false to hide a slide. Use a valid image in `public/` and an existing internal route. The banner rotates every 7 seconds and pauses on hover, focus and hidden tabs. Arrows, dots, pause/play and mobile swiping are supported. Reduced-motion visitors start with rotation paused.

## Facebook and LinkedIn posts (Events page)

Edit `public/data/social-posts.json`. Each item needs `id` (unique, no spaces), `platform` (`linkedin` or `facebook`), `title`, `url` and `priority` (lower shows first). Optional: `description`, `date`, `published` (false hides it), `height` (embed height in pixels) and `embedUrl`.

- **LinkedIn post:** on the post, open the **…** menu → **Copy link to post**, and paste it as `url`. If a post doesn't display, use **…** → **Embed this post** and paste the whole embed code (or its `src` address) as `embedUrl`.
- **Facebook post or video:** open the post's date/time link and paste the address as `url`. The post must be **Public**.
- **Facebook or LinkedIn event:** paste the event link as `url`. Events can't be embedded, so they show as a card with an "Open on Facebook/LinkedIn" button.

The section appears under the event cards. It moves to the next post every 30 seconds, pauses while the pointer or keyboard focus is on a post, and stops rotating once a visitor picks a post.

## Search and sharing (SEO)

Every public page's Google title, description and LinkedIn/Facebook preview image are set in `src/app/core/seo/seo-pages.json`. Preview images are 1200×630 JPGs in `public/og/`. When you add a new page, add one entry to that file: the build (`scripts/seo-pages.mjs`) then creates the page's search-friendly HTML and adds it to `sitemap.xml` automatically.

## Knowledge Lake

Existing books and articles are still loaded from `public/data/resources.json`. The featured Canada article is at `/resources/future-project-management-canada`. Its full text and reference links are in `src/app/pages/article/article.component.ts`. The exact selected illustration is `public/future-project-management-canada.webp`.

## Project artifacts

Artifacts Lab (the /pm-tools page) includes 22 templates: the original Gantt, RACI, RAID, stakeholder register, WBS and EVM tools, plus charter, business case, scope, milestones, communications, budget, change requests, status, actions, decisions, backlog, user stories, traceability, lessons learned, closure and benefits tracking.

Visitors can edit, add, reorder and delete rows; add and remove columns; save per tool in browser storage; download/import editable JSON; and export real `.xlsx` workbooks or PDF reports. Save before switching tools. Leaving a page with unsaved changes requests confirmation. Browser data is local to the device; there is no account synchronization for these tools.

Template definitions are in `src/app/pages/pm-tools/pm-tools.component.ts`. Example data is illustrative.

## Diagram Studio

Route: `/pm-tools/diagram-studio`.

- Templates: blank, context, DFD overview, DFD decomposition, process, swimlane process, WBS, organization chart and stakeholder map.
- Add shapes and text, drag and snap to grid, edit label/colour/size/position, duplicate/delete, connect nodes, edit/delete connectors, undo/redo and zoom.
- Save/open one current diagram on the device or keep multiple editable JSON files.
- Export PNG, JPG or PDF. Export omits grid and selection outlines and includes the full canvas.
- Drawing notation is a starting point; there is no automatic DFD balancing or semantic validation.
- DFD naming varies between courses: adjust labels to your instructor's convention.

## PERT / CPM

Route: `/pm-tools/pert-cpm`.

Use unique activity IDs and comma-separated predecessor IDs. Choose CPM fixed durations or PERT three-point estimates. The calculator checks duplicate/missing IDs, invalid estimates and circular dependencies; computes forward/backward passes, ES/EF/LS/LF, total float, project duration and critical paths; and generates an activity-on-node network.

Assumptions: finish-to-start, zero lag, unlimited resources, consistent time units, time starts at zero, no working-day calendar. Multiple critical paths are supported; the display lists up to 200 paths. PERT uses expected durations and reports per-activity variance; it does not calculate a full probabilistic completion-date distribution.

Network exports: PNG/JPG/PDF. Calculation exports: XLSX/PDF. Editable schedules: JSON and browser save/open.

## Verification

The production build compiles the Angular templates and TypeScript. Independent schedule checks cover branching, multiple critical paths, disconnected endpoints, zero duration, PERT variance and error cases. Browser checks also passed for carousel controls, artifact save/reload, custom fields, all public routes, mobile navigation and page width. Exported PNG/JPG/PDF/XLSX files were opened and checked for valid content. No page runtime errors were observed in these checks. Run `npm run test:schedule`; the checks are in `tests/schedule.test.cjs`.

All 18 original public assets and data files, including pictures, portfolio repository URLs and YouTube IDs, were checked byte-for-byte against the uploaded ZIP. The credential component was also checked unchanged.

The event display recovers a title from a nonstandard title key in the original events JSON without changing that file. Draft example event cards are excluded from the Home feature area.

## DataLab (/pm-datalab)

- Pages live in `src/app/pages/datalab/`. All five modules use one fictional dataset in `datalab-data.ts`. The same data is also in `public/datalab/*.csv` and in the practice workbook `public/datalab/pm-datalab-practice.xlsx`. If you change the data, update all three.
- Exercises:
  - SQL: `sql-lab-data.ts`
  - Excel: `excel-lab-data.ts`
  - DAX: `dax-data.ts`
  - Python: `python-lab-data.ts`
- Each exercise has a model solution. A learner's answer counts as correct when it gives the same result as the model solution.
- The SQL lab (sql.js) and the Python lab (Pyodide) load from cdn.jsdelivr.net when a visitor uses them.
- The Excel lab uses its own formula engine (`excel-engine.ts`), so nothing extra is downloaded.
- Progress is saved in the visitor's browser only (localStorage).

## Calculators (/pm-calculators) and Glossary (/pm-glossary)

- **Calculators:** each one is its own component in `src/app/pages/calculators/`. All the maths is in `calc-math.ts`. To add a calculator:
  - add it to `CALCULATORS` in `calc-shared.ts`;
  - add a route in `app.routes.ts`;
  - add an entry in `seo-pages.json`;
  - add a line in `articleSources` in `scripts/seo-pages.mjs`.
- **Glossary:** every term is in `src/app/pages/glossary/glossary-data.json` (term, slug, category, definition, example, related slugs).
  - Each term automatically gets its own page at `/pm-glossary/<slug>`, its own search title and description, structured data, and a sitemap entry. No other changes are needed.
  - Keep `related` pointing at slugs that exist.

## Playground (/pm-playground)
- Model (all the maths): `src/app/pages/playground/playground-model.ts`. Change effect sizes there (onboarding `RAMP`, meeting/WIP/testing factors, defect fix cost, overtime fatigue).
- Challenges: the `CHALLENGES` array in the same file. Each has starting `params`, a `goal` text and a `check()` rule. After changing a challenge, make sure it fails with its starting settings and passes with the fix described in its `hint`.
- Page and charts: `src/app/pages/playground/playground.component.ts`.
- Search-engine text for the page: `customHtml['pm-playground']` in `scripts/seo-pages.mjs`; title and description in `src/app/core/seo/seo-pages.json`.
- Shareable links: `?challenge=<id>` or the settings as query parameters (see `toQuery`/`fromQuery`).
- Playgrounds 2–5 (Kanban flow, risk and reserve, change adoption, technical debt) live in `src/app/pages/playground/sims/` (one file each; shared types in `sim-engine.ts`). Each file holds the model, its controls (`setup`, `levers`, `disturbances`), charts, challenges and principle cards. `sim-panel.component.ts` draws any of them, so a new playground is one new file plus one entry in `sims` in `playground.component.ts`.
- After changing a model or a challenge, check that each challenge fails with its starting settings and passes with the fix in its hint (runs use a fixed seed, so results are repeatable).

## Module names (October 2026)
- Module names no longer start with "PM": Artifacts Lab, Faciliter, JOBS Prep, Media, Events & Gallery, Knowledge Lake, LearningLink, DataLab, Playground, Calculators, Glossary. PM HandAid is now **NotePad**.
- Web addresses did not change (for example NotePad is still /pm-handaid), so links and Google indexing keep working. Search-engine titles keep descriptive words such as "Project Management" in `src/app/core/seo/seo-pages.json`.

## Exam Faciliter: certifications and exam simulators (/pm-faciliter)

- **Navigation:** "Exam Faciliter" is a parent item in the sidebar with children PMP, CAPM, ECBA, CBAP and ITIL 5 Foundation (`navigation` in `src/app/app.component.ts`). The Exam Faciliter page lists the certifications; each card opens that certification's own simulator page, with a smaller link to its exam guide. Training modules and the practice bank sit below under "More practice".

- **Certifications:** PMP, CAPM, ECBA, CBAP and ITIL 5 Foundation. Each has an overview page (`/pm-faciliter/<id>`, ITIL is `/pm-faciliter/itil-foundation`) and an exam simulator (`/pm-faciliter/<id>-exam-simulator`). Overview text (facts, outline, eligibility, study plan, FAQ) lives in `src/app/pages/pm-faciliter/certifications.json`.
- **One simulator for all:** `src/app/pages/pmp-exam/` holds the shared engine (`exam-engine.ts`), the shared page (`exam-simulator.base.ts`, `pmp-exam.component.html/.css`) and one small component per certification. Everything that differs (timing, breaks, sections, domains and weights, tasks, page text, rating cut-offs) is in `programs/<cert>-program.ts`.
- **Question banks:** `banks/<cert>/` (CAPM, ECBA, CBAP, ITIL) use the compact format in `banks/authoring.ts`: `[task, stem, options, answer, explanation, reference, approach?]`. Write the correct option first; the simulator shuffles options. Matching items use `[task, stem, [[left, choiceIndex]...], choices, explanation, reference]`. CBAP case studies use `caseQs` with `[domain, item]` pairs and case ids that are unique across exams (for example `CB3-A`). PMP questions stay in `questions/`.
- **Counts:** CAPM 5 × 150, ECBA 5 × 50, CBAP 5 × 120 (3 cases × 4 questions per exam), ITIL 5 × 40. Keep per-domain counts close to the weights in the program file.
- **Adding a question or exam:** add items to the right domain array, keep question ids stable (they are generated from position, so add new items at the end of a domain array to avoid renumbering saved attempts), and add a new exam to `banks/<cert>/index.ts`.
- **Writing good items:** make wrong options plausible and about the same length as the correct one, so the longest option is not a giveaway. All questions are original; do not copy or credit other prep sites.
- **Saved attempts:** each certification stores progress in the browser under its own key prefix (`store` in the program file). Attempts that refer to removed question ids are ignored.
