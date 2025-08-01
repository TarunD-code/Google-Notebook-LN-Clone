#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Google NotebookLM Clone Setup...\n');

// Check if all required files exist
const requiredFiles = [
  'package.json',
  'backend/package.json',
  'backend/server.js',
  'backend/ai-config.js',
  'backend/env.example',
  'frontend/package.json',
  'frontend/src/App.tsx',
  'frontend/src/types.ts',
  'frontend/src/components/PDFUpload.tsx',
  'frontend/src/components/ChatInterface.tsx',
  'frontend/src/components/PDFViewer.tsx',
  'frontend/src/components/CitationButton.tsx',
  'frontend/tailwind.config.js',
  'frontend/tsconfig.json',
  'README.md',
  '.gitignore'
];

let allFilesExist = true;

console.log('📁 Checking required files:');
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allFilesExist = false;
  }
});

console.log('\n📦 Checking package.json files:');

// Check root package.json
try {
  const rootPackage = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  console.log('✅ Root package.json is valid');
  console.log(`   - Name: ${rootPackage.name}`);
  console.log(`   - Scripts: ${Object.keys(rootPackage.scripts).join(', ')}`);
} catch (error) {
  console.log('❌ Root package.json is invalid');
  allFilesExist = false;
}

// Check backend package.json
try {
  const backendPackage = JSON.parse(fs.readFileSync('backend/package.json', 'utf8'));
  console.log('✅ Backend package.json is valid');
  console.log(`   - Dependencies: ${Object.keys(backendPackage.dependencies).length} packages`);
} catch (error) {
  console.log('❌ Backend package.json is invalid');
  allFilesExist = false;
}

// Check frontend package.json
try {
  const frontendPackage = JSON.parse(fs.readFileSync('frontend/package.json', 'utf8'));
  console.log('✅ Frontend package.json is valid');
  console.log(`   - Dependencies: ${Object.keys(frontendPackage.dependencies).length} packages`);
} catch (error) {
  console.log('❌ Frontend package.json is invalid');
  allFilesExist = false;
}

console.log('\n🔧 Checking configuration files:');

// Check if uploads directory exists
if (!fs.existsSync('backend/uploads')) {
  console.log('📁 Creating uploads directory...');
  fs.mkdirSync('backend/uploads', { recursive: true });
  console.log('✅ Uploads directory created');
} else {
  console.log('✅ Uploads directory exists');
}

console.log('\n📋 Summary:');
if (allFilesExist) {
  console.log('🎉 All files are present and valid!');
  console.log('\n🚀 To start the application:');
  console.log('1. Run: npm run install:all');
  console.log('2. Run: npm run dev');
  console.log('3. Open: http://localhost:3000');
  console.log('\n📚 For deployment instructions, see README.md');
} else {
  console.log('❌ Some files are missing or invalid. Please check the errors above.');
  process.exit(1);
} 