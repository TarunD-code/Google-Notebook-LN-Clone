# Frontend Startup Script
Write-Host "🌐 Starting Frontend..." -ForegroundColor Green

# Set Node.js options for legacy OpenSSL support
$env:NODE_OPTIONS = "--openssl-legacy-provider"

# Check if node_modules exists
if (!(Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Start the frontend
Write-Host "Starting React development server..." -ForegroundColor Cyan
npm start 