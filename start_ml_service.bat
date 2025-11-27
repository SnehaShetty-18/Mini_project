@echo off
echo Starting ML Service with Python 3.11 and ResNet50 Model
echo =====================================================
echo.

echo Checking Python 3.11 availability...
py -3.11 --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Python 3.11 not found
    echo Please install Python 3.11 or use the system Python
    pause
    exit /b 1
)

echo ✅ Python 3.11 found
echo Starting ML Service...
echo.

cd ml-service
py -3.11 app.py

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to start ML Service
    pause
    exit /b 1
)

echo ML Service started successfully!
pause