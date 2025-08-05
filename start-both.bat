@echo off
echo Starting URL Shortener Full Stack Application...
echo.
echo This will start both the backend microservice and frontend React app.
echo.
echo Starting Backend Microservice...
start "Backend" cmd /k "cd url-shortener-backend && npm install && npm run dev"
echo.
echo Waiting 5 seconds for backend to start...
timeout /t 5 /nobreak > nul
echo.
echo Starting Frontend React App...
start "Frontend" cmd /k "cd url-shortener-app && npm install && npm start"
echo.
echo Both services are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit this launcher...
pause 