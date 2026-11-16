Set-Location -Path $PSScriptRoot

Write-Host "Starting Jathin Ambati Portfolio Python Backend..." -ForegroundColor Cyan

if (Get-Command python3.12 -ErrorAction SilentlyContinue) {
    & python3.12 backend\server.py
} elseif (Get-Command uv -ErrorAction SilentlyContinue) {
    & uv run python backend\server.py
} elseif (Get-Command py -ErrorAction SilentlyContinue) {
    & py -3 backend\server.py
} elseif (Get-Command python3 -ErrorAction SilentlyContinue) {
    & python3 backend\server.py
} else {
    & python backend\server.py
}
