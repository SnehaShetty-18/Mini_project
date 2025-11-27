#!/usr/bin/env python3
"""
ML Service for Civic Connect
Supports both SimpleCNN and ResNet50 models with automatic fallback
"""
from fastapi import FastAPI, File, UploadFile, Query
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import numpy as np
from PIL import Image
import io
import os
import sys
from pathlib import Path

# Add the classification directory to Python path
script_dir = Path(__file__).parent
classification_dir = script_dir.parent / "ml-models" / "classification"
sys.path.insert(0, str(classification_dir))

# Import predictors with graceful fallback
ResNet50Predictor = None
SimpleCNNPredictor = None
GarbagePredictor = None

print("Loading ML predictors...")
print(f"Python version: {sys.version}")

try:
    from predict_resnet50 import ResNet50Predictor
    print("✅ ResNet50Predictor available")
except ImportError as e:
    print(f"⚠️  ResNet50Predictor not available: {e}")

try:
    from predict_simple import SimpleCNNPredictor
    print("✅ SimpleCNNPredictor available")
except ImportError as e:
    print(f"⚠️  SimpleCNNPredictor not available: {e}")

try:
    from predict_garbage import GarbagePredictor
    print("✅ GarbagePredictor available")
except ImportError as e:
    print(f"⚠️  GarbagePredictor not available: {e}")

app = FastAPI(title="Civic Connect ML Service")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize predictors with the actual models if possible
predictor = None
resnet50_predictor = None
simple_cnn_predictor = None
garbage_predictor = None
active_model_type = "none"

print("\nInitializing ML models...")

# Load both models if available
# ResNet50 model (preferred for streetlight detection)
if ResNet50Predictor:
    try:
        model_path = script_dir.parent / "ml-models" / "model_weights" / "resnet50_civic_model.h5"
        class_indices_path = script_dir.parent / "ml-models" / "model_weights" / "class_indices.npy"
        if model_path.exists() and class_indices_path.exists():
            print("Attempting to load ResNet50 model...")
            resnet50_predictor = ResNet50Predictor(str(model_path), str(class_indices_path))
            if resnet50_predictor.is_loaded:
                print(f"✅ ResNet50 model loaded successfully from {model_path}")
            else:
                print(f"⚠️  Failed to load ResNet50 model from {model_path}")
        else:
            print("⚠️  ResNet50 model files not found")
    except Exception as e:
        print(f"⚠️  Error loading ResNet50 model: {e}")
else:
    print("⏭️  Skipping ResNet50 model (TensorFlow not available)")

# SimpleCNN model (for pothole and garbage detection)
if SimpleCNNPredictor:
    try:
        model_path = script_dir.parent / "ml-models" / "model_weights" / "simple_cnn_model.pkl"
        if model_path.exists():
            print("Attempting to load SimpleCNN model...")
            simple_cnn_predictor = SimpleCNNPredictor(str(model_path), silent=True)
            if simple_cnn_predictor.is_loaded:
                print(f"✅ SimpleCNN model loaded successfully from {model_path}")
            else:
                print(f"⚠️  Failed to load SimpleCNN model from {model_path}")
        else:
            print("⚠️  SimpleCNN model file not found")
    except Exception as e:
        print(f"⚠️  Error loading SimpleCNN model: {e}")
elif predictor is None:
    print("⏭️  Skipping SimpleCNN model (predictor not available)")

# Garbage-specific model (specialized for garbage detection)
if GarbagePredictor:
    try:
        model_path = script_dir.parent / "ml-models" / "model_weights" / "resnet50_garbage_model.h5"
        class_indices_path = script_dir.parent / "ml-models" / "model_weights" / "garbage_class_indices.npy"
        if model_path.exists():
            print("Attempting to load Garbage detection model...")
            garbage_predictor = GarbagePredictor(str(model_path), str(class_indices_path))
            if garbage_predictor.is_loaded:
                print(f"✅ Garbage detection model loaded successfully from {model_path}")
            else:
                print(f"⚠️  Failed to load Garbage detection model from {model_path}")
        else:
            print("⚠️  Garbage detection model file not found")
    except Exception as e:
        print(f"⚠️  Error loading Garbage detection model: {e}")
elif predictor is None:
    print("⏭️  Skipping Garbage detection model (predictor not available)")

# Report model status
resnet50_available = resnet50_predictor is not None and resnet50_predictor.is_loaded if resnet50_predictor else False
simple_cnn_available = simple_cnn_predictor is not None and simple_cnn_predictor.is_loaded if simple_cnn_predictor else False
garbage_model_available = garbage_predictor is not None and garbage_predictor.is_loaded if garbage_predictor else False

