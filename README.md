# Md Alamgir Hossain — Portfolio

An Angular and TypeScript professional portfolio configured for automatic deployment to GitHub Pages.

## Publish on GitHub Pages

1. Create a new public GitHub repository, for example `portfolio`.
2. Upload every file and folder from this project to the repository root, or push them with Git.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment → Source**, select **GitHub Actions**.
5. Open the **Actions** tab and wait for “Deploy portfolio to GitHub Pages” to finish.
6. The site will be available at `https://YOUR-USERNAME.github.io/REPOSITORY-NAME/`.

The deployment workflow automatically detects the repository name and sets Angular’s base path correctly.

## Run locally

```bash
npm install
npm start
```

Open `http://localhost:4200`.

## Build locally

```bash
npm run build
```

## Customize

- Edit page content in `src/app/app.component.html`.
- Edit project cards, priorities, image names, GitHub links, YouTube videos, events, books and articles in `src/app/app.component.ts`. Comments beside each section explain exactly what to replace.
- Edit the design in `src/app/app.component.css` and `src/styles.css`.
- Add images, a résumé, or certificates to `public/`, then link to them from the page.
- Replace or add social profile URLs before publishing.
