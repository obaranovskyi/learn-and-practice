# 📚 English Grammar - Learn & Practice

A comprehensive English grammar learning platform with lessons, exercises, and Anki-style flashcards.

## Features

- 📖 **Content** - Clear explanations with examples and tables
- ✍️ **Exercises** - Practice questions with answers
- 🃏 **Flashcards** - Anki-style spaced repetition

## Current Topics

### Verb Tenses
1. Simple Present
2. Present Continuous
3. Present Perfect Simple
4. Present Perfect Continuous
5. Simple Past

### Other Topics
6. Articles (A, An, The)
7. First Conditional

*More topics coming soon! (287 total planned)*

## Quick Start

```bash
npm install
npm run generate-manifest
npm run dev
```

## Flashcard Controls

| Key | Action |
|-----|--------|
| **Enter** | Show answer |
| **Y** | Know it (card done) |
| **N** | Don't know (card to middle) |

## Adding Topics

1. Create folder: `public/markdowns/NNN-topic-name/`
2. Add files:
   - `index.md` - Main content
   - `exercises.md` - Practice questions
   - `flashcards.json` - Flashcard data
   - `meta.json` - Title and order
3. Run `npm run generate-manifest`

### Example meta.json
```json
{
  "title": "Topic Name",
  "description": "Brief description",
  "order": 8
}
```

### Example flashcards.json
```json
[
  {
    "id": 1,
    "question": "What is...?",
    "answer": "It is..."
  }
]
```

## Tech Stack

- React + Vite
- Tailwind CSS + shadcn/ui
- react-markdown + remark-gfm

## Deployment

Push to `main` → Auto-deploys to GitHub Pages

**Live site:** https://obaranovskyi.github.io/learn-and-practice/