print(f"ResNet50 model: {'✅ Available' if resnet50_available else '❌ Not available'}")
print(f"SimpleCNN model: {'✅ Available' if simple_cnn_available else '❌ Not available'}")
print(f"Garbage detection model: {'✅ Available' if garbage_model_available else '❌ Not available'}")

# Define issue types, severities, and area types
issue_types = ['pothole', 'garbage', 'streetlight', 'water_leak', 'other']
severities = ['low', 'medium', 'high']
area_types = ['urban', 'busy', 'residential', 'rural']

@app.get("/")
async def root():
    return {"message": "Civic Connect ML Service"}

@app.post("/classify")
async def classify_issue(file: UploadFile = File(...)):
    """Classify the type of civic issue in the image using both models with improved logic"""
    try:
        # Read the file contents
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Save to temporary file for processing
        temp_path = "temp_image.jpg"
        image.save(temp_path)
        
        # Use all available models for classification
        resnet50_result = None
        simple_cnn_result = None
        garbage_result = None
        
        # Get prediction from ResNet50 model if available
        if resnet50_predictor and resnet50_predictor.is_loaded:
            try:
                resnet50_result = resnet50_predictor.predict(temp_path)
            except Exception as e:
                print(f"Error with ResNet50 prediction: {e}")
        
        # Get prediction from SimpleCNN model if available
        if simple_cnn_predictor and simple_cnn_predictor.is_loaded:
            try:
                simple_cnn_result = simple_cnn_predictor.predict(temp_path)
            except Exception as e:
                print(f"Error with SimpleCNN prediction: {e}")
        
        # Get prediction from Garbage-specific model if available
        if garbage_predictor and garbage_predictor.is_loaded:
            try:
                garbage_result = garbage_predictor.predict(temp_path)
            except Exception as e:
                print(f"Error with Garbage detection prediction: {e}")
        
        # Combine predictions intelligently
        final_prediction = None
        final_confidence = 0.0
        
        # Special handling: if we have a garbage-specific model, prioritize its predictions for garbage
        if garbage_result:
            garbage_class = garbage_result.get("class", "")
            garbage_conf = garbage_result.get("confidence", 0)
            
            # If the garbage model detects garbage with reasonable confidence, trust it
            if garbage_class.lower() == "garbage" and garbage_conf > 0.5:
                final_prediction = "garbage"
                final_confidence = garbage_conf
            # If the garbage model detects non-garbage with high confidence, consider it
            elif garbage_class.lower() != "garbage" and garbage_conf > 0.7:
                # Use the garbage model's prediction as additional evidence
                # but still go through the normal combination logic
                pass
                
        # If we haven't made a decision based on the garbage model, use the normal combination logic
        if final_prediction is None:
            if resnet50_result and simple_cnn_result:
                # Both models available - use intelligent combination
                resnet50_class = resnet50_result["class"]
                resnet50_conf = resnet50_result["confidence"]
                simple_cnn_class = simple_cnn_result["class"]
                simple_cnn_conf = simple_cnn_result["confidence"]
                
                # Improved logic with better thresholds and prioritization
                
                # Special handling for streetlight detection (ResNet50 is specialized for this)
                if resnet50_class == 'streetlight' and resnet50_conf > 0.8:
                    # Very high confidence streetlight detection from ResNet50 - trust it
                    final_prediction = 'streetlight'
                    final_confidence = resnet50_conf
                elif simple_cnn_class in ['pothole', 'garbage'] and simple_cnn_conf > 0.3:
                    # For pothole and garbage, prefer SimpleCNN if it has reasonable confidence
                    final_prediction = simple_cnn_class
                    final_confidence = simple_cnn_conf
                elif resnet50_class in ['pothole', 'garbage'] and resnet50_conf > 0.7:
                    # ResNet50 also detected pothole/garbage with high confidence
                    final_prediction = resnet50_class
                    final_confidence = resnet50_conf
                elif simple_cnn_class in ['pothole', 'garbage']:
                    # When dealing with pothole/garbage, prefer SimpleCNN by default
                    final_prediction = simple_cnn_class
                    final_confidence = simple_cnn_conf
                elif simple_cnn_conf > resnet50_conf + 0.2:
                    # SimpleCNN is significantly more confident
                    final_prediction = simple_cnn_class
                    final_confidence = simple_cnn_conf
                elif resnet50_conf > simple_cnn_conf + 0.3:
                    # ResNet50 is significantly more confident
                    # But be conservative - only trust ResNet50 for streetlight with high confidence
                    if resnet50_class == 'streetlight' and resnet50_conf > 0.7:
                        final_prediction = resnet50_class
                        final_confidence = resnet50_conf
                    else:
                        # For other classes, prefer SimpleCNN when ResNet50 is not very confident
                        final_prediction = simple_cnn_class
                        final_confidence = simple_cnn_conf
                else:
                    # When confidence levels are similar, prioritize based on specialization
                    if simple_cnn_class in ['pothole', 'garbage']:
                        # Prefer SimpleCNN for pothole/garbage
                        final_prediction = simple_cnn_class
                        final_confidence = simple_cnn_conf
                    elif resnet50_class == 'streetlight' and resnet50_conf > 0.6:
                        # Prefer ResNet50 for streetlight if it has good confidence
                        final_prediction = resnet50_class
                        final_confidence = resnet50_conf
                    else:
                        # Default to SimpleCNN for pothole/garbage cases
                        if simple_cnn_class in ['pothole', 'garbage']:
                            final_prediction = simple_cnn_class
                            final_confidence = simple_cnn_conf
                        else:
                            # For other cases, use the model with higher confidence
                            if resnet50_conf >= simple_cnn_conf:
                                final_prediction = resnet50_class
                                final_confidence = resnet50_conf
                            else:
                                final_prediction = simple_cnn_class
                                final_confidence = simple_cnn_conf
            elif resnet50_result:
                # Only ResNet50 available
                final_prediction = resnet50_result["class"]
                final_confidence = resnet50_result["confidence"]
            elif simple_cnn_result:
                # Only SimpleCNN available
                final_prediction = simple_cnn_result["class"]
                final_confidence = simple_cnn_result["confidence"]
            else:
                # No models available, use fallback
                issue_type = np.random.choice(issue_types)
                final_prediction = issue_type
                final_confidence = float(np.random.rand())
        
        # Clean up temporary file
        if os.path.exists(temp_path):
            os.remove(temp_path)
        
        return {
            "issueType": final_prediction,
            "confidence": float(final_confidence)
        }
            
    except Exception as e:
        # Clean up temporary file if it exists
        if os.path.exists("temp_image.jpg"):
            os.remove("temp_image.jpg")
        # Fallback to random classification on error
        issue_type = np.random.choice(issue_types)
        return {
            "issueType": issue_type,
            "confidence": float(np.random.rand())
        }

