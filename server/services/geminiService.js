const axios = require('axios');
const config = require('../config/env');
const fs = require('fs').promises;
const path = require('path');

// @desc    Generate report using Gemini API
// @param   complaintData - Object containing complaint details
// @return  reportUrl - URL to the generated report
exports.generateReport = async (complaintData) => {
  try {
    // Check if API key is configured
    if (!config.GEMINI_API_KEY) {
      console.warn('Gemini API key not configured. Using simulated response.');
      // Simulate report generation for demo purposes
      console.log('Generating report for complaint:', complaintData);
      return `/reports/${Date.now()}-report.txt`;
    }
    
    // Create the prompt with all the information you want
    let locationInfo = complaintData.address || `(${complaintData.latitude}, ${complaintData.longitude})`;
    
    // Add detailed location information if available
    if (complaintData.detailedLocation) {
      // Handle both Google Maps and OpenStreetMap formats
      if (complaintData.detailedLocation.formatted_address) {
        locationInfo = complaintData.detailedLocation.formatted_address;
      }
      
      // Add additional location details if available
      if (complaintData.detailedLocation.address_components) {
        const components = complaintData.detailedLocation.address_components;
        // Google Maps format
        if (components.administrative_area_level_1) {
          locationInfo += `, ${components.administrative_area_level_1.short_name}`;
        }
        if (components.country) {
          locationInfo += `, ${components.country.long_name}`;
        }
        // OpenStreetMap format
        if (components.state) {
          locationInfo += `, ${components.state}`;
        }
        if (components.country && !components.country.long_name) {
          locationInfo += `, ${components.country}`;
        }
      }
    }
    
    // Get current date and time
    const now = new Date();
    const dateTimeInfo = {
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString(),
      dateTime: now.toString()
    };
    
    const prompt = `Generate a detailed summary report for the following civic complaint:
    
ISSUE CLASSIFICATION:
- Type: ${complaintData.issueType}
- Severity: ${complaintData.severity}
- Area Type: ${complaintData.areaType}

BASIC INFORMATION:
- Title: ${complaintData.title}
- Description: ${complaintData.description}
- Date Reported: ${dateTimeInfo.date}
- Time Reported: ${dateTimeInfo.time}
- Location: ${locationInfo}

Please provide a professional summary that includes:
1. A clear summary of the classified issue type
2. The date and time the issue was reported
3. Key details about the issue based on the provided information
4. Recommended department to handle this issue
5. Suggested priority level based on severity

Format the response in a clear, professional manner suitable for municipal authorities.`;

    // Make API call to Gemini using the correct model (gemini-1.5-flash is the current stable version)
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${config.GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    // Extract the generated content
    const reportContent = response.data.candidates[0].content.parts[0].text;
    
    // Create reports directory if it doesn't exist
    const reportsDir = path.join(__dirname, '..', 'reports');
    try {
      await fs.access(reportsDir);
    } catch {
      await fs.mkdir(reportsDir, { recursive: true });
    }
    
    // Save report to file
    const fileName = `${Date.now()}-${complaintData.issueType.replace(/\s+/g, '_')}-report.txt`;
    const filePath = path.join(reportsDir, fileName);
    await fs.writeFile(filePath, reportContent);
    
    // Return the URL to access the report
    return `/reports/${fileName}`;
  } catch (error) {
    console.error('Report generation failed:', error.message);
    // Fallback to simulated response
    return `/reports/${Date.now()}-report.txt`;
  }
};