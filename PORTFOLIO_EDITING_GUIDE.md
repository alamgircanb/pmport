# Portfolio editing guide

The original four portfolio names, descriptions, pictures and tools are stored in `public/data/portfolio.json`.

## Change a picture

1. Copy the image into `public/`.
2. Change the relevant `image` value to the exact filename.
3. Update `imageAlt` with a short description for accessibility.

Example:

```json
"image": "my-business-analysis-picture.png",
"imageAlt": "Business analysis workshop and process map"
```

Do not add `public/` before the filename. If the file is in `public/images/`, use `images/filename.png`.

## Change a repository link

Each project inside `workItems` has its own link:

```json
"repositoryUrl": "https://github.com/alamgircanb/repository-name"
```

Replace profile-level links with the exact repository URL when that repository is ready. Keep the full `https://` address.

## Add more work

Duplicate one object inside `workItems`, then change its title, description, link and priority. Smaller priority numbers appear first. The website makes long lists scrollable automatically.

JSON does not allow comments. Keep the final item without a trailing comma and validate the file before deployment.
