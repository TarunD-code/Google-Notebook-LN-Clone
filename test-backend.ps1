# Test Backend API
Write-Host "🧪 Testing Backend API..." -ForegroundColor Green

try {
    # Test basic connectivity
    Write-Host "Testing backend connectivity..." -ForegroundColor Yellow
    $response = Invoke-WebRequest -Uri "http://localhost:5000" -Method GET -TimeoutSec 10
    Write-Host "✅ Backend is responding!" -ForegroundColor Green
    Write-Host "Status Code: $($response.StatusCode)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Backend is not responding: $($_.Exception.Message)" -ForegroundColor Red
}

# Test API endpoints
$endpoints = @(
    "/api/upload",
    "/api/chat",
    "/api/documents"
)

foreach ($endpoint in $endpoints) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5000$endpoint" -Method GET -TimeoutSec 5
        Write-Host "✅ $endpoint - Status: $($response.StatusCode)" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  $endpoint - $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

Write-Host "`n🎯 Backend test completed!" -ForegroundColor Green 