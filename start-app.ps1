# Google NotebookLM Clone Startup Script
Write-Host "Starting Google NotebookLM Clone..." -ForegroundColor Green

# Kill any existing Node.js processes
Write-Host "Stopping any existing processes..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force -ErrorAction SilentlyContinue

# Start Backend
Write-Host "Starting Backend Server..." -ForegroundColor Cyan
Start-Process -FilePath "node" -ArgumentList "server.js" -WorkingDirectory "backend" -WindowStyle Normal

# Wait for backend to start
Start-Sleep -Seconds 3

# Start Frontend
Write-Host "Starting Frontend Server..." -ForegroundColor Cyan
$env:NODE_OPTIONS = "--openssl-legacy-provider"
Start-Process -FilePath "npm" -ArgumentList "start" -WorkingDirectory "frontend" -WindowStyle Normal

# Wait for services to start
Write-Host "Waiting for services to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Check status
Write-Host "Checking service status..." -ForegroundColor Green

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
Write-Host "Service Status:" -ForegroundColor White
if ($backendRunning) {
    Write-Host "Backend: http://localhost:5000 - RUNNING" -ForegroundColor Green
} else {
    Write-Host "Backend: http://localhost:5000 - NOT RESPONDING" -ForegroundColor Red
}

if ($frontendRunning) {
    Write-Host "Frontend: http://localhost:3000 - RUNNING" -ForegroundColor Green
} else {
    Write-Host "Frontend: http://localhost:3000 - NOT RESPONDING" -ForegroundColor Red
}

Write-Host "Application startup complete!" -ForegroundColor Green 