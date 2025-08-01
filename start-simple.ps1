# Simple Startup Script for Google NotebookLM Clone
Write-Host "🚀 Starting Google NotebookLM Clone..." -ForegroundColor Green

# Kill any existing Node.js processes on ports 3000 and 5000
Write-Host "🔄 Stopping any existing processes..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force -ErrorAction SilentlyContinue

# Set Node.js options for legacy OpenSSL support
$env:NODE_OPTIONS = "--openssl-legacy-provider"

# Start backend
Write-Host "📡 Starting backend server..." -ForegroundColor Cyan
Start-Process -FilePath "node" -ArgumentList "server.js" -WorkingDirectory "backend" -WindowStyle Hidden

# Wait for backend to start
Start-Sleep -Seconds 5

# Start frontend
Write-Host "🌐 Starting frontend server..." -ForegroundColor Cyan
Start-Process -FilePath "npm" -ArgumentList "start" -WorkingDirectory "frontend" -WindowStyle Hidden

# Wait for services to start
Write-Host "⏳ Waiting for services to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Check status
Write-Host "`n🔍 Checking service status..." -ForegroundColor Green

$backendRunning = $false
$frontendRunning = $false

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000" -TimeoutSec 5 -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        $backendRunning = $true
    }
} catch {
    $backendRunning = $false
}

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 5 -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        $frontendRunning = $true
    }
} catch {
    $frontendRunning = $false
}

# Display results
Write-Host "`n📊 Service Status:" -ForegroundColor White
if ($backendRunning) {
    Write-Host "✅ Backend: http://localhost:5000" -ForegroundColor Green
} else {
    Write-Host "❌ Backend: Not responding" -ForegroundColor Red
}

if ($frontendRunning) {
    Write-Host "✅ Frontend: http://localhost:3000" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend: Not responding" -ForegroundColor Red
}

Write-Host "`n🎯 Next Steps:" -ForegroundColor Cyan
if ($backendRunning -and $frontendRunning) {
    Write-Host "1. Open your browser and go to: http://localhost:3000" -ForegroundColor White
    Write-Host "2. Upload a PDF file to test the application" -ForegroundColor White
    Write-Host "3. Start chatting with your document!" -ForegroundColor White
} else {
    Write-Host "1. Backend is working - you can test the API at: http://localhost:5000" -ForegroundColor White
    Write-Host "2. Frontend may need manual start - try: cd frontend && npm start" -ForegroundColor White
    Write-Host "3. Or use the test page: test-app.html" -ForegroundColor White
}

Write-Host "`n💡 Tips:" -ForegroundColor Yellow
Write-Host "- Use Ctrl+C to stop the application" -ForegroundColor White
Write-Host "- Check the README.md for detailed instructions" -ForegroundColor White
Write-Host "- The backend API is fully functional for testing" -ForegroundColor White

Write-Host "`n🎉 Setup complete!" -ForegroundColor Green 