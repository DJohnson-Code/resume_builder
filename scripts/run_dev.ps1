# Run FastAPI dev server (PowerShell)
# Usage: .\scripts\run_dev.ps1
$ErrorActionPreference = 'Stop'

$RepoRoot = Split-Path $PSScriptRoot -Parent
Set-Location $RepoRoot

if (-not (Test-Path ".venv")) {
    Write-Host "   .venv not found. Create it and install deps:" -ForegroundColor Red
    Write-Host "   python -m venv .venv"
    Write-Host "   .\.venv\Scripts\Activate.ps1"
    Write-Host "   python -m pip install -r backend\requirements.txt"
    exit 1
}

$Python = Join-Path $RepoRoot ".venv\Scripts\python.exe"

try { & $Python -c "import uvicorn" 2>$null } catch {
    Write-Host "Installing uvicorn[standard]..." -ForegroundColor Yellow
    & $Python -m pip install --upgrade pip
    & $Python -m pip install "uvicorn[standard]"
}

# Load .env
$envPath = Join-Path $RepoRoot ".env"
if (Test-Path $envPath) {
    Get-Content $envPath | ForEach-Object {
        if ($_ -match '^\s*#' -or $_ -match '^\s*$') { return }
        $parts = $_ -split '=', 2
        if ($parts.Count -ne 2) { return }
        $k = $parts[0].Trim(); $v = $parts[1].Trim()
        if ($v.StartsWith('"') -and $v.EndsWith('"')) { $v = $v.Substring(1, $v.Length - 2) }
        if ($v.StartsWith("'") -and $v.EndsWith("'")) { $v = $v.Substring(1, $v.Length - 2) }
        if ($k) { Set-Item -Path ("Env:{0}" -f $k) -Value $v }
    }
}

$apiHost = if ($env:API_HOST) { $env:API_HOST } else { "127.0.0.1" }
$apiPort = if ($env:API_PORT) { $env:API_PORT } else { "8000" }

Write-Host "Starting FastAPI (http://$apiHost`:$apiPort, docs: /docs) ..." -ForegroundColor Green
& $Python -m uvicorn backend.main:app --reload --host $apiHost --port $apiPort
