@echo off
REM Developer Portfolio Setup Script for Windows
REM This script automates the setup process for the full-stack developer portfolio

echo Starting Developer Portfolio Setup...
echo ========================================

REM Check for Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/
    exit /b 1
) else (
    echo Node.js found.
)

REM Check for Python
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo Python 3 is not installed. Please install Python 3.10+ from https://www.python.org/
    exit /b 1
) else (
    echo Python found.
)

REM Check for npm
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo npm is not installed. Please install npm.
    exit /b 1
) else (
    echo npm found.
)

REM Setup Frontend
echo Setting up frontend...
if not exist "node_modules" (
    npm install
    echo Frontend dependencies installed.
) else (
    echo node_modules already exists, skipping npm install.
)

REM Create frontend .env file if it doesn't exist
if not exist ".env" (
    echo VITE_API_BASE_URL=http://localhost:5000 > .env
    echo VITE_GA_ID=your-google-analytics-id >> .env
    echo Frontend .env file created.
) else (
    echo .env file already exists, skipping creation.
)

REM Setup Backend
cd backend

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    python -m venv venv
    echo Python virtual environment created.
) else (
    echo venv directory already exists, skipping creation.
)

REM Activate virtual environment
call venv\Scripts\activate

REM Install Python dependencies
if exist "requirements.txt" (
    pip install -r requirements.txt
    echo Backend dependencies installed.
) else (
    echo requirements.txt not found in backend directory.
    exit /b 1
)

REM Create backend .env file if it doesn't exist
if not exist ".env" (
    echo FLASK_ENV=development > .env
    echo FLASK_DEBUG=True >> .env
    echo DATABASE_URL=sqlite:///portfolio.db >> .env
    echo SECRET_KEY=your-secret-key >> .env
    echo TO_EMAIL=your-email@example.com >> .env
    echo EMAIL_SERVICE=console >> .env
    echo Backend .env file created.
) else (
    echo .env file already exists in backend, skipping creation.
)

REM Initialize database
echo Initializing database...
python -c "from run import app, db; with app.app_context(): db.create_all(); print('Database tables created successfully!')"

cd ..

echo Setup completed successfully! 🎉
echo Next steps:
echo 1. Start backend: cd backend && call venv\Scripts\activate && python run.py
echo 2. Start frontend: npm run dev
echo 3. Open http://localhost:5173 in your browser
echo Don't forget to update your personal information in the backend.
echo Happy coding! 🚀
