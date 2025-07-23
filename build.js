const fs = require('fs');
const path = require('path');

// --- CONFIGURATION ---
const contentRoot = path.join(__dirname, 'content');
const outputDir = path.join(__dirname, 'public', 'data');
const outputFile = path.join(outputDir, 'content.json');
const configId = process.env.APP_CONFIG_ID;

// --- SCRIPT ---
console.log(`Starting build for ID: '${configId}'...`);

// 1. Validate environment variable
if (!configId) {
    console.error("Error: APP_CONFIG_ID environment variable not set.");
    console.error("Usage (macOS/Linux): APP_CONFIG_ID=your-folder-name node build.js");
    console.error("Usage (Windows PowerShell): $env:APP_CONFIG_ID='your-folder-name'; node build.js");
    process.exit(1);
}

const sourceDir = path.join(contentRoot, configId);

// 2. Check if the source directory exists
if (!fs.existsSync(sourceDir)) {
    console.error(`Error: Source collection folder not found for ID '${configId}'.`);
    console.error(`Looked for: ${sourceDir}`);
    process.exit(1);
}

const aggregatedData = {};

try {
    // 3. Read all files in the source directory
    const files = fs.readdirSync(sourceDir);

    // 4. Filter for .json files and process them
    files.filter(file => path.extname(file).toLowerCase() === '.json').forEach(file => {
        const filePath = path.join(sourceDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const jsonData = JSON.parse(fileContent);
        const key = path.basename(file, '.json');
        
        aggregatedData[key] = jsonData;
        console.log(`- Aggregated '${file}'`);
    });

    // 5. Ensure the output directory exists
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // 6. Write the aggregated data to the output file
    fs.writeFileSync(outputFile, JSON.stringify(aggregatedData, null, 2));

    console.log('\nBuild successful!');
    console.log(`Output written to: ${outputFile}`);

} catch (error) {
    console.error("\nAn error occurred during the build process:");
    console.error(error);
    process.exit(1);
}