@echo off
echo Starting Blood Donation Management System...
echo.
echo 1. Starting MongoDB (if not already running)...
echo 2. Installing backend dependencies...
echo 3. Starting the server...
echo.

cd server

echo Installing dependencies...
call npm install

echo.
echo Starting server...
echo Server will be available at: http://localhost:5000
echo Frontend: Open public/index.html in your browser
echo.
echo Press Ctrl+C to stop the server
echo.

call npm run dev

pause
