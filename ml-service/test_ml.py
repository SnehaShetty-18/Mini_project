import requests

# Test the ML service
url = "http://localhost:8000/classify"
files = {"file": open("test_image.jpg", "rb")}

response = requests.post(url, files=files)
print(response.json())