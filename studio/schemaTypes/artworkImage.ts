import {defineType} from 'sanity'

export const artworkImage = defineType({
  name: 'artworkImage',
  title: 'Artwork Image',
  type: 'image',
  options: {
    hotspot: true,
  },
  fields: [
    {
      name: 'alt',
      type: 'string',
      title: 'Alternative text',
      description: 'Important for SEO and accessibility.',
    },
    {
      name: 'caption',
      type: 'string',
      title: 'Caption',
    },
  ],
})
