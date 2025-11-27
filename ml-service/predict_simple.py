"""
Prediction script for the simple CNN model
"""

import pickle
import numpy as np
from PIL import Image
from pathlib import Path
import sys

class SimpleCNNPredictor:
    """Simple CNN model predictor"""
    
    def __init__(self, model_path, silent=False):
        self.model_path = model_path
        self.model = None
        self.label_encoder = None
        self.is_loaded = False
        self.silent = silent
        self.load_model()
    
    def load_model(self):
        """Load the trained model"""
        try:
            with open(self.model_path, 'rb') as f:
                model_data = pickle.load(f)
            
            self.model = model_data['model']
            self.label_encoder = model_data['label_encoder']
            self.is_loaded = True
            if not self.silent:
                print(f"[SUCCESS] Model loaded successfully from {self.model_path}")
            return True
        except Exception as e:
            if not self.silent:
                print(f"[ERROR] Failed to load model: {e}")
            return False
    
    def preprocess_image(self, image_path, target_size=(64, 64)):
        """Preprocess a single image for prediction"""
        try:
            # Open and resize image
            img = Image.open(image_path)
            img = img.convert('RGB')  # Ensure RGB
            img = img.resize(target_size)
            
            # Convert to numpy array and flatten
            img_array = np.array(img)
            # Normalize pixel values to 0-1 range
            img_array = img_array.astype(np.float32) / 255.0
            # Flatten the image
            img_flat = img_array.flatten()
            return img_flat
        except Exception as e:
            if not self.silent:
                print(f"[ERROR] Error processing image {image_path}: {e}")
            return None
    
    def predict(self, image_path):
        """Predict the class of a single image"""
        if not self.is_loaded:
            if not self.silent:
                print("[ERROR] Model not loaded")
            return None
        
        if self.model is None or self.label_encoder is None:
            if not self.silent:
                print("[ERROR] Model components not properly loaded")
            return None
        
        # Preprocess the image
        img_data = self.preprocess_image(image_path)
        if img_data is None:
            return None
        
        try:
            # Make prediction
            img_data = img_data.reshape(1, -1)  # Reshape for single prediction
            prediction = self.model.predict(img_data)[0]
            probabilities = self.model.predict_proba(img_data)[0]
            
            # Decode the prediction
            predicted_class = self.label_encoder.inverse_transform([prediction])[0]
            confidence = np.max(probabilities)
            
            # Get all class probabilities
            class_probs = {}
            for i, class_name in enumerate(self.label_encoder.classes_):
                class_probs[class_name] = float(probabilities[i])
            
            return {
                "class": predicted_class,
                "confidence": float(confidence),
                "all_predictions": class_probs
            }
        except Exception as e:
            if not self.silent:
                print(f"[ERROR] Error during prediction: {e}")
            return None

def main():
    """Main function for testing predictions"""
    print("Simple CNN Model Prediction")
    print("=" * 25)
    
    # Load the model
    model_path = "../model_weights/simple_cnn_model.pkl"
    predictor = SimpleCNNPredictor(model_path)
    
    if not predictor.is_loaded:
        print("Failed to load model. Please train the model first.")
        return
    
    if predictor.label_encoder is not None:
        print("Model loaded successfully!")
        print("Classes:", predictor.label_encoder.classes_)
    else:
        print("Model loaded but label encoder is missing.")
    
    print("\nTo use this predictor:")
    print("from predict_simple import SimpleCNNPredictor")
    print("predictor = SimpleCNNPredictor('path/to/model.pkl')")
    print("result = predictor.predict('path/to/image.jpg')")
    print("print(result)")

if __name__ == "__main__":
    main()