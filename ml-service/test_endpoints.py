import requests

# Test the ML service endpoints to see what format they expect
print("Testing ML service endpoints...")

# Test classify endpoint
print("\n1. Testing /classify endpoint:")
url = "http://localhost:8000/classify"
files = {"file": open("test_image.jpg", "rb")}

try:
    response = requests.post(url, files=files)
    print("Status Code:", response.status_code)
    print("Response:", response.json())
except Exception as e:
    print("Error:", e)

# Test severity endpoint
print("\n2. Testing /severity endpoint:")
url = "http://localhost:8000/severity"
files = {"file": open("test_image.jpg", "rb")}

try:
    response = requests.post(url, files=files)
    print("Status Code:", response.status_code)
    print("Response:", response.json())
except Exception as e:
    print("Error:", e)

# Test area-type endpoint
print("\n3. Testing /area-type endpoint:")
url = "http://localhost:8000/area-type"

try:
    response = requests.post(url, json={"latitude": 40.7128, "longitude": -74.0060})
    print("Status Code:", response.status_code)
    print("Response:", response.json())
except Exception as e:
    print("Error:", e)