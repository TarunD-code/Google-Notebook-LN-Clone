# Start Backend Server Script
Write-Host "Starting Backend Server..." -ForegroundColor Green

# Navigate to backend directory
Set-Location "backend"

# Start the server
Write-Host "Starting server on port 5000..." -ForegroundColor Yellow
node server.js 