import {defineType} from 'sanity'

export const press = defineType({
  name: 'press',
  title: 'Press',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Article Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'publication',
      title: 'Publication',
      type: 'string',
      description: 'Name of the publication, website, or media outlet',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'author',
      title: 'Author',
      type: 'string',
      description: 'Writer or journalist name',
    },
    {
      name: 'publishedDate',
      title: 'Published Date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      description: 'Brief summary or quote from the article',
    },
    {
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H1', value: 'h1'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
            {title: 'Quote', value: 'blockquote'},
          ],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
              {title: 'Underline', value: 'underline'},
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                  },
                ],
              },
            ],
          },
        },
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
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
            },
          ],
        },
      ],
    },
    {
      name: 'externalUrl',
      title: 'External URL',
      type: 'url',
      description: 'Link to the original article',
    },
    {
      name: 'featuredImage',
      title: 'Featured Image',
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
      ],
    },
    {
      name: 'featured',
      title: 'Featured Press',
      type: 'boolean',
      description: 'Highlight this press coverage',
      initialValue: false,
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Review', value: 'review'},
          {title: 'Interview', value: 'interview'},
          {title: 'Feature', value: 'feature'},
          {title: 'News', value: 'news'},
          {title: 'Profile', value: 'profile'},
          {title: 'Exhibition', value: 'exhibition'},
        ],
      },
    },
  ],
  orderings: [
    {
      title: 'Published Date (newest first)',
      name: 'publishedDesc',
      by: [
        {field: 'publishedDate', direction: 'desc'},
        {field: 'title', direction: 'asc'},
      ],
    },
    {
      title: 'Published Date (oldest first)',
      name: 'publishedAsc',
      by: [
        {field: 'publishedDate', direction: 'asc'},
        {field: 'title', direction: 'asc'},
      ],
    },
    {
      title: 'Publication A-Z',
      name: 'publicationAsc',
      by: [{field: 'publication', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'publication',
      media: 'featuredImage',
      date: 'publishedDate',
    },
    prepare(selection) {
      const {title, subtitle, media, date} = selection
      return {
        title,
        subtitle: subtitle ? `${subtitle}${date ? ` • ${new Date(date).getFullYear()}` : ''}` : undefined,
        media,
      }
    },
  },
})