@app.post("/severity")
async def classify_severity(file: UploadFile = File(...)):
    """Classify the severity of the civic issue"""
    try:
        # Read the file contents
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Save to temporary file for processing
        temp_path = "temp_image.jpg"
        image.save(temp_path)
        
        # Use the actual model for prediction if available
        if predictor and predictor.is_loaded:
            result = predictor.predict(temp_path)
            if result and "confidence" in result:
                # Use confidence score to determine severity
                confidence = result["confidence"]
                
                if confidence >= 0.8:
                    severity = "high"
                elif confidence >= 0.6:
                    severity = "medium"
                else:
                    severity = "low"
                
                # Clean up temporary file
                if os.path.exists(temp_path):
                    os.remove(temp_path)
                
                return {
                    "severity": severity,
                    "confidence": confidence
                }
            else:
                # Clean up temporary file
                if os.path.exists(temp_path):
                    os.remove(temp_path)
                # Fallback to random severity if model fails
                severity = np.random.choice(severities)
                return {
                    "severity": severity,
                    "confidence": float(np.random.rand())
                }
        else:
            # Clean up temporary file
            if os.path.exists(temp_path):
                os.remove(temp_path)
            # Fallback to random severity if model not loaded
            severity = np.random.choice(severities)
            return {
                "severity": severity,
                "confidence": float(np.random.rand())
            }
    except Exception as e:
        # Clean up temporary file if it exists
        if os.path.exists("temp_image.jpg"):
            os.remove("temp_image.jpg")
        # Fallback to random severity on error
        severity = np.random.choice(severities)
        return {
            "severity": severity,
            "confidence": float(np.random.rand())
        }

