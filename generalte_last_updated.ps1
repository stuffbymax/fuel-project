$files = @("bradford.csv", "halifax.csv")

$latestFile = $files |
    Where-Object { Test-Path $_ } |
    Get-Item |
    Sort-Object LastWriteTime -Descending |
    Select-Object -First 1

if (-not $latestFile) {
    Write-Host "No CSV files found."
    exit 1
}

$timestamp = $latestFile.LastWriteTime.ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")

# go to script folder (fuel-project root if script is there)
$root = Split-Path -Parent $MyInvocation.MyCommand.Path

# correct project path
$dir = Join-Path $root "html\js"

if (!(Test-Path $dir)) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
}

$content = @"
// Auto-generated file — do not edit

window.LAST_UPDATED = "$timestamp";
"@

Set-Content -Path (Join-Path $dir "last_updated.js") -Value $content -Encoding UTF8

Write-Host "Updated $dir\last_updated.js -> $timestamp"