@echo off
echo Training ResNet50 model specifically for garbage detection...
echo ======================================================

cd /d "ml-models\classification"
py -3.11 train_resnet50_garbage.py

echo.
echo Training completed!
pause