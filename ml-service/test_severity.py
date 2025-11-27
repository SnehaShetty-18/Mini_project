import requests

# Test the severity classification
url = "http://localhost:8000/severity"
files = {"file": open("test_image.jpg", "rb")}

response = requests.post(url, files=files)
print(response.json())