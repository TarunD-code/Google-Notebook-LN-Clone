# Fix and Start Google NotebookLM Clone
Write-Host "🔧 Fixing and Starting Google NotebookLM Clone..." -ForegroundColor Green

# Kill any existing processes
Write-Host "Stopping existing processes..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force -ErrorAction SilentlyContinue

# Create .env file if it doesn't exist
Write-Host "Setting up environment..." -ForegroundColor Yellow
if (!(Test-Path "backend\.env")) {
    Copy-Item "backend\env.example" "backend\.env" -ErrorAction SilentlyContinue
    Write-Host "✅ Created .env file"
} else {
    Write-Host "✅ .env file exists"
}

# Start Backend
Write-Host "Starting Backend Server..." -ForegroundColor Cyan
Start-Process -FilePath "node" -ArgumentList "server.js" -WorkingDirectory "backend" -WindowStyle Normal

# Wait for backend
Start-Sleep -Seconds 5

# Test backend
Write-Host "Testing Backend..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000" -UseBasicParsing -TimeoutSec 10
    Write-Host "✅ Backend is running (Status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend failed to start" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test frontend
Write-Host "Testing Frontend..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 10
    Write-Host "✅ Frontend is running (Status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend not accessible" -ForegroundColor Red
}

Write-Host "`n🎉 Setup Complete!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend: http://localhost:5000" -ForegroundColor Cyan
Write-Host "`nTry uploading a PDF now!" -ForegroundColor Yellow 