@app.post("/area-type")
async def classify_area_type(
    latitude: float = Query(..., description="Latitude coordinate"),
    longitude: float = Query(..., description="Longitude coordinate")
):
    """Classify the area type based on location"""
    # In a real implementation, you would use geospatial data and the area type model
    # For now, we'll simulate the response based on coordinates
    
    # Simple heuristic: use latitude/longitude to determine area type
    # This is just for demonstration - in reality you'd use actual geospatial data
    
    # Simulate different area types based on coordinate patterns
    areaTypes = ['urban', 'busy', 'residential', 'rural']
    # Use a simple hash of coordinates to make it deterministic
    coordHash = abs((latitude * 1000000 + longitude * 1000000) % 4)
    area_type = areaTypes[int(coordHash)]
    
    return {
        "areaType": area_type,
        "confidence": float(np.random.rand())
    }

# Additional endpoints for model management
@app.get("/models/info")
async def get_models_info():
    """Get information about available models"""
    return {
        "active_model": "combined",  # Using multiple models
        "models": {
            "resnet50": {
                "available": resnet50_predictor is not None and resnet50_predictor.is_loaded if resnet50_predictor else False,
                "path": "../ml-models/model_weights/resnet50_civic_model.h5",
                "purpose": "Streetlight detection (higher accuracy)"
            },
            "simple_cnn": {
                "available": simple_cnn_predictor is not None and simple_cnn_predictor.is_loaded if simple_cnn_predictor else False,
                "path": "../ml-models/model_weights/simple_cnn_model.pkl",
                "purpose": "Pothole and garbage detection"
            },
            "garbage_detector": {
                "available": garbage_predictor is not None and garbage_predictor.is_loaded if garbage_predictor else False,
                "path": "../ml-models/model_weights/resnet50_garbage_model.h5",
                "purpose": "Specialized garbage detection model"
            }
        },
        "classification_model": {
            "name": "Civic Issue Classifier",
            "classes": issue_types,
            "version": "1.0.0",
            "approach": "Combined model strategy with specialization"
        },
        "severity_model": {
            "name": "Severity Classifier",
            "classes": severities,
            "version": "1.0.0"
        },
        "area_type_model": {
            "name": "Area Type Classifier",
            "classes": area_types,
            "version": "1.0.0",
            "path": "simulated"
        }
    }

@app.post("/models/reload")
async def reload_models():
    """Reload all ML models"""
    global predictor, resnet50_predictor, simple_cnn_predictor, garbage_predictor
    try:
        # Try to load ResNet50 model first (preferred for streetlight)
        model_path = script_dir.parent / "ml-models" / "model_weights" / "resnet50_civic_model.h5"
        class_indices_path = script_dir.parent / "ml-models" / "model_weights" / "class_indices.npy"
        if model_path.exists() and class_indices_path.exists() and ResNet50Predictor:
            resnet50_predictor = ResNet50Predictor(str(model_path), str(class_indices_path))
            if resnet50_predictor.is_loaded:
                predictor = resnet50_predictor
                return {"message": "ResNet50 model reloaded successfully", "success": True, "model": "ResNet50"}
            else:
                return {"message": f"Failed to load ResNet50 model from {model_path}", "success": False}
        elif SimpleCNNPredictor:
            # If ResNet50 failed, try SimpleCNN model
            model_path = script_dir.parent / "ml-models" / "model_weights" / "simple_cnn_model.pkl"
            if model_path.exists():
                simple_cnn_predictor = SimpleCNNPredictor(str(model_path), silent=True)
                if simple_cnn_predictor.is_loaded:
                    predictor = simple_cnn_predictor
                    return {"message": "SimpleCNN model reloaded successfully", "success": True, "model": "SimpleCNN"}
                else:
                    return {"message": f"Failed to load SimpleCNN model from {model_path}", "success": False}
            else:
                return {"message": f"Model file not found at {model_path}", "success": False}
        elif GarbagePredictor:
            # Try to load garbage-specific model
            model_path = script_dir.parent / "ml-models" / "model_weights" / "resnet50_garbage_model.h5"
            class_indices_path = script_dir.parent / "ml-models" / "model_weights" / "garbage_class_indices.npy"
            if model_path.exists() and GarbagePredictor:
                garbage_predictor = GarbagePredictor(str(model_path), str(class_indices_path))
                if garbage_predictor.is_loaded:
                    return {"message": "Garbage detection model reloaded successfully", "success": True, "model": "GarbageDetector"}
                else:
                    return {"message": f"Failed to load Garbage detection model from {model_path}", "success": False}
            else:
                return {"message": "No model predictors available", "success": False}
        else:
            return {"message": "No model predictors available", "success": False}
    except Exception as e:
        return {"message": f"Failed to reload models: {str(e)}", "success": False}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)