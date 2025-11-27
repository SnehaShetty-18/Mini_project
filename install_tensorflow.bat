@echo off
echo Installing TensorFlow for Civic Connect Project
echo =============================================
echo.

echo 1. Upgrading pip...
python -m pip install --upgrade pip
echo.

echo 2. Installing TensorFlow CPU version...
pip install tensorflow-cpu
if %ERRORLEVEL% NEQ 0 (
    echo Failed to install tensorflow-cpu
    echo Trying alternative installation methods...
    
    echo 3. Attempting to install TensorFlow 2.12.0...
    pip install tensorflow==2.12.0
    if %ERRORLEVEL% NEQ 0 (
        echo Failed to install TensorFlow 2.12.0
        echo Trying with extra index URL...
        
        echo 4. Attempting to install with extra index URL...
        pip install tensorflow --extra-index-url https://pypi.org/simple/
        if %ERRORLEVEL% NEQ 0 (
            echo All TensorFlow installation attempts failed.
            echo You may need to use a different Python version.
            echo.
            echo Recommendation:
            echo 1. Install Python 3.9 or 3.10 from python.org
            echo 2. Create a virtual environment with that Python version
            echo 3. Install TensorFlow in that environment
            echo.
            pause
            exit /b 1
        )
    )
)

echo.
echo TensorFlow installation completed successfully!
echo You can now use the ResNet50 model in your ML service.
echo.
pause