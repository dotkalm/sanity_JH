import { render, screen } from '@testing-library/react';
import type { Artwork } from '@joel-portfolio/shared';

function ArtworkCard({ artwork }: { artwork: Artwork }) {
  return <div>{artwork.title}</div>;
}

test('ArtworkCard renders title', () => {
  const artwork: Artwork = {
    _id: '1',
    _type: 'artwork',
    _createdAt: '',
    _updatedAt: '',
    _rev: '',
    title: 'My Test Art',
    slug: { _type: 'slug', current: 'my-test-art' },
    year: 2024,
    medium: 'Oil',
    dimensions: '100x100cm',
    category: 'painting',
    description: '',
    assets: [],
    featured: false,
    tags: []
  };

  render(<ArtworkCard artwork={artwork} />);
  expect(screen.getByText('My Test Art')).toBeInTheDocument();
});
