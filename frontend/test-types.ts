import type { Artwork, Press, About } from '@joel-portfolio/shared';
import { SANITY_CONFIG, GROQ_QUERIES } from '@joel-portfolio/shared';

// Test file to verify shared types work
console.log('Sanity Config:', SANITY_CONFIG);
console.log('Available Queries:', Object.keys(GROQ_QUERIES));

// Example usage of types
const exampleArtwork: Artwork = {
  _id: 'test-id',
  _type: 'artwork',
  _createdAt: new Date().toISOString(),
  _updatedAt: new Date().toISOString(),
  _rev: '1',
  title: 'Test Artwork',
  slug: { 
    _type: 'slug',
    current: 'test-artwork' 
  },
  year: 2024,
  medium: 'Digital',
  dimensions: '100x100cm',
  category: 'painting',
  description: 'A test artwork',
  assets: [],
  featured: false,
  tags: ['test', 'digital']
};

console.log('Example artwork:', exampleArtwork);

export { exampleArtwork };
