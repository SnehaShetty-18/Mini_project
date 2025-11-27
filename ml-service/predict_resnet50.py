"""
Prediction script for ResNet50 model for civic issue classification
"""
import tensorflow as tf
from tensorflow.keras.applications import ResNet50
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.models import Model
import numpy as np
from PIL import Image
import os
from pathlib import Path

class ResNet50Predictor:
    """Predictor class for ResNet50 model"""
    
    def __init__(self, model_path=None, class_indices_path=None):
        self.model = None
        self.class_indices = None
        self.is_loaded = False
        
        if model_path and class_indices_path:
            self.load_model(model_path, class_indices_path)
    
    def load_model(self, model_path, class_indices_path):
        """Load the trained ResNet50 model"""
        try:
            # Load the model
            self.model = tf.keras.models.load_model(model_path)
            
            # Load class indices
            self.class_indices = np.load(class_indices_path, allow_pickle=True).item()
            
            # Create reverse mapping (index to class name)
            self.class_names = {v: k for k, v in self.class_indices.items()}
            
            self.is_loaded = True
            print(f"Model loaded successfully from {model_path}")
            print(f"Classes: {list(self.class_names.values())}")
        except Exception as e:
            print(f"Failed to load model: {e}")
            self.is_loaded = False
    
    def preprocess_image(self, image_path):
        """Preprocess image for prediction"""
        try:
            # Open and resize image
            img = Image.open(image_path)
            img = img.convert('RGB')  # Ensure RGB
            img = img.resize((224, 224))  # ResNet50 input size
            
            # Convert to numpy array and normalize
            img_array = np.array(img)
            img_array = img_array.astype(np.float32) / 255.0
            
            # Add batch dimension
            img_array = np.expand_dims(img_array, axis=0)
            
            return img_array
        except Exception as e:
            print(f"Error processing image {image_path}: {e}")
            return None
    
    def predict(self, image_path):
        """Predict the class of an image"""
        if not self.is_loaded:
            print("Model not loaded. Please load model first.")
            return None
        
        # Preprocess image
        img_array = self.preprocess_image(image_path)
        if img_array is None:
            return None
        
        try:
            # Make prediction
            predictions = self.model.predict(img_array, verbose=0)
            predicted_class_idx = np.argmax(predictions[0])
            confidence = float(predictions[0][predicted_class_idx])
            predicted_class = self.class_names[predicted_class_idx]
            
            # Get all class probabilities
            all_predictions = {}
            for idx, class_name in self.class_names.items():
                all_predictions[class_name] = float(predictions[0][idx])
            
            return {
                "class": predicted_class,
                "confidence": confidence,
                "all_predictions": all_predictions
            }
        except Exception as e:
            print(f"Error during prediction: {e}")
            return None

def main():
    """Main function to test the predictor"""
    print("ResNet50 Predictor for Civic Issue Classification")
    print("=" * 50)
    
    # Paths to model files
    model_path = "../model_weights/resnet50_civic_model.h5"
    class_indices_path = "../model_weights/class_indices.npy"
    
    # Check if model files exist
    if not os.path.exists(model_path):
        print(f"Model file not found: {model_path}")
        print("Please train the model first using train_resnet50.py")
        return
    
    if not os.path.exists(class_indices_path):
        print(f"Class indices file not found: {class_indices_path}")
        print("Please train the model first using train_resnet50.py")
        return
    
    # Initialize predictor
    predictor = ResNet50Predictor(model_path, class_indices_path)
    
    if not predictor.is_loaded:
        print("Failed to load model")
        return
    
    # Test with a sample image (if available)
    # You can replace this with an actual test image path
    test_image_dir = "../../data/raw/pothole"
    if os.path.exists(test_image_dir):
        test_images = list(Path(test_image_dir).glob("*.jpg"))
        if test_images:
            test_image = str(test_images[0])
            print(f"\nTesting with image: {test_image}")
            
            result = predictor.predict(test_image)
            if result:
                print(f"Predicted class: {result['class']}")
                print(f"Confidence: {result['confidence']:.4f}")
                print("All predictions:")
                for class_name, prob in result['all_predictions'].items():
                    print(f"  {class_name}: {prob:.4f}")
            else:
                print("Prediction failed")
        else:
            print("No test images found")
    else:
        print("Test image directory not found")

if __name__ == "__main__":
    main()