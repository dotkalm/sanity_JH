#!/usr/bin/env node
const { createClient } = require('@sanity/client')
const fs = require('fs')
const path = require('path')

// Initialize Sanity client
const client = createClient({
  projectId: 'zflu9f6c',
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

// Import the turtle painting specifically
async function importTurtlePainting() {
  console.log('🐢 Importing Turtles in Bathtub painting...\n')
  
  // Check if we have an auth token
  if (!process.env.SANITY_AUTH_TOKEN) {
    console.error('❌ SANITY_AUTH_TOKEN environment variable is required')
    process.exit(1)
  }

  // Manually parsed data for this specific painting
  const artworkData = {
    filename: '2014_turtlesinbathtub_48hx72w_oilOnCanvas.jpg',
    title: 'Turtles In Bathtub',
    year: 2014,
    medium: 'Oil On Canvas',
    dimensions: '48h x 72w inches'
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
    const imagePath = path.join(__dirname, 'static', artworkData.filename)
    
    if (!fs.existsSync(imagePath)) {
      console.error(`❌ Image file not found: ${imagePath}`)
      return
    }

    console.log(`📤 Uploading ${artworkData.title}...`)

    // Upload image asset
    const imageAsset = await client.assets.upload('image', fs.createReadStream(imagePath), {
      filename: artworkData.filename,
    })

    console.log(`✅ Image uploaded for ${artworkData.title}`)

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
      category: 'painting',
      dimensions: artworkData.dimensions,
      mainImage: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: imageAsset._id
        },
        alt: artworkData.title
      },
      assets: [
        {
          _key: `asset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAsset._id
          },
          alt: artworkData.title
        }
      ],
      featured: false,
      tags: []
    }

    const result = await client.create(artworkDoc)
    console.log(`✅ Created artwork document: ${artworkData.title} (${result._id})`)
    console.log('\n🎉 Turtle painting import complete!')
    
  } catch (error) {
    console.error(`❌ Error uploading ${artworkData.title}:`, error.message)
  }
}

// Run the import
importTurtlePainting()
