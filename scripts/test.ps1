# Run tests with coverage (PowerShell)
# Usage: .\scripts\test.ps1
$ErrorActionPreference = 'Stop'

# Resolve repo root no matter where you run from
$RepoRoot = Split-Path $PSScriptRoot -Parent
Set-Location $RepoRoot

# Ensure venv exists
if (-not (Test-Path ".venv")) {
    Write-Host "   .venv not found. Create it and install deps:" -ForegroundColor Red
    Write-Host "   python -m venv .venv"
    Write-Host "   .\.venv\Scripts\Activate.ps1"
    Write-Host "   python -m pip install -r backend\requirements.txt"
    exit 1
}

# Use venv's Python explicitly
$Python = Join-Path $RepoRoot ".venv\Scripts\python.exe"

# Load .env into $env:
$envPath = Join-Path $RepoRoot ".env"
if (Test-Path $envPath) {
    Get-Content $envPath | ForEach-Object {
        if ($_ -match '^\s*#') { return }     # skip comments
        if ($_ -match '^\s*$') { return }     # skip blanks

        $parts = $_ -split '=', 2
        if ($parts.Count -ne 2) { return }

        $k = $parts[0].Trim()
        $v = $parts[1].Trim()

        if ($v.StartsWith('"') -and $v.EndsWith('"')) { $v = $v.Substring(1, $v.Length - 2) }
        if ($v.StartsWith("'") -and $v.EndsWith("'")) { $v = $v.Substring(1, $v.Length - 2) }

        if ($k) { Set-Item -Path ("Env:{0}" -f $k) -Value $v }
    }
}

# Ensure Python can import 'backend' from repo root
$env:PYTHONPATH = $RepoRoot

# Ensure pytest + coverage are available
try {
    & $Python -c "import pytest" 2>$null
}
catch {
    Write-Host "Installing pytest + pytest-cov..." -ForegroundColor Yellow
    & $Python -m pip install --upgrade pip
    & $Python -m pip install pytest pytest-cov
}

Write-Host "Running tests with coverage..." -ForegroundColor Green
& $Python -m pytest tests/ --cov=backend --cov-report=term --cov-report=html
$code = $LASTEXITCODE

if ($code -eq 0) {
    Write-Host "HTML coverage report at: htmlcov/index.html" -ForegroundColor Cyan
    # Start-Process "$RepoRoot\htmlcov\index.html" | Out-Null  # optional
}
else {
    Write-Host "Tests failed" -ForegroundColor Red
    exit $code
}
