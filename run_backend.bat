@echo off
cd /d "%~dp0"
echo Starting Jathin Ambati Portfolio Python Backend...

where python3.12 >nul 2>nul
if %ERRORLEVEL% equ 0 (
    python3.12 backend\server.py
    goto :eof
)

where uv >nul 2>nul
if %ERRORLEVEL% equ 0 (
    uv run python backend\server.py
    goto :eof
)

where py >nul 2>nul
if %ERRORLEVEL% equ 0 (
    py -3 backend\server.py
    goto :eof
)

where python3 >nul 2>nul
if %ERRORLEVEL% equ 0 (
    python3 backend\server.py
    goto :eof
)

python backend\server.py
