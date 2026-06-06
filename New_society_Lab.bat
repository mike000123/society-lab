@echo off
setlocal

title Society Lab
cd /d "%~dp0"

set "APP_URL=http://127.0.0.1:3001"
set "NPM_CMD="

for %%I in (npm.cmd) do set "NPM_CMD=%%~$PATH:I"
if not defined NPM_CMD if exist "%ProgramFiles%\nodejs\npm.cmd" set "NPM_CMD=%ProgramFiles%\nodejs\npm.cmd"

if not defined NPM_CMD (
  echo [ERROR] npm was not found on this computer.
  echo Install Node.js and try again.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo Installing project dependencies...
  call "%NPM_CMD%" install
  if errorlevel 1 (
    echo.
    echo [ERROR] npm install failed.
    pause
    exit /b 1
  )
)

echo Checking whether Society Lab is already running...
powershell -NoProfile -Command "try { $response = Invoke-WebRequest -Uri '%APP_URL%' -UseBasicParsing -TimeoutSec 3; if ($response.StatusCode -ge 200) { exit 0 } else { exit 1 } } catch { exit 1 }"
if %errorlevel%==0 (
  echo Society Lab is already running at %APP_URL%
  echo Close the existing dev server window first, then run this launcher again.
  exit /b 0
)

echo Starting Society Lab...
echo It will run on port 3001.
echo The browser will open automatically in about 10 seconds.
start "" powershell -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Seconds 12; Start-Process '%APP_URL%'"

if exist ".next" (
  echo Clearing stale Next.js build cache...
  rmdir /s /q ".next"
)

call "%NPM_CMD%" run dev -- --hostname 127.0.0.1 --port 3001

echo.
echo Society Lab server stopped.
pause
