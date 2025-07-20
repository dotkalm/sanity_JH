# Frontend

This directory is ready for your React frontend application.

## Quick Setup Options:

### Option 1: Next.js (Recommended for art portfolios)
```bash
cd frontend
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

### Option 2: Vite + React
```bash
cd frontend
npx create-vite@latest . --template react-ts
```

### Option 3: Create React App
```bash
cd frontend
npx create-react-app . --template typescript
```

## After setup:

1. Install the shared package:
   ```bash
   yarn add @joel-portfolio/shared
   ```

2. Use the types and queries:
   ```typescript
   import { Artwork, GROQ_QUERIES, SANITY_CONFIG } from '@joel-portfolio/shared'
   import { createClient } from '@sanity/client'
   
   const client = createClient(SANITY_CONFIG)
   const artworks = await client.fetch<Artwork[]>(GROQ_QUERIES.ALL_ARTWORKS)
   ```

The shared package already includes all your Sanity types and GROQ queries!
