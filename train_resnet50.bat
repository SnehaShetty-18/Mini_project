@echo off
echo Training ResNet50 model for civic issue classification
echo ======================================================

REM Activate virtual environment
call civic_env\Scripts\activate.bat

REM Change to the classification directory
cd ml-models\classification

REM Run the ResNet50 training script
echo Starting ResNet50 training...
python train_resnet50.py

echo Training completed!
pause