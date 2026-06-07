@echo off
echo.
echo  ===========================================
echo  ✈️  Voyager AI – Starting App
echo  ===========================================
echo.

echo [1/4] Setting up Python backend...
cd backend
if not exist venv (
    python -m venv venv
)
call venv\Scripts\activate.bat
pip install -r requirements.txt -q
if not exist .env (
    copy .env.example .env
)

echo [2/4] Starting FastAPI server on port 8000...
start "Voyager AI Backend" cmd /k "call venv\Scripts\activate.bat && python main.py"

cd ..\frontend

echo [3/4] Installing frontend dependencies...
if not exist node_modules (
    npm install
)

echo [4/4] Starting React app on port 3000...
start "Voyager AI Frontend" cmd /k "npm run dev"

echo.
echo  ===========================================
echo  Voyager AI is starting!
echo.
echo  App:      http://localhost:3000
echo  API Docs: http://localhost:8000/api/docs
echo  ===========================================
echo.
pause
