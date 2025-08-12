@echo off
echo 🔄 Restarting Backend Server...
echo.

echo 📍 Stopping existing server...
taskkill /f /im node.exe 2>nul
timeout /t 2 /nobreak >nul

echo 📍 Starting server...
cd backend
npm run dev

echo ✅ Server restarted successfully!
pause
