// Sanity Schema Types for Frontend
// Generated from Sanity Studio schemas
// Project ID: y8r70112

// Base Sanity Document
export interface SanityDocument {
  _id: string
  _type: string
  _createdAt: string
  _updatedAt: string
  _rev: string
}

// Basic Sanity Reference
export interface SanityReference {
  _type: 'reference'
  _ref: string
}

// Slug type
export interface SanitySlug {
  _type: 'slug'
  current: string
}

// Image with metadata
export interface SanityImage {
  _type: 'image'
  asset: SanityReference
  alt?: string
  caption?: string
  hotspot?: {
    x: number
    y: number
    height: number
    width: number
  }
}

// File reference
export interface SanityFile {
  _type: 'file'
  asset: SanityReference
}

// Portable Text Block Content
export interface PortableTextBlock {
  _key: string
  _type: 'block'
  children: {
    _key: string
    _type: 'span'
    marks: string[]
    text: string
  }[]
  markDefs: {
    _key: string
    _type: string
    href?: string
  }[]
  style: 'normal' | 'h1' | 'h2' | 'h3' | 'blockquote'
}

// About Document Type
export interface About extends SanityDocument {
  _type: 'about'
  title: string
  content: (PortableTextBlock | SanityImage)[]
  featuredImage?: SanityImage
  featured: boolean
}

// Asset Types for Artwork
export interface ArtworkImage {
  _key: string
  _type: 'artworkImage'
  asset: SanityReference
  alt?: string
  caption?: string
  hotspot?: {
    x: number
    y: number
    height: number
    width: number
  }
}

export interface VideoAsset {
  _key: string
  _type: 'videoAsset'
  file: SanityFile
  title?: string
  description?: string
}

export interface AudioAsset {
  _key: string
  _type: 'audioAsset'
  file: SanityFile
  title?: string
  description?: string
}

// Artwork Document Type
export interface Artwork extends SanityDocument {
  _type: 'artwork'
  title: string
  slug: SanitySlug
  year: number
  medium: string
  category: 'painting' | 'drawing' | 'sculpture' | 'photography' | 'video' | 'digital' | 'mixed-media' | 'installation' | 'other'
  description?: string
  mainImage?: SanityImage
  assets: (ArtworkImage | VideoAsset | AudioAsset)[]
  dimensions?: string
  featured: boolean
  tags: string[]
}

// Press Document Type
export interface Press extends SanityDocument {
  _type: 'press'
  title: string
  publication: string
  author?: string
  publishedDate: string
  excerpt?: string
  content?: (PortableTextBlock | SanityImage)[]
  externalUrl?: string
  featuredImage?: SanityImage
  featured: boolean
  category?: 'review' | 'interview' | 'feature' | 'news' | 'profile' | 'exhibition'
}

// Union type for all document types
export type SanityDocumentType = About | Artwork | Press

// GROQ Query Result Types
export interface ArtworkListItem {
  _id: string
  title: string
  slug: SanitySlug
  year: number
  category: string
  featured: boolean
  mainImage?: SanityImage
}

export interface PressListItem {
  _id: string
  title: string
  publication: string
  publishedDate: string
  category?: string
  featured: boolean
  featuredImage?: SanityImage
}

// Common GROQ Queries (as constants you can use)
export const GROQ_QUERIES = {
  // Get all artworks with basic info
  ALL_ARTWORKS: `*[_type == "artwork"] | order(year desc) {
    _id,
    title,
    slug,
    year,
    medium,
    category,
    featured,
    mainImage {
      asset,
      alt,
      hotspot
    }
  }`,

  // Get single artwork by slug
  ARTWORK_BY_SLUG: `*[_type == "artwork" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    year,
    medium,
    category,
    description,
    dimensions,
    featured,
    tags,
    mainImage {
      asset,
      alt,
      caption,
      hotspot
    },
    assets[] {
      _key,
      _type,
      _type == "artworkImage" => {
        asset,
        alt,
        caption,
        hotspot
      },
      _type == "videoAsset" => {
        title,
        description,
        file {
          asset
        }
      },
      _type == "audioAsset" => {
        title,
        description,
        file {
          asset
        }
      }
    }
  }`,

  // Get all press with basic info
  ALL_PRESS: `*[_type == "press"] | order(publishedDate desc) {
    _id,
    title,
    publication,
    author,
    publishedDate,
    excerpt,
    category,
    featured,
    externalUrl,
    featuredImage {
      asset,
      alt,
      hotspot
    }
  }`,

  // Get about page
  ABOUT: `*[_type == "about"][0] {
    _id,
    title,
    content,
    featuredImage {
      asset,
      alt,
      hotspot
    }
  }`,

  // Get featured artworks
  FEATURED_ARTWORKS: `*[_type == "artwork" && featured == true] | order(year desc) {
    _id,
    title,
    slug,
    year,
    medium,
    category,
    mainImage {
      asset,
      alt,
      hotspot
    }
  }`,

  // Get artworks by category
  ARTWORKS_BY_CATEGORY: `*[_type == "artwork" && category == $category] | order(year desc) {
    _id,
    title,
    slug,
    year,
    medium,
    category,
    featured,
    mainImage {
      asset,
      alt,
      hotspot
    }
  }`
} as const

// Sanity Client Configuration
export const SANITY_CONFIG = {
  projectId: 'y8r70112',
  dataset: 'production',
  apiVersion: '2024-07-19',
  useCdn: true // Use CDN for production
} as const

// Helper type for getting asset URLs
export interface SanityAssetUrl {
  url: string
  width?: number
  height?: number
}
