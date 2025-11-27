"""
Test the combined model approach for civic issue classification
"""
import requests
import os
from pathlib import Path

def test_classification(image_path, expected_class):
    """Test classification for a specific image"""
    print(f"\nTesting {expected_class} detection")
    print("-" * 30)
    
    if not os.path.exists(image_path):
        print(f"❌ Test image not found: {image_path}")
        return
    
    try:
        # Test classification endpoint
        url = "http://localhost:8000/classify"
        with open(image_path, 'rb') as f:
            files = {'file': (os.path.basename(image_path), f, 'image/jpeg')}
            response = requests.post(url, files=files)
        
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            predicted_class = result.get('issueType', 'N/A')
            confidence = result.get('confidence', 0)
            
            print(f"✅ Classification successful!")
            print(f"   Predicted: {predicted_class}")
            print(f"   Expected:  {expected_class}")
            print(f"   Confidence: {confidence:.4f}")
            
            # Check if prediction matches expectation
            if predicted_class.lower() == expected_class.lower():
                print(f"   🎯 Correct prediction!")
            else:
                print(f"   ⚠️  Prediction mismatch")
        else:
            print(f"❌ Classification failed with status code: {response.status_code}")
            print(f"   Response: {response.text}")
            
    except Exception as e:
        print(f"❌ Error during classification test: {e}")

def test_models_info():
    """Test the models info endpoint"""
    print("Testing Combined Models Info")
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
                purpose = model_info.get('purpose', 'N/A')
                print(f"   {model_name}: {'✅ Available' if available else '❌ Not available'}")
                print(f"     Purpose: {purpose}")
        else:
            print(f"❌ Models info request failed with status code: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error during models info test: {e}")

def find_test_images():
    """Find test images for each class"""
    base_path = "data/raw"
    test_images = {}
    
    # Look for images in each category
    categories = ['pothole', 'garbage', 'streetlight']
    
    for category in categories:
        category_path = os.path.join(base_path, category)
        if os.path.exists(category_path):
            # Look for jpg files
            for file in os.listdir(category_path):
                if file.lower().endswith(('.jpg', '.jpeg')):
                    test_images[category] = os.path.join(category_path, file)
                    break
    
    return test_images

if __name__ == "__main__":
    print("Testing Combined Model Approach")
    print("=" * 35)
    
    # Test models info
    test_models_info()
    
    # Test with specific images for each category
    test_cases = [
        ("data/raw/pothole/1.jpg", "pothole"),
        ("data/raw/garbage/Garbage_bin_000100_1.jpg", "garbage"),
        ("data/raw/streetlight/1709693294152.jpg", "streetlight")
    ]
    
    print(f"\nTesting with specific images:")
    for image_path, expected_class in test_cases:
        if os.path.exists(image_path):
            test_classification(image_path, expected_class)
        else:
            print(f"\n❌ Test image not found: {image_path}")
