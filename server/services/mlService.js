const axios = require('axios');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const config = require('../config/env');

// @desc    Analyze image to determine issue type using Python ML model
// @param   imageUrl - URL of the uploaded image
// @return  issueType - classified type (pothole, garbage, etc.)
exports.analyzeImage = async (imageUrl) => {
  try {
    // Get the absolute path to the uploaded image
    const imagePath = path.join(__dirname, '..', 'uploads', path.basename(imageUrl));
    
    // Check if file exists
    if (!fs.existsSync(imagePath)) {
      console.error('Image file not found:', imagePath);
      // Return a default classification
      return 'other';
    }
    
    // Use Python script to classify the image
    const pythonScriptPath = path.join(__dirname, '..', '..', 'ml-models', 'classification', 'classify_api.py');
    
    // Check if Python script exists
    if (!fs.existsSync(pythonScriptPath)) {
      console.error('Python classification script not found:', pythonScriptPath);
      return 'other';
    }
    
    // Execute Python script
    const pythonProcess = spawn('python', [pythonScriptPath, imagePath]);
    
    let stdoutData = '';
    let stderrData = '';
    
    pythonProcess.stdout.on('data', (data) => {
      stdoutData += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
      stderrData += data.toString();
    });
    
    // Wait for the process to complete
    const result = await new Promise((resolve) => {
      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          console.error('Python script exited with code', code);
          console.error('stderr:', stderrData);
          resolve(null);
        } else {
          try {
            const result = JSON.parse(stdoutData);
            resolve(result);
          } catch (parseError) {
            console.error('Error parsing Python output:', parseError);
            console.error('Raw output:', stdoutData);
            resolve(null);
          }
        }
      });
    });
    
    if (result && result.success && result.prediction) {
      // Map the predicted class to the expected format
      const classMapping = {
        'pothole': 'pothole',
        'Garbage': 'garbage',
        'streetlight': 'streetlight',
        'potholes': 'pothole',
        'garbage': 'garbage',
        'streetlights': 'streetlight'
      };
      
      const mappedClass = classMapping[result.prediction.class] || result.prediction.class || 'other';
      return mappedClass;
    } else {
      console.error('Failed to classify image:', result ? result.error : 'No result');
      // Return a default classification
      return 'other';
    }
  } catch (error) {
    console.error('Image analysis failed:', error.message);
    // Return a default classification instead of throwing error
    return 'other';
  }
};

// @desc    Classify severity of the issue
// @param   imageUrl - URL of the uploaded image
// @return  severity - low, medium, or high
exports.classifySeverity = async (imageUrl) => {
  try {
    // Get the absolute path to the uploaded image
    const imagePath = path.join(__dirname, '..', 'uploads', path.basename(imageUrl));
    
    // Check if file exists
    if (!fs.existsSync(imagePath)) {
      console.error('Image file not found:', imagePath);
      // Return a default severity
      return 'medium';
    }
    
    // Use Python script to classify severity
    const pythonScriptPath = path.join(__dirname, '..', '..', 'ml-models', 'classification', 'classify_api.py');
    
    // Check if Python script exists
    if (!fs.existsSync(pythonScriptPath)) {
      console.error('Python classification script not found:', pythonScriptPath);
      return 'medium';
    }
    
    // Execute Python script with severity parameter
    const pythonProcess = spawn('python', [pythonScriptPath, imagePath, 'severity']);
    
    let stdoutData = '';
    let stderrData = '';
    
    pythonProcess.stdout.on('data', (data) => {
      stdoutData += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
      stderrData += data.toString();
    });
    
    // Wait for the process to complete
    const result = await new Promise((resolve) => {
      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          console.error('Python script exited with code', code);
          console.error('stderr:', stderrData);
          resolve(null);
        } else {
          try {
            const result = JSON.parse(stdoutData);
            resolve(result);
          } catch (parseError) {
            console.error('Error parsing Python output:', parseError);
            console.error('Raw output:', stdoutData);
            resolve(null);
          }
        }
      });
    });
    
    if (result && result.success && result.severity) {
      return result.severity;
    } else {
      console.error('Failed to classify severity:', result ? result.error : 'No result');
      // Return a default severity
      return 'medium';
    }
  } catch (error) {
    console.error('Severity classification failed:', error.message);
    // Return a default severity instead of throwing error
    return 'medium';
  }
};

// @desc    Classify area type based on location
// @param   latitude - GPS latitude
// @param   longitude - GPS longitude
// @return  areaType - urban, busy, residential, or rural
exports.classifyAreaType = async (latitude, longitude) => {
  try {
    // For now, return a default area type since we don't have a specific model for this
    // In a real implementation, you might use additional data sources or models
    return 'urban';
  } catch (error) {
    console.error('Area classification failed:', error.message);
    // Return a default area type instead of throwing error
    return 'urban';
  }
};