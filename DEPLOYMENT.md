# Deployment Instructions for GitHub Pages

## Automatic Deployment (Recommended)

The project is configured to automatically deploy to GitHub Pages when you push to the `main` branch.

### Setup Steps:

1. **Enable GitHub Pages in your repository:**
   - Go to your repository on GitHub: https://github.com/edudant/chodsky-kroj-postrekov
   - Click on **Settings** → **Pages**
   - Under "Build and deployment", select **Source: GitHub Actions**

2. **Push your code:**
   ```bash
   git add .
   git commit -m "Setup GitHub Pages deployment"
   git push origin main
   ```

3. **Wait for deployment:**
   - Go to the **Actions** tab in your repository
   - You'll see the "Deploy to GitHub Pages" workflow running
   - Once complete, your site will be live at: `https://edudant.github.io/chodsky-kroj-postrekov/`

## Manual Deployment (Alternative)

If you prefer to deploy manually:

```bash
npm run deploy
```

This will:
1. Build the project with the correct base path
2. Deploy the `dist/public` folder to the `gh-pages` branch

**Note:** For manual deployment, make sure GitHub Pages is configured to deploy from the `gh-pages` branch in Settings → Pages.

## Local Build Test

To test the production build locally:

```bash
npm run build:gh-pages
```

Then serve the `dist/public` folder with any static server.

## Important Notes

- The site will be available at: `https://edudant.github.io/chodsky-kroj-postrekov/`
- All assets and routes are configured with the `/chodsky-kroj-postrekov/` base path
- The kroj configuration is entirely client-side, so no backend is needed
- Images are loaded from the `/public` directory

## Troubleshooting

If the deployment fails:
1. Check the Actions tab for error logs
2. Ensure GitHub Pages is enabled in repository settings
3. Verify you have write permissions to the repository
4. Make sure the workflow has the correct permissions (already configured)
