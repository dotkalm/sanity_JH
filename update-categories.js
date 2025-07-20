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

// Function to add category field to all artworks
async function updateArtworkCategories() {
  try {
    console.log('🎨 Adding category field to all artwork documents...\n')
    
    // Fetch all artwork documents
    const artworks = await client.fetch(`
      *[_type == "artwork"] {
        _id,
        _rev,
        title,
        category
      }
    `)

    console.log(`Found ${artworks.length} artworks to update`)

    for (const artwork of artworks) {
      console.log(`📝 Updating category for: ${artwork.title}`)
      
      // Update the document to add category = 'painting'
      const result = await client
        .patch(artwork._id)
        .set({ category: 'painting' })
        .commit()

      console.log(`✅ Updated ${artwork.title} (${result._id}) - category: painting`)
    }

    console.log('\n🎉 All artwork documents have been updated with category "painting"!')

  } catch (error) {
    console.error('❌ Error updating artwork categories:', error.message)
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

updateArtworkCategories()
