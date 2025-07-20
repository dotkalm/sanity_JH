import {defineType} from 'sanity'

export const audioAsset = defineType({
  name: 'audioAsset',
  title: 'Audio Asset',
  type: 'object',
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
})
