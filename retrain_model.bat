@echo off
echo Civic Connect - Model Retraining Script
echo ========================================
echo.

cd /d "e:\mini\civic-connect\ml-models\classification"

echo Training the model...
python train_simple.py

echo.
echo Model retraining completed!
echo The new model has been saved to: ../model_weights/simple_cnn_model.pkl
echo.

pause