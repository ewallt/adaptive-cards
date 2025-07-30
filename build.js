const fs = require('fs');
const path = require('path');

// --- Configuration ---
const sourceBaseDir = 'content';
const targetFile = 'public/data/content.json';

// 1. Read the collection ID (folder name) from the environment variable
const collectionId = process.env.APP_CONFIG_ID;
if (!collectionId) {
  console.error('❌ Error: APP_CONFIG_ID environment variable not set.');
  console.error('   This should be the name of the subfolder in `/content`.');
  console.error('   Example: APP_CONFIG_ID=non-violent-theology node build.js');
  process.exit(1);
}

// 2. Define the path to the source collection folder
const sourceCollectionPath = path.join(__dirname, sourceBaseDir, collectionId);
const targetPath = path.join(__dirname, targetFile);

// 3. Check if the source folder exists
if (!fs.existsSync(sourceCollectionPath)) {
  console.error(`❌ Error: Source collection folder not found for ID '${collectionId}'.`);
  console.error(`   Looked for: ${sourceCollectionPath}`);
  process.exit(1);
}

// 4. Read and combine all JSON files from the source folder
try {
  const combinedData = {};
  const files = fs.readdirSync(sourceCollectionPath);

  console.log(`🔎 Found ${files.length} files in '${collectionId}'...`);

  files.forEach(file => {
    if (path.extname(file) === '.json') {
      const filePath = path.join(sourceCollectionPath, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const jsonData = JSON.parse(fileContent);
      
      // Use the filename (without .json) as the key in the combined object
      const key = path.basename(file, '.json');
      combinedData[key] = jsonData;
      console.log(`   - Added '${file}'`);
    }
  });

  // 5. Write the combined JSON to the target file
  // Ensure the target directory exists
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, JSON.stringify(combinedData, null, 2));

  console.log(`✅ Successfully built combined JSON for '${collectionId}'.`);
  console.log(`   Target: ${targetFile}`);

} catch (err) {
  console.error(`❌ Error building app for collection '${collectionId}':`, err);
  process.exit(1);
}