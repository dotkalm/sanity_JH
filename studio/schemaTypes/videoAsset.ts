import {defineType} from 'sanity'

export const videoAsset = defineType({
  name: 'videoAsset',
  title: 'Video Asset',
  type: 'object',
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
})
