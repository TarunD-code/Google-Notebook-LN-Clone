# Upload Google NotebookLM Clone to GitHub Repository
Write-Host "🚀 Uploading project to GitHub repository..." -ForegroundColor Green

# Repository URL
$REPO_URL = "https://github.com/TarunD-code/Google-Notebook-LN-Clone.git"

# Check if Git is installed
try {
    $gitVersion = git --version
    Write-Host "✅ Git is installed: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git is not installed. Please install Git first." -ForegroundColor Red
    Write-Host "Download from: https://git-scm.com/downloads" -ForegroundColor Yellow
    exit 1
}

# Initialize Git repository
Write-Host "Initializing Git repository..." -ForegroundColor Yellow
git init

# Add all files
Write-Host "Adding files to Git..." -ForegroundColor Yellow
git add .

# Create initial commit
Write-Host "Creating initial commit..." -ForegroundColor Yellow
git commit -m "Initial commit: Google NotebookLM Clone with working frontend and backend"

# Add remote repository
Write-Host "Adding remote repository..." -ForegroundColor Yellow
git remote add origin $REPO_URL

# Set main branch
Write-Host "Setting main branch..." -ForegroundColor Yellow
git branch -M main

# Push to GitHub
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push -u origin main

Write-Host "`n🎉 Project successfully uploaded to GitHub!" -ForegroundColor Green
Write-Host "Repository: $REPO_URL" -ForegroundColor Cyan
Write-Host "`n📋 Next steps:" -ForegroundColor Yellow
Write-Host "1. Check your GitHub repository" -ForegroundColor White
Write-Host "2. Add a README.md file on GitHub" -ForegroundColor White
Write-Host "3. Set up deployment if needed" -ForegroundColor White 