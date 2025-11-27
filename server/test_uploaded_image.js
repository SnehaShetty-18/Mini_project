const fs = require('fs');
const path = require('path');
const { analyzeImage, classifySeverity } = require('./services/mlService');

async function testUploadedImage() {
  console.log('Testing ML service with uploaded image...');
  
  // Test with an actual uploaded image
  const testImagePath = '/uploads/image-1763703941276-476630183.jpg';
  
  console.log('Testing analyzeImage with uploaded image...');
  try {
    const result = await analyzeImage(testImagePath);
    console.log('analyzeImage result:', result);
  } catch (error) {
    console.error('analyzeImage error:', error.message);
    console.error('Full error:', error);
  }
  
  console.log('Testing classifySeverity with uploaded image...');
  try {
    const result = await classifySeverity(testImagePath);
    console.log('classifySeverity result:', result);
  } catch (error) {
    console.error('classifySeverity error:', error.message);
    console.error('Full error:', error);
  }
}

testUploadedImage();