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

// Parse the new 2014 artwork filenames
function parseArtworkFilename(filename) {
  // Pattern: YYYY_Title_Medium_Dimensions.jpg
  const parts = filename.replace('.jpg', '').split('_')
  
  if (parts.length < 4) {
    console.error(`❌ Invalid filename pattern: ${filename}`)
    return null
  }

  const year = parseInt(parts[0])
  const titleParts = []
  const dimensions = parts[parts.length - 1]
  let medium = ''
  
  // Find where the medium starts by looking for common medium keywords
  const mediumKeywords = ['Acrylic', 'Oil', 'oil', 'Canvas', 'Mixed']
  let mediumStartIndex = -1
  
  for (let i = 1; i < parts.length - 1; i++) {
    if (mediumKeywords.some(keyword => parts[i].includes(keyword))) {
      mediumStartIndex = i
      break
    }
  }
  
  if (mediumStartIndex === -1) {
    console.error(`❌ Could not parse medium from: ${filename}`)
    return null
  }
  
  // Title is everything between year and medium
  for (let i = 1; i < mediumStartIndex; i++) {
    titleParts.push(parts[i])
  }
  
  // Medium is everything from medium start to dimensions
  for (let i = mediumStartIndex; i < parts.length - 1; i++) {
    medium += parts[i]
  }
  
  // Clean up the title (add spaces between camelCase words)
  const title = titleParts.join(' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space before capitals
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim()
  
  // Clean up the medium
  const cleanMedium = medium
    .replace(/And/g, ' and ')
    .replace(/On/g, ' on ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
  
  // Clean up dimensions
  const cleanDimensions = dimensions
    .replace(/in$/, ' inches')
    .replace(/x/, ' x ')
    .replace(/h/, 'h')
    .replace(/w/, 'w')
  
  return {
    filename,
    title,
    year,
    medium: cleanMedium,
    dimensions: cleanDimensions
  }
}

// New 2014 artwork data
const new2014Artworks = [
  '2014_DataSoVast_AcrylicAndOilOnCanvas_72x48in.jpg',
  '2014_GiftOfFear_AcrylicOnCanvas_48x72in.jpg',
  '2014_HowManyAncientThings_OilOnCanvas_72x48in.jpg',
  '2014_NewIndustrialParksHeader_AcrylicAndOilOnCanvas_48x72in.jpg',
  '2014_NothingSaysAmericanArtistLikeInches_OilOnCanvas_72x48in.jpg',
  '2014_RibbonCableWithOsmosisTemplate_AcrylicAndOilOnCanvas_60x84in.jpg',
  '2014_TheyFoundItWasLessLonely_AcrylicAndOilOnCanvas_72x48in.jpg',
  '2014_WeveBeenScrollingForYears_AcrylicAndOilOnCanvas_72x48in.jpg',
  '2014_turtlesinbathtub_48hx72w_oilOnCanvas.jpg'
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
async function uploadArtwork(artworkData) {
  try {
    const imagePath = path.join(__dirname, 'static', artworkData.filename)
    
    // Check if image file exists
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
    
  } catch (error) {
    console.error(`❌ Error uploading ${artworkData.title}:`, error.message)
  }
}

// Main import function
async function import2014Artworks() {
  console.log('🎨 Starting 2014 artwork import...\n')
  
  // Check if we have an auth token
  if (!process.env.SANITY_AUTH_TOKEN) {
    console.error('❌ SANITY_AUTH_TOKEN environment variable is required')
    console.log('👉 Get your token from: https://manage.sanity.io/projects/zflu9f6c/api#tokens')
    console.log('👉 Then run: export SANITY_AUTH_TOKEN="your-token-here"')
    process.exit(1)
  }

  // Parse and display artwork data
  console.log('📋 Parsed artwork data:')
  const parsedArtworks = []
  
  for (const filename of new2014Artworks) {
    const artworkData = parseArtworkFilename(filename)
    if (artworkData) {
      console.log(`   • ${artworkData.title} (${artworkData.year}) - ${artworkData.medium} - ${artworkData.dimensions}`)
      parsedArtworks.push(artworkData)
    }
  }
  
  console.log(`\n🚀 Importing ${parsedArtworks.length} artworks...\n`)

  // Import each artwork
  for (const artwork of parsedArtworks) {
    await uploadArtwork(artwork)
  }
  
  console.log('\n🎉 2014 artwork import complete!')
}

// Run the import
import2014Artworks()
