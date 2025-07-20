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

// Check for documents with the typo field
async function checkMeduiumField() {
  console.log('🔍 Checking for documents with "meduium" field...\n')
  
  // Check if we have an auth token
  if (!process.env.SANITY_AUTH_TOKEN) {
    console.error('❌ SANITY_AUTH_TOKEN environment variable is required')
    process.exit(1)
  }

  try {
    // Find all artworks that have the misspelled field
    const artworksWithTypo = await client.fetch(`
      *[_type == "artwork" && defined(meduium)] {
        _id,
        title,
        medium,
        meduium
      }
    `)

    console.log(`📊 Found ${artworksWithTypo.length} artworks with "meduium" field`)
    
    if (artworksWithTypo.length > 0) {
      console.log('\n📝 Documents that need fixing:')
      artworksWithTypo.forEach(artwork => {
        console.log(`   • ${artwork.title}:`)
        console.log(`     - medium: "${artwork.medium || 'null'}"`)
        console.log(`     - meduium: "${artwork.meduium || 'null'}"`)
        console.log('')
      })

      // Fix the documents
      console.log('🔧 Fixing documents...\n')
      
      for (const artwork of artworksWithTypo) {
        // If medium is empty but meduium has data, migrate it
        if (!artwork.medium && artwork.meduium) {
          console.log(`📝 Migrating "${artwork.meduium}" from meduium to medium for: ${artwork.title}`)
          await client
            .patch(artwork._id)
            .set({ medium: artwork.meduium })
            .unset(['meduium'])
            .commit()
          console.log(`✅ Fixed ${artwork.title}`)
        } 
        // If both fields have data, just remove the typo field
        else if (artwork.medium && artwork.meduium) {
          console.log(`🗑️  Removing duplicate meduium field for: ${artwork.title} (keeping medium: "${artwork.medium}")`)
          await client
            .patch(artwork._id)
            .unset(['meduium'])
            .commit()
          console.log(`✅ Cleaned up ${artwork.title}`)
        }
        // If only meduium has data, migrate it
        else {
          console.log(`📝 Moving "${artwork.meduium}" to medium field for: ${artwork.title}`)
          await client
            .patch(artwork._id)
            .set({ medium: artwork.meduium })
            .unset(['meduium'])
            .commit()
          console.log(`✅ Fixed ${artwork.title}`)
        }
      }
      
      console.log('\n🎉 All documents have been fixed!')
    } else {
      console.log('✅ No documents found with the "meduium" field.')
    }

  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

checkMeduiumField()
