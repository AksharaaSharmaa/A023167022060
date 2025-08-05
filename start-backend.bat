@echo off
echo Starting URL Shortener Backend Microservice...
echo.
echo Installing dependencies...
cd url-shortener-backend
npm install
echo.
echo Starting the backend server...
npm run dev
pause 