# Learn & Practice

A generic learning application built with React + Vite that displays topics from markdown files with exercises and navigation.

## Features

- 📚 Dynamic table of contents from markdown files
- 📝 Markdown rendering with GFM support
- 🏋️ Exercises section for each topic
- ⬅️➡️ Previous/Next navigation (+ keyboard arrows)
- 🎨 Modern UI with shadcn/ui components
- 🚀 GitHub Pages ready

## Quick Start

```bash
npm install
npm run generate-manifest
npm run dev
```

## Adding Content

1. Create a new folder in `public/markdowns/` with format `NN-topic-name`:
   ```
   public/markdowns/03-advanced/
   ```

2. Add required files:
   - `index.md` - Main content
   - `exercises.md` - Practice questions
   - `meta.json` - Metadata

3. Example `meta.json`:
   ```json
   {
     "title": "Advanced Topics",
     "description": "Deep dive into advanced concepts",
     "order": 3
   }
   ```

4. Regenerate manifest:
   ```bash
   npm run generate-manifest
   ```

## Deployment

### GitHub Pages (Automatic)

Push to `main` branch - GitHub Actions will build and deploy automatically.

### Manual Build

```bash
npm run build
```

Output will be in `/dist` folder.

## Configuration

Update `vite.config.js` base path for your repository:

```js
export default defineConfig({
  base: '/your-repo-name/',
  // ...
})
```

## Tech Stack

- React 18
- Vite 6
- React Router 7
- react-markdown + remark-gfm
- shadcn/ui components
- Tailwind CSS

All dependencies are MIT licensed.
