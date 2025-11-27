const { generateReport } = require('./services/geminiService');

async function testGeminiIntegration() {
  console.log('Testing Gemini API Integration...');
  
  // Sample complaint data
  const complaintData = {
    title: 'Large Pothole on Main Street',
    description: 'There is a large pothole that has been growing bigger over the past week',
    issueType: 'pothole',
    severity: 'high',
    areaType: 'urban',
    address: '123 Main Street',
    latitude: '40.7128',
    longitude: '-74.0060'
  };
  
  try {
    console.log('Generating report with complaint data:', complaintData);
    const reportUrl = await generateReport(complaintData);
    console.log('Report generated successfully!');
    console.log('Report URL:', reportUrl);
  } catch (error) {
    console.error('Error generating report:', error.message);
  }
}

testGeminiIntegration();