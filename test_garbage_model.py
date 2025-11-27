"""
Test script to verify the garbage-specific model
"""
import sys
from pathlib import Path

# Add paths
script_dir = Path(__file__).parent
ml_models_dir = script_dir / "ml-models" / "classification"

sys.path.insert(0, str(ml_models_dir))

def test_garbage_model():
    """Test the garbage-specific model"""
    print("Testing Garbage-Specific Model")
    print("=" * 35)
    
    try:
        from predict_garbage import GarbagePredictor
        
        # Load the garbage model
        model_path = "ml-models/model_weights/resnet50_garbage_model.h5"
        class_indices_path = "ml-models/model_weights/garbage_class_indices.npy"
        
        if Path(model_path).exists():
            print("Loading garbage detection model...")
            garbage_predictor = GarbagePredictor(model_path, class_indices_path)
            
            if garbage_predictor.is_loaded:
                print("✅ Garbage model loaded successfully!")
                
                # Test with a garbage image
                garbage_image = "data/raw/Garbage/Garbage_bin_000100_1.jpg"
                if Path(garbage_image).exists():
                    print(f"\nTesting with garbage image: {garbage_image}")
                    result = garbage_predictor.predict(garbage_image)
                    print(f"Prediction: {result}")
                else:
                    print(f"❌ Garbage test image not found: {garbage_image}")
            else:
                print("❌ Failed to load garbage model")
        else:
            print(f"❌ Garbage model file not found: {model_path}")
            
    except Exception as e:
        print(f"Error testing garbage model: {e}")
        import traceback
        traceback.print_exc()

def test_all_models():
    """Test all models with sample images"""
    print("\nTesting All Models with Sample Images")
    print("=" * 40)
    
    # Test images
    test_cases = [
        ("data/raw/pothole/1.jpg", "pothole"),
        ("data/raw/Garbage/Garbage_bin_000100_1.jpg", "garbage"),
        ("data/raw/streetlight/1709693294152.jpg", "streetlight")
    ]
    
    # Load all predictors
    try:
        # Add classification directory to path
        sys.path.insert(0, str(Path("ml-models/classification")))
        
        from predict_resnet50 import ResNet50Predictor
        from predict_simple import SimpleCNNPredictor
        from predict_garbage import GarbagePredictor
        
        # Load models
        resnet50_model = ResNet50Predictor(
            "ml-models/model_weights/resnet50_civic_model.h5",
            "ml-models/model_weights/class_indices.npy"
        )
        
        simple_cnn_model = SimpleCNNPredictor(
            "ml-models/model_weights/simple_cnn_model.pkl"
        )
        
        garbage_model = GarbagePredictor(
            "ml-models/model_weights/resnet50_garbage_model.h5",
            "ml-models/model_weights/garbage_class_indices.npy"
        )
        
        print("Models loaded:")
        print(f"  ResNet50: {'✅' if resnet50_model.is_loaded else '❌'}")
        print(f"  SimpleCNN: {'✅' if simple_cnn_model.is_loaded else '❌'}")
        print(f"  Garbage: {'✅' if garbage_model.is_loaded else '❌'}")
        
        # Test each case
        for image_path, expected_class in test_cases:
            if Path(image_path).exists():
                print(f"\n--- Testing {expected_class} ---")
                print(f"Image: {image_path}")
                
                # Get predictions from all models
                if resnet50_model.is_loaded:
                    resnet_pred = resnet50_model.predict(image_path)
                    print(f"ResNet50: {resnet_pred}")
                
                if simple_cnn_model.is_loaded:
                    simple_pred = simple_cnn_model.predict(image_path)
                    print(f"SimpleCNN: {simple_pred}")
                
                if garbage_model.is_loaded:
                    garbage_pred = garbage_model.predict(image_path)
                    print(f"Garbage Model: {garbage_pred}")
            else:
                print(f"\n❌ Test image not found: {image_path}")
                
    except Exception as e:
        print(f"Error testing all models: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_garbage_model()
    test_all_models()