# PM Tools editing guide

The interactive page is available at `/pm-tools`.

## Main files

- `src/app/pages/pm-tools/pm-tools.component.ts` — tool definitions, sample data, saving and exports.
- `src/app/pages/pm-tools/pm-tools.component.html` — editable workspace and page layout.
- `src/app/pages/pm-tools/pm-tools.component.css` — responsive styling.
- `src/app/app.routes.ts` — `/pm-tools` route.
- `src/app/app.component.ts` — sidebar link.

## Add another PM tool

Add another object to the `tools` array in `pm-tools.component.ts`. Give it a unique `id`, its display name, description, column definitions and sample rows. The page automatically creates the selector card, editable table, local save key and export files.

## How saving works

The Save button stores each tool separately in the visitor's browser using `localStorage`. This is appropriate for a public demo because it does not send project information to the website or require a database. Clearing browser data removes saved workspaces.

## Export behaviour

- **Excel:** downloads a real `.xlsx` workbook.
- **PDF:** downloads a PDF report directly.

## Deploy

Run `npm ci`, then `npm run build`. Upload the project to the same GitHub repository connected to Vercel; Vercel will rebuild the site automatically.

See `PMPORT_UPDATE_GUIDE.md` for Diagram Studio, PERT/CPM, editable backups and custom artifact fields.
