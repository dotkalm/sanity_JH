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

- **Project ID:** `y8r70112`
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
