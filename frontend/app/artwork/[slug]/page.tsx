import { Metadata } from 'next'
import { notFound } from 'next/navigation'

interface Artwork {
  slug: string
  title: string
  description: string
  imageUrl: string
  year: number
}

// Mock data - replace with your actual data source
const artworks: Artwork[] = [
  {
    slug: 'digital-dreams',
    title: 'Digital Dreams',
    description: 'A exploration of digital art and virtual reality.',
    imageUrl: '/images/digital-dreams.jpg',
    year: 2024
  },
  {
    slug: 'abstract-thoughts',
    title: 'Abstract Thoughts',
    description: 'Abstract expressions of inner contemplation.',
    imageUrl: '/images/abstract-thoughts.jpg',
    year: 2023
  },
  {
    slug: 'urban-landscapes',
    title: 'Urban Landscapes',
    description: 'Capturing the essence of modern city life.',
    imageUrl: '/images/urban-landscapes.jpg',
    year: 2023
  }
]

// Generate static params for SSG
export async function generateStaticParams() {
  return artworks.map((artwork) => ({
    slug: artwork.slug,
  }))
}

// Generate metadata for each artwork
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const artwork = artworks.find((art) => art.slug === params.slug)
  
  if (!artwork) {
    return {
      title: 'Artwork Not Found',
    }
  }

  return {
    title: `${artwork.title} - Joel Holmberg`,
    description: artwork.description,
  }
}

export default function ArtworkPage({ params }: { params: { slug: string } }) {
  const artwork = artworks.find((art) => art.slug === params.slug)

  if (!artwork) {
    notFound()
  }

  return (
    <div>
      <h2>{artwork.title}</h2>
      <p>Year: {artwork.year}</p>
      <img src={artwork.imageUrl} alt={artwork.title} />
      <p>{artwork.description}</p>
    </div>
  )
}
