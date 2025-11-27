"""
Script to update the ML service to use ResNet50 model
"""
import os
import shutil
from pathlib import Path

def update_ml_service():
    """Update the ML service to use ResNet50 model"""
    print("Updating ML Service to use ResNet50 Model")
    print("=" * 40)
    
    # Define paths
    ml_service_dir = Path("../ml-service")
    classification_dir = Path("../ml-models/classification")
    
    # Check if ResNet50 model exists
    resnet50_model_path = Path("../ml-models/model_weights/resnet50_civic_model.h5")
    if not resnet50_model_path.exists():
        print("❌ ResNet50 model not found. Please train the model first.")
        return False
    
    # Copy ResNet50 predictor to ML service
    predictor_src = classification_dir / "predict_resnet50.py"
    predictor_dst = ml_service_dir / "predict_resnet50.py"
    
    if predictor_src.exists():
        shutil.copy2(predictor_src, predictor_dst)
        print("✅ Copied ResNet50 predictor to ML service")
    else:
        print("❌ ResNet50 predictor not found")
        return False
    
    # Update the main app.py to use ResNet50
    app_path = ml_service_dir / "app.py"
    if app_path.exists():
        # Read the current app.py
        with open(app_path, 'r') as f:
            content = f.read()
        
        # Update the import statement
        updated_content = content.replace(
            "from predict_simple import SimpleCNNPredictor",
            "from predict_resnet50 import ResNet50Predictor"
        )
        
        # Update the predictor initialization
        updated_content = updated_content.replace(
            "predictor = SimpleCNNPredictor(str(model_path), silent=True)",
            "predictor = ResNet50Predictor(str(model_path), str(class_indices_path))"
        )
        
        # Update the model path to point to ResNet50 model
        updated_content = updated_content.replace(
            'model_path = script_dir.parent / "ml-models" / "model_weights" / "simple_cnn_model.pkl"',
            'model_path = script_dir.parent / "ml-models" / "model_weights" / "resnet50_civic_model.h5"\n    class_indices_path = script_dir.parent / "ml-models" / "model_weights" / "class_indices.npy"'
        )
        
        # Write the updated content back to app.py
        with open(app_path, 'w') as f:
            f.write(updated_content)
        
        print("✅ Updated ML service to use ResNet50 model")
        return True
    else:
        print("❌ ML service app.py not found")
        return False

def main():
    """Main function"""
    print("Civic Connect - ML Service ResNet50 Update")
    print("=" * 45)
    
    if update_ml_service():
        print("\n🎉 ML service successfully updated to use ResNet50 model!")
        print("You can now restart the ML service to use the new model.")
    else:
        print("\n❌ Failed to update ML service.")

if __name__ == "__main__":
    main()