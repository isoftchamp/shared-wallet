const fs = require('fs');
const path = require('path');

// Paths
const artifactsDir = path.join(__dirname, '../artifacts/contracts');
const frontendContractsDir = path.join(__dirname, '../../frontend/src/contracts/abi');

// Ensure frontend contracts directory exists
if (!fs.existsSync(frontendContractsDir)) {
  fs.mkdirSync(frontendContractsDir, { recursive: true });
}

// Function to find and copy all contract JSON files
function copyContractArtifacts(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) {
    console.error('❌ Artifacts directory not found. Please compile contracts first.');
    console.error(`Expected directory: ${srcDir}`);
    return false;
  }

  let copiedCount = 0;

  // Recursively find all .json files in artifacts/contracts
  function findJsonFiles(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        findJsonFiles(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.json')) {
        // Skip debug files and other non-contract files
        if (entry.name.includes('.dbg.json') || entry.name === 'package.json') {
          continue;
        }

        // Extract contract name from file name (remove .json extension)
        const contractName = entry.name.replace('.json', '');
        const destFile = path.join(destDir, `${contractName}.json`);

        try {
          fs.copyFileSync(fullPath, destFile);
          console.log(`✅ Copied: ${contractName}.json`);
          copiedCount++;
        } catch (error) {
          console.error(`❌ Failed to copy ${contractName}.json:`, error.message);
        }
      }
    }
  }

  findJsonFiles(srcDir);
  return copiedCount > 0;
}

// Copy all contract artifacts
console.log('🔄 Copying contract artifacts to frontend...');
const success = copyContractArtifacts(artifactsDir, frontendContractsDir);

if (success) {
  console.log('\n🎉 Contract artifacts copied to frontend successfully!');
  console.log('📦 Frontend can now use local contract ABIs for production deployment.');
  console.log(`📁 Artifacts location: ${frontendContractsDir}`);
} else {
  console.error('\n❌ Failed to copy contract artifacts.');
  process.exit(1);
}
