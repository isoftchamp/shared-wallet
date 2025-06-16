const fs = require('fs');
const path = require('path');

// Directories
const contractsDir = path.join(__dirname, '..', 'contracts');
const testsDir = path.join(__dirname, '..', 'test');

// Read contracts
function getContractFiles(dir) {
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.sol'))
    .map((file) => file.replace('.sol', ''));
}

// Read test files
function getTestFiles(dir) {
  return fs
    .readdirSync(dir)
    .filter((file) => file.match(/\.(js|ts)$/))
    .map((file) => file.replace(/\.test\.(js|ts)$/, '').replace(/\.(js|ts)$/, ''));
}

const contractFiles = getContractFiles(contractsDir);
const testFiles = getTestFiles(testsDir);

// Check for untested contracts
const untested = contractFiles.filter((contract) => !testFiles.includes(contract));

if (untested.length > 0) {
  console.error('Missing test files for the following contracts:');
  untested.forEach((name) => console.error(`- ${name}.sol`));
  process.exit(1);
} else {
  console.log('✅ All contracts have corresponding tests.');
}
