import Link from 'next/link'

// This would typically come from your API or CMS
const artworks = [
  { slug: 'digital-dreams', title: 'Digital Dreams' },
  { slug: 'abstract-thoughts', title: 'Abstract Thoughts' },
  { slug: 'urban-landscapes', title: 'Urban Landscapes' },
]

export default function ArtworkIndex() {
  return (
    <div>
      <h2>Browse Artworks</h2>
      <div>
        {artworks.map((artwork) => (
          <Link key={artwork.slug} href={`/artwork/${artwork.slug}`}>
            <h3>{artwork.title}</h3>
          </Link>
        ))}
      </div>
    </div>
  )
}
