# Google NotebookLM Clone - Reliable Startup Script
Write-Host "Starting Google NotebookLM Clone (Reliable Method)..." -ForegroundColor Green

# Kill any existing Node.js processes
Write-Host "Stopping any existing processes..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force -ErrorAction SilentlyContinue

# Kill any processes on ports 3000 and 5000
Write-Host "Clearing ports..." -ForegroundColor Yellow
$ports = @(3000, 5000)
foreach ($port in $ports) {
    $processes = netstat -ano | findstr ":$port"
    if ($processes) {
        $processes -split "`n" | ForEach-Object {
            $parts = $_ -split '\s+'
            if ($parts.Length -gt 4) {
                $pid = $parts[4]
                if ($pid -match '^\d+$') {
                    taskkill /PID $pid /F 2>$null
                }
            }
        }
    }
}

# Start Backend
Write-Host "Starting Backend Server..." -ForegroundColor Cyan
Start-Process -FilePath "node" -ArgumentList "server.js" -WorkingDirectory "backend" -WindowStyle Normal

# Wait for backend to start
Start-Sleep -Seconds 3

# Build Frontend (if needed)
Write-Host "Building Frontend..." -ForegroundColor Cyan
Set-Location "frontend"
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Frontend build failed!" -ForegroundColor Red
    exit 1
}

# Start Frontend using http-server
Write-Host "Starting Frontend Server..." -ForegroundColor Cyan
Start-Process -FilePath "http-server" -ArgumentList "build", "-p", "3000", "-c-1", "--cors" -WorkingDirectory "frontend" -WindowStyle Normal

# Wait for services to start
Write-Host "Waiting for services to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

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

Write-Host "`n🎉 Application startup complete!" -ForegroundColor Green
Write-Host "📱 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔧 Backend: http://localhost:5000" -ForegroundColor Cyan
Write-Host "`n💡 To stop the application, close the terminal windows or run: Get-Process node | Stop-Process -Force" -ForegroundColor Yellow 