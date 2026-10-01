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

## PM Knowledge Lake

Existing books and articles are still loaded from `public/data/resources.json`. The featured Canada article is at `/resources/future-project-management-canada`. Its full text and reference links are in `src/app/pages/article/article.component.ts`. The exact selected illustration is `public/future-project-management-canada.png`.

## Project artifacts

PM Tools includes 22 templates: the original Gantt, RACI, RAID, stakeholder register, WBS and EVM tools, plus charter, business case, scope, milestones, communications, budget, change requests, status, actions, decisions, backlog, user stories, traceability, lessons learned, closure and benefits tracking.

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
