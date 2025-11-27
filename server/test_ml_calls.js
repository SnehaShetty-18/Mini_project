const fs = require('fs');
const path = require('path');
const { analyzeImage, classifySeverity, classifyAreaType } = require('./services/mlService');

async function testMLCalls() {
  console.log('Testing ML service calls...');
  
  // Test with a real image file
  const testImagePath = path.join(__dirname, '..', 'ml-service', 'test_image.jpg');
  
  if (fs.existsSync(testImagePath)) {
    console.log('Test image found, testing analyzeImage...');
    try {
      const result = await analyzeImage('/../ml-service/test_image.jpg');
      console.log('analyzeImage result:', result);
    } catch (error) {
      console.error('analyzeImage error:', error.message);
    }
    
    console.log('Testing classifySeverity...');
    try {
      const result = await classifySeverity('/../ml-service/test_image.jpg');
      console.log('classifySeverity result:', result);
    } catch (error) {
      console.error('classifySeverity error:', error.message);
    }
  } else {
    console.log('Test image not found');
  }
  
  console.log('Testing classifyAreaType...');
  try {
    const result = await classifyAreaType('40.7128', '-74.0060');
    console.log('classifyAreaType result:', result);
  } catch (error) {
    console.error('classifyAreaType error:', error.message);
  }
}

testMLCalls();