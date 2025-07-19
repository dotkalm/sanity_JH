// Artwork import data parsed from filenames
// Format: <ignore_first_2_digits>_<title>_<year>_<medium>_<dimensions>

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
];

// Instructions for manual import:
// 1. Go to your Sanity Studio at http://localhost:3333
// 2. Click "Artwork" in the sidebar
// 3. Click "Create" to add new artwork entries
// 4. For each artwork above, fill in:
//    - Title: Use the parsed title
//    - Year: Use the parsed year  
//    - Medium: Use the parsed medium (with spaces added)
//    - Dimensions: Use the parsed dimensions
//    - Assets: Upload the corresponding image file
//    - Generate slug from title

console.log('Parsed artwork data:');
artworkData.forEach((artwork, index) => {
  console.log(`\n${index + 1}. ${artwork.title}`);
  console.log(`   Year: ${artwork.year}`);
  console.log(`   Medium: ${artwork.medium}`);
  console.log(`   Dimensions: ${artwork.dimensions}`);
  console.log(`   File: ${artwork.filename}`);
});

export { artworkData };
