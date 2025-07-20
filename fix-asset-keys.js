#!/usr/bin/env node
const { createClient } = require('@sanity/client')

// Initialize Sanity client
const client = createClient({
  projectId: 'y8r70112',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-07-19',
  token: process.env.SANITY_AUTH_TOKEN,
})

// Function to add _key to assets arrays
async function fixAssetKeys() {
  try {
    console.log('🔧 Fixing missing _key values in artwork assets...\n')
    
    // Fetch all artwork documents with assets
    const artworks = await client.fetch(`
      *[_type == "artwork" && defined(assets)] {
        _id,
        _rev,
        title,
        assets
      }
    `)

    console.log(`Found ${artworks.length} artworks with assets to fix`)

    for (const artwork of artworks) {
      console.log(`📝 Fixing assets for: ${artwork.title}`)
      
      // Add _key to each asset item that doesn't have one
      const fixedAssets = artwork.assets.map((asset, index) => ({
        ...asset,
        _key: asset._key || `asset-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`
      }))

      // Update the document
      const result = await client
        .patch(artwork._id)
        .set({ assets: fixedAssets })
        .commit()

      console.log(`✅ Updated ${artwork.title} (${result._id})`)
    }

    console.log('\n🎉 All artwork assets have been fixed with proper _key values!')

  } catch (error) {
    console.error('❌ Error fixing asset keys:', error.message)
    process.exit(1)
  }
}

// Check auth token and run
if (!process.env.SANITY_AUTH_TOKEN) {
  console.error('❌ SANITY_AUTH_TOKEN environment variable is required')
  console.log('👉 Get your token from: https://manage.sanity.io/projects/zflu9f6c/api#tokens')
  console.log('👉 Then run: export SANITY_AUTH_TOKEN="your-token-here"')
  process.exit(1)
}

fixAssetKeys()
