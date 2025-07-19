#!/usr/bin/env node
import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import readline from 'readline'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Function to prompt for auth token
function askForToken() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  return new Promise((resolve) => {
    console.log('\n🔑 You need a Sanity auth token to upload images.')
    console.log('👉 Get it from: https://manage.sanity.io/projects/zflu9f6c/api#tokens')
    console.log('👉 Create a new token with "Editor" permissions\n')
    
    rl.question('Paste your Sanity auth token here: ', (token) => {
      rl.close()
      resolve(token.trim())
    })
  })
}

// Artwork data with corresponding image files
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
  }
  // Note: Skipping "Trash Has Its Own Day" since it already exists
]

// Generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-')
}

// Upload artwork with image
async function uploadArtworkWithImage(client, artwork) {
  try {
    const imagePath = path.join(__dirname, 'static', artwork.filename)
    
    if (!fs.existsSync(imagePath)) {
      console.error(`❌ Image file not found: ${imagePath}`)
      return
    }

    console.log(`📤 Uploading ${artwork.title} with image...`)

    // Upload image asset
    const imageAsset = await client.assets.upload('image', fs.createReadStream(imagePath), {
      filename: artwork.filename,
    })

    console.log(`✅ Image uploaded: ${imageAsset._id}`)

    // Check if artwork document already exists
    const existingDoc = await client.fetch(`*[_type == "artwork" && title == $title][0]`, {
      title: artwork.title
    })

    if (existingDoc) {
      // Update existing document with image
      const updatedDoc = await client
        .patch(existingDoc._id)
        .set({
          mainImage: {
            _type: 'image',
            asset: { _type: 'reference', _ref: imageAsset._id },
            alt: artwork.title
          },
          assets: [
            {
              _type: 'image',
              asset: { _type: 'reference', _ref: imageAsset._id },
              alt: artwork.title
            }
          ]
        })
        .commit()

      console.log(`✅ Updated existing artwork: ${artwork.title} (${updatedDoc._id})`)
    } else {
      // Create new artwork document
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
          asset: { _type: 'reference', _ref: imageAsset._id },
          alt: artwork.title
        },
        assets: [
          {
            _type: 'image',
            asset: { _type: 'reference', _ref: imageAsset._id },
            alt: artwork.title
          }
        ],
        featured: false,
        tags: []
      }

      const result = await client.create(artworkDoc)
      console.log(`✅ Created new artwork: ${artwork.title} (${result._id})`)
    }
    
  } catch (error) {
    console.error(`❌ Error uploading ${artwork.title}:`, error.message)
  }
}

// Main function
async function main() {
  console.log('🎨 Full Artwork Import with Images\n')
  
  const token = await askForToken()
  
  const client = createClient({
    projectId: 'zflu9f6c',
    dataset: 'production',
    useCdn: false,
    apiVersion: '2024-07-19',
    token: token,
  })

  console.log('\n🚀 Starting full import with images...\n')

  for (const artwork of artworkData) {
    await uploadArtworkWithImage(client, artwork)
    // Small delay between uploads
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  console.log('\n🎉 Full import completed! All images uploaded and linked!')
}

main().catch(console.error)
