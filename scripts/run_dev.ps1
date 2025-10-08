# PowerShell script to run the development server
# Usage: .\scripts\run_dev.ps1

Write-Host "Starting Resume Builder Development Server..." -ForegroundColor Green

# Check if .venv exists
if (-not (Test-Path ".venv")) {
    Write-Host "Error: .venv directory not found!" -ForegroundColor Red
    Write-Host "Please create a virtual environment first:" -ForegroundColor Yellow
    Write-Host "  python -m venv .venv" -ForegroundColor Yellow
    Write-Host "  .venv\Scripts\Activate.ps1" -ForegroundColor Yellow
    Write-Host "  pip install -r backend\requirements.txt" -ForegroundColor Yellow
    exit 1
}

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Cyan
& ".venv\Scripts\Activate.ps1"

# Check if uvicorn is installed
try {
    $uvicornCheck = & python -c "import uvicorn; print('uvicorn available')" 2>$null
    if (-not $uvicornCheck) {
        Write-Host "Installing uvicorn..." -ForegroundColor Yellow
        pip install uvicorn[standard]
    }
} catch {
    Write-Host "Installing uvicorn..." -ForegroundColor Yellow
    pip install uvicorn[standard]
}

# Run the development server
Write-Host "Starting FastAPI server with auto-reload..." -ForegroundColor Green
Write-Host "Server will be available at: http://127.0.0.1:8000" -ForegroundColor Cyan
Write-Host "API docs available at: http://127.0.0.1:8000/docs" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow

# Change to backend directory and run uvicorn
Set-Location backend
uvicorn main:app --reload --host 127.0.0.1 --port 8000
