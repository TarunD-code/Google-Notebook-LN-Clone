@echo off
echo Starting Google NotebookLM Clone...
echo.

echo Starting Backend Server...
cd backend
start "Backend Server" cmd /k "node server.js"

echo.
echo Starting Frontend Server...
cd ..\frontend
start "Frontend Server" cmd /k "set NODE_OPTIONS=--openssl-legacy-provider && npm start"

echo.
echo Application is starting...
echo Backend will be available at: http://localhost:5000
echo Frontend will be available at: http://localhost:3000
echo.
echo Press any key to open the application in your browser...
pause >nul
start http://localhost:3000 