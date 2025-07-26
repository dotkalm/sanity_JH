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

# Sanity Schema Export for React Frontend

This file contains TypeScript interfaces and GROQ queries for your Sanity CMS data.

## Setup

1. **Install Sanity Client in your React project:**
```bash
npm install @sanity/client
# or
yarn add @sanity/client
```

2. **Copy the schema-types.ts file to your React project**

3. **Create a Sanity client:**
```typescript
// lib/sanity.ts
import { createClient } from '@sanity/client'
import { SANITY_CONFIG } from './schema-types'

export const client = createClient({
  ...SANITY_CONFIG,
  useCdn: true, // Set to false for preview mode
})
```

## Usage Examples

### Fetch All Artworks
```typescript
import { client } from './lib/sanity'
import { GROQ_QUERIES, type Artwork } from './schema-types'

const artworks = await client.fetch<Artwork[]>(GROQ_QUERIES.ALL_ARTWORKS)
```

### Fetch Single Artwork by Slug
```typescript
const artwork = await client.fetch<Artwork>(
  GROQ_QUERIES.ARTWORK_BY_SLUG, 
  { slug: 'my-artwork-slug' }
)
```

### Get Image URLs
```typescript
import imageUrlBuilder from '@sanity/image-url'
import { client } from './lib/sanity'

const builder = imageUrlBuilder(client)

function urlFor(source: any) {
  return builder.image(source)
}

// Usage:
const imageUrl = urlFor(artwork.mainImage).width(800).height(600).url()
```

## Project Configuration

### Configuration

- **Project ID:** `zflu9f6c`
- **Dataset:** `production`
- **API Version:** `2024-07-19`

## Document Types

### Artwork
- **Fields:** title, slug, year, medium, category, description, dimensions, assets, etc.
- **Categories:** painting, drawing, sculpture, photography, video, digital, mixed-media, installation, other
- **Assets:** Can contain images, videos, and audio files

### Press
- **Fields:** title, publication, author, publishedDate, excerpt, content, etc.
- **Categories:** review, interview, feature, news, profile, exhibition

### About
- **Fields:** title, content (portable text), featuredImage

## Available GROQ Queries

- `ALL_ARTWORKS` - Get all artworks with basic info
- `ARTWORK_BY_SLUG` - Get single artwork by slug with full details
- `ALL_PRESS` - Get all press articles
- `ABOUT` - Get about page content
- `FEATURED_ARTWORKS` - Get only featured artworks
- `ARTWORKS_BY_CATEGORY` - Filter artworks by category

## React Component Example

```tsx
import { useEffect, useState } from 'react'
import { client } from './lib/sanity'
import { GROQ_QUERIES, type Artwork } from './schema-types'

export function ArtworkGallery() {
  const [artworks, setArtworks] = useState<Artwork[]>([])

  useEffect(() => {
    client.fetch<Artwork[]>(GROQ_QUERIES.ALL_ARTWORKS)
      .then(setArtworks)
  }, [])

  return (
    <div className="gallery">
      {artworks.map(artwork => (
        <div key={artwork._id} className="artwork-card">
          <h3>{artwork.title}</h3>
          <p>{artwork.year} - {artwork.medium}</p>
        </div>
      ))}
    </div>
  )
}
```

## Next.js Example with SSG

```tsx
// pages/artworks/[slug].tsx
import { GetStaticProps, GetStaticPaths } from 'next'
import { client } from '../../lib/sanity'
import { GROQ_QUERIES, type Artwork } from '../../schema-types'

interface Props {
  artwork: Artwork
}

export default function ArtworkPage({ artwork }: Props) {
  return (
    <div>
      <h1>{artwork.title}</h1>
      <p>{artwork.year} - {artwork.medium}</p>
      <p>{artwork.description}</p>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const artworks = await client.fetch<Pick<Artwork, 'slug'>[]>(
    `*[_type == "artwork"]{ slug }`
  )
  
  const paths = artworks.map(artwork => ({
    params: { slug: artwork.slug.current }
  }))

  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const artwork = await client.fetch<Artwork>(
    GROQ_QUERIES.ARTWORK_BY_SLUG,
    { slug: params?.slug }
  )

  return { props: { artwork } }
}
```