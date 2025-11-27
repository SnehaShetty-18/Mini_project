"""
Test the ML service with the ResNet50 model
"""
import requests
import os
from pathlib import Path

def test_classification():
    """Test the classification endpoint"""
    print("Testing ML Service with ResNet50 Model")
    print("=" * 35)
    
    # Test image path
    test_image_path = "data/raw/pothole/1.jpg"
    
    if not os.path.exists(test_image_path):
        print(f"❌ Test image not found: {test_image_path}")
        return
    
    try:
        # Test classification endpoint
        url = "http://localhost:8000/classify"
        with open(test_image_path, 'rb') as f:
            files = {'file': (os.path.basename(test_image_path), f, 'image/jpeg')}
            response = requests.post(url, files=files)
        
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print("✅ Classification successful!")
            print(f"   Issue Type: {result.get('issueType', 'N/A')}")
            print(f"   Confidence: {result.get('confidence', 0):.4f}")
        else:
            print(f"❌ Classification failed with status code: {response.status_code}")
            print(f"   Response: {response.text}")
            
    except Exception as e:
        print(f"❌ Error during classification test: {e}")

def test_models_info():
    """Test the models info endpoint"""
    print("\nTesting Models Info Endpoint")
    print("=" * 25)
    
    try:
        url = "http://localhost:8000/models/info"
        response = requests.get(url)
        
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print("✅ Models info retrieved successfully!")
            print(f"   Active Model: {result.get('active_model', 'N/A')}")
            models = result.get('models', {})
            for model_name, model_info in models.items():
                available = model_info.get('available', False)
                print(f"   {model_name}: {'✅ Available' if available else '❌ Not available'}")
        else:
            print(f"❌ Models info request failed with status code: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error during models info test: {e}")

if __name__ == "__main__":
    test_models_info()
    test_classification()