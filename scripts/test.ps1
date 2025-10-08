# PowerShell script to run tests
# Usage: .\scripts\test.ps1

Write-Host "Running Resume Builder Tests..." -ForegroundColor Green

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

# Check if pytest is installed, install if not
try {
    $pytestCheck = & python -c "import pytest; print('pytest available')" 2>$null
    if (-not $pytestCheck) {
        Write-Host "Installing pytest and pytest-cov..." -ForegroundColor Yellow
        pip install pytest pytest-cov
    }
} catch {
    Write-Host "Installing pytest and pytest-cov..." -ForegroundColor Yellow
    pip install pytest pytest-cov
}

# Run tests
Write-Host "Running tests with coverage..." -ForegroundColor Green
pytest tests/ --cov=backend --cov-report=html --cov-report=term

Write-Host "Test coverage report generated in htmlcov/index.html" -ForegroundColor Cyan
