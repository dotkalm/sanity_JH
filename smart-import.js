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

// Parse the artwork filename (same logic as before)
function parseArtworkFilename(filename) {
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

// Generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-')
}

// Upload image and create artwork document
async function uploadArtwork(artworkData) {
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
    
  } catch (error) {
    console.error(`❌ Error uploading ${artworkData.title}:`, error.message)
  }
}

// Main import function that only imports new artworks
async function importNewArtworks() {
  console.log('🎨 Starting smart artwork import (avoiding duplicates)...\n')
  
  // Check if we have an auth token
  if (!process.env.SANITY_AUTH_TOKEN) {
    console.error('❌ SANITY_AUTH_TOKEN environment variable is required')
    console.log('👉 Get your token from: https://manage.sanity.io/projects/zflu9f6c/api#tokens')
    console.log('👉 Then run: export SANITY_AUTH_TOKEN="your-token-here"')
    process.exit(1)
  }

  // Get all existing artwork titles from Sanity
  console.log('🔍 Checking existing artworks in Sanity...')
  const existingArtworks = await client.fetch(`*[_type == "artwork"].title`)
  console.log(`📋 Found ${existingArtworks.length} existing artworks`)
  
  // Get all image files in static directory that match our patterns
  const staticDir = path.join(__dirname, 'static')
  const imageFiles = fs.readdirSync(staticDir)
    .filter(file => file.match(/^(2014|2015)_.*\.jpg$/))
    .filter(file => !file.startsWith('x0') && !file.startsWith('0')) // Exclude old pattern files
  
  console.log(`📁 Found ${imageFiles.length} potential artwork files in static directory`)
  
  // Parse all files and check for duplicates
  const newArtworks = []
  const skippedArtworks = []
  
  for (const filename of imageFiles) {
    const artworkData = parseArtworkFilename(filename)
    if (artworkData) {
      // Check if this artwork already exists
      if (existingArtworks.includes(artworkData.title)) {
        skippedArtworks.push(artworkData.title)
        console.log(`⏭️  Skipping ${artworkData.title} (already exists)`)
      } else {
        newArtworks.push(artworkData)
        console.log(`🆕 Will import: ${artworkData.title}`)
      }
    }
  }
  
  console.log(`\n📊 Import Summary:`)
  console.log(`   • ${newArtworks.length} new artworks to import`)
  console.log(`   • ${skippedArtworks.length} existing artworks skipped`)
  
  if (newArtworks.length === 0) {
    console.log('\n✨ No new artworks to import. All files are already in Sanity!')
    return
  }
  
  console.log(`\n🚀 Importing ${newArtworks.length} new artworks...\n`)

  // Import each new artwork
  for (const artwork of newArtworks) {
    await uploadArtwork(artwork)
  }
  
  console.log(`\n🎉 Import complete! Added ${newArtworks.length} new artworks.`)
}

// Run the import
importNewArtworks()
