# 🚀 Google NotebookLM Clone - Startup Guide

## Quick Start Options

### Option 1: Automatic Startup (Recommended)
1. **Double-click** `start-app.bat` file
2. Wait for both servers to start
3. Your browser will automatically open to http://localhost:3000

### Option 2: PowerShell Script
1. Right-click on `start-app.ps1`
2. Select "Run with PowerShell"
3. Wait for the status check to complete

### Option 3: Manual Start (Step by Step)

#### Step 1: Start Backend Server
```bash
cd backend
node server.js
```
You should see: "Server running on port 5000"

#### Step 2: Start Frontend Server (New Terminal)
```bash
cd frontend
set NODE_OPTIONS=--openssl-legacy-provider
npm start
```
You should see: "Local: http://localhost:3000"

## Access URLs

- **Frontend Application**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Test Page**: Open `test-app.html` in browser

## Troubleshooting

### If Frontend Won't Start:
1. Make sure you're in the `frontend` directory
2. Run: `npm install`
3. Set environment variable: `set NODE_OPTIONS=--openssl-legacy-provider`
4. Run: `npm start`

### If Backend Won't Start:
1. Make sure you're in the `backend` directory
2. Run: `npm install`
3. Check if port 5000 is available
4. Run: `node server.js`

### If Ports Are Busy:
1. Kill existing processes: `taskkill /f /im node.exe`
2. Try different ports by editing the configuration files

## Features Available

✅ **PDF Upload**: Drag & drop or click to upload
✅ **Chat Interface**: Ask questions about your document
✅ **Citation System**: Click citations to navigate pages
✅ **PDF Viewer**: Built-in document viewer
✅ **AI Integration**: Powered by OpenAI (if API key configured)

## Testing the Application

1. Upload a PDF file
2. Ask questions like:
   - "What is the main topic?"
   - "What skills are mentioned?"
   - "Summarize the key points"
3. Click on citation buttons to navigate pages
4. Use the test page (`test-app.html`) to verify API functionality

## Environment Setup

Make sure you have:
- Node.js v16+ installed
- npm package manager
- Backend `.env` file configured (optional for basic functionality)

## Support

If you encounter issues:
1. Check the console output for error messages
2. Verify all dependencies are installed
3. Ensure ports 3000 and 5000 are available
4. Try the test page to isolate frontend/backend issues 