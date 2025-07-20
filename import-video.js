#!/usr/bin/env node
const { createClient } = require('@sanity/client')
const fs = require('fs')
const path = require('path')

// Initialize Sanity client
const client = createClient({
  projectId: 'y8r70112',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-07-19',
  token: process.env.SANITY_AUTH_TOKEN,
})

// Generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-')
}

// Import the hand flurry video
async function importVideoArtwork() {
  console.log('🎬 Importing Hand Flurry video artwork...\n')
  
  // Check if we have an auth token
  if (!process.env.SANITY_AUTH_TOKEN) {
    console.error('❌ SANITY_AUTH_TOKEN environment variable is required')
    process.exit(1)
  }

  // Video artwork data
  const artworkData = {
    filename: 'hand-flurry-16x9.mov',
    title: 'Hand Flurry',
    year: 2008,
    medium: 'Single channel video no sound 01:01',
    category: 'video'
  }

  // Check if this artwork already exists
  console.log('🔍 Checking if artwork already exists...')
  const existingArtwork = await client.fetch(`*[_type == "artwork" && title == $title][0]`, {
    title: artworkData.title
  })

  if (existingArtwork) {
    console.log(`⏭️  Artwork "${artworkData.title}" already exists (${existingArtwork._id})`)
    return
  }

  try {
    const videoPath = path.join(__dirname, 'static', artworkData.filename)
    
    if (!fs.existsSync(videoPath)) {
      console.error(`❌ Video file not found: ${videoPath}`)
      return
    }

    console.log(`📤 Uploading video: ${artworkData.title}...`)
    console.log(`📁 File size: ${(fs.statSync(videoPath).size / (1024*1024)).toFixed(2)} MB`)

    // Upload video asset
    const videoAsset = await client.assets.upload('file', fs.createReadStream(videoPath), {
      filename: artworkData.filename,
    })

    console.log(`✅ Video uploaded for ${artworkData.title}`)

    // Create artwork document
    const artworkDoc = {
      _type: 'artwork',
      title: artworkData.title,
      slug: {
        _type: 'slug',
        current: generateSlug(artworkData.title)
      },
      year: artworkData.year,
      medium: artworkData.medium,
      category: artworkData.category,
      // For video artworks, we'll put the video in the assets array as a videoAsset
      assets: [
        {
          _key: `video-asset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          _type: 'videoAsset',
          title: artworkData.title,
          file: {
            _type: 'file',
            asset: {
              _type: 'reference',
              _ref: videoAsset._id
            }
          },
          description: `${artworkData.medium} from ${artworkData.year}`
        }
      ],
      featured: false,
      tags: []
    }

    const result = await client.create(artworkDoc)
    console.log(`✅ Created artwork document: ${artworkData.title} (${result._id})`)
    console.log('\n🎉 Video artwork import complete!')
    
    console.log('\n📊 Summary:')
    console.log(`   • Title: ${artworkData.title}`)
    console.log(`   • Year: ${artworkData.year}`)
    console.log(`   • Medium: ${artworkData.medium}`)
    console.log(`   • Category: ${artworkData.category}`)
    console.log(`   • Video Asset ID: ${videoAsset._id}`)
    console.log(`   • Document ID: ${result._id}`)
    
  } catch (error) {
    console.error(`❌ Error uploading ${artworkData.title}:`, error.message)
  }
}

// Run the import
importVideoArtwork()
