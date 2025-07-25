#!/usr/bin/env node
const { createClient } = require('@sanity/client')
const fs = require('fs')
const path = require('path')

// Initialize Sanity client
const client = createClient({
  projectId: 'zflu9f6c', // Your new project ID
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-07-19',
  token: process.env.SANITY_AUTH_TOKEN, // We'll need to set this
})

// Artwork data parsed from filenames
const artworkData = [
  {
    filename: "01_Capabilities_2015_Acrylicandoiloncanvas_60x84in.jpg",
    title: "Capabilities",
    year: 2015,
    medium: "Acrylic and oil on canvas",
    dimensions: "60 x 84 inches"
  },
  {
    filename: "02_EachBabysFirstWords_2015_Acrylicandoiloncanvas_48×66in.jpg", 
    title: "Each Baby's First Words",
    year: 2015,
    medium: "Acrylic and oil on canvas",
    dimensions: "48 × 66 inches"
  },
  {
    filename: "03_OldSpaghettiCollisionGravity_2015_acryliconcanvas_60hx48in.jpg",
    title: "Old Spaghetti Collision Gravity",
    year: 2015, 
    medium: "Acrylic on canvas",
    dimensions: "60h × 48 inches"
  },
  {
    filename: "04_Visit_2015_oiloncanvas_60hx72.jpg",
    title: "Visit",
    year: 2015,
    medium: "Oil on canvas", 
    dimensions: "60h × 72 inches"
  },
  {
    filename: "05_frenchwines(red)_2015_60wx84hinches_acrylicandoiloncanvas.jpg",
    title: "French Wines (Red)",
    year: 2015,
    medium: "Acrylic and oil on canvas",
    dimensions: "60w × 84h inches"
  },
  {
    filename: "06_WeCantKnow_2015_Acrylicandoiloncanvas_60x80in.jpg",
    title: "We Can't Know", 
    year: 2015,
    medium: "Acrylic and oil on canvas",
    dimensions: "60 × 80 inches"
  },
  {
    filename: "07_TrashHasItsOwnDay_2015_AcrylicandPVCfilmoncanvas48×72in.jpg",
    title: "Trash Has Its Own Day",
    year: 2015,
    medium: "Acrylic and PVC film on canvas",
    dimensions: "48 × 72 inches"
  }
]

// Generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim('-') // Remove leading/trailing hyphens
}

// Upload image and create artwork document
async function uploadArtwork(artwork) {
  try {
    const imagePath = path.join(__dirname, 'static', artwork.filename)
    
    // Check if image file exists
    if (!fs.existsSync(imagePath)) {
      console.error(`❌ Image file not found: ${imagePath}`)
      return
    }

    console.log(`📤 Uploading ${artwork.title}...`)

    // Upload image asset
    const imageAsset = await client.assets.upload('image', fs.createReadStream(imagePath), {
      filename: artwork.filename,
    })

    console.log(`✅ Image uploaded for ${artwork.title}`)

    // Create artwork document
    const artworkDoc = {
      _type: 'artwork',
      title: artwork.title,
      slug: {
        _type: 'slug',
        current: generateSlug(artwork.title)
      },
      year: artwork.year,
      medium: artwork.medium,
      dimensions: artwork.dimensions,
      mainImage: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: imageAsset._id
        },
        alt: artwork.title
      },
      assets: [
        {
          _key: `asset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAsset._id
          },
          alt: artwork.title
        }
      ],
      featured: false,
      tags: []
    }

    const result = await client.create(artworkDoc)
    console.log(`✅ Created artwork document: ${artwork.title} (${result._id})`)
    
  } catch (error) {
    console.error(`❌ Error uploading ${artwork.title}:`, error.message)
  }
}

// Main import function
async function importArtworks() {
  console.log('🎨 Starting batch artwork import...\n')
  
  // Check if we have an auth token
  if (!process.env.SANITY_AUTH_TOKEN) {
    console.error('❌ SANITY_AUTH_TOKEN environment variable is required')
    console.log('👉 Get your token from: https://manage.sanity.io/projects/zflu9f6c/api#tokens')
    console.log('👉 Then run: export SANITY_AUTH_TOKEN="your-token-here"')
    process.exit(1)
  }

  // Process each artwork
  for (const artwork of artworkData) {
    await uploadArtwork(artwork)
    // Add small delay between uploads
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  console.log('\n🎉 Batch import completed!')
}

// Run the import
importArtworks().catch(console.error)
