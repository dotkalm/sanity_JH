import {defineType} from 'sanity'

export const artwork = defineType({
  name: 'artwork',
  title: 'Artwork',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'year',
      title: 'Year',
      type: 'number',
      validation: (Rule) => Rule.required().min(1900).max(new Date().getFullYear()),
    },
    {
      name: 'medium',
      title: 'Medium',
      type: 'string',
      description: 'e.g., Oil on canvas, Digital, Mixed media, etc.',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'meduium',
      title: 'Medium (Legacy)',
      type: 'string',
      description: 'Legacy field - use Medium instead',
      hidden: true,
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    },
    {
      name: 'mainImage',
      title: 'Main Image',
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
    },
    {
      name: 'assets',
      title: 'Assets',
      type: 'array',
      of: [
        {
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
        },
        {
          type: 'object',
          name: 'videoAsset',
          title: 'Video File',
          fields: [
            {
              name: 'file',
              type: 'file',
              title: 'Video File',
              options: {
                accept: 'video/*',
              },
            },
            {
              name: 'title',
              type: 'string',
              title: 'Video Title',
            },
            {
              name: 'description',
              type: 'text',
              title: 'Video Description',
            },
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'description',
            },
            prepare(selection) {
              const {title, subtitle} = selection
              return {
                title: title || 'Video',
                subtitle: subtitle || 'Video file',
                media: () => '🎬',
              }
            },
          },
        },
        {
          type: 'object',
          name: 'audioAsset',
          title: 'Audio File',
          fields: [
            {
              name: 'file',
              type: 'file',
              title: 'Audio File',
              options: {
                accept: 'audio/*',
              },
            },
            {
              name: 'title',
              type: 'string',
              title: 'Audio Title',
            },
            {
              name: 'description',
              type: 'text',
              title: 'Audio Description',
            },
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'description',
            },
            prepare(selection) {
              const {title, subtitle} = selection
              return {
                title: title || 'Audio',
                subtitle: subtitle || 'Audio file',
                media: () => '🎵',
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    },
    {
      name: 'dimensions',
      title: 'Dimensions',
      type: 'string',
      description: 'e.g., 24" x 36", 60cm x 90cm',
    },
    {
      name: 'featured',
      title: 'Featured Artwork',
      type: 'boolean',
      description: 'Show this artwork prominently',
      initialValue: false,
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
    },
  ],
  orderings: [
    {
      title: 'Year (newest first)',
      name: 'yearDesc',
      by: [
        {field: 'year', direction: 'desc'},
        {field: 'title', direction: 'asc'},
      ],
    },
    {
      title: 'Year (oldest first)',
      name: 'yearAsc',
      by: [
        {field: 'year', direction: 'asc'},
        {field: 'title', direction: 'asc'},
      ],
    },
    {
      title: 'Title A-Z',
      name: 'titleAsc',
      by: [{field: 'title', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'year',
      media: 'assets.0',
    },
    prepare(selection) {
      const {title, subtitle, media} = selection
      return {
        title,
        subtitle: subtitle ? `${subtitle}` : 'Year not specified',
        media,
      }
    },
  },
})
