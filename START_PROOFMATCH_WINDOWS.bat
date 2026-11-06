@echo off
setlocal
cd /d "%~dp0"
echo.
echo ====================================================
echo  ProofMatch AI  ^|  Fast production demo launcher
echo ====================================================
echo.
where npm >nul 2>&1
if errorlevel 1 (
  echo Node.js / npm was not found. Install Node.js 20.9+ and reopen this window.
  pause
  exit /b 1
)
if not exist "node_modules\next\package.json" (
  echo Installing project dependencies...
  call npm ci
  if errorlevel 1 goto failed
)
if not exist ".next\BUILD_ID" (
  echo Building the optimized production app...
  call npm run build
  if errorlevel 1 goto failed
)
echo.
echo Open http://localhost:3000 in your browser.
echo Keep this window open during your demonstration.
echo.
call npm run start
if errorlevel 1 goto failed
exit /b 0
:failed
echo.
echo Setup or launch failed. Review the npm error above.
echo Check that your network is available for the first npm install.
pause
exit /b 1
