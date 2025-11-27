/**
 * Gemini AI Service
 * Integrates Google's Gemini API for intelligent issue analysis and report generation
 */

interface GeminiAnalysisResult {
  category: string;
  subcategory: string;
  severity: 'low' | 'medium' | 'high' | 'urgent';
  confidence: number;
  description: string;
  suggestedDepartment: string;
  title: string;
  detailedDescription: string;
  safetyRisk: boolean;
  estimatedImpact: string;
}

interface GeminiConfig {
  apiKey: string;
  model?: string;
}

class GeminiService {
  private apiKey: string;
  private model: string;
  private baseURL: string;

  constructor(config: GeminiConfig) {
    this.apiKey = config.apiKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
    this.model = config.model || 'gemini-1.5-flash';
    this.baseURL = 'https://generativelanguage.googleapis.com/v1beta';
  }

  /**
   * Generate comprehensive report from ML classification results
   */
  async generateReportFromMLClassification(params: {
    mlClassification: {
      category: string;
      subcategory: string;
      severity: string;
      confidence: number;
      timestamp: Date;
      location?: { latitude: number; longitude: number; accuracy: number };
    };
    imageFile: File;
  }): Promise<GeminiAnalysisResult> {
    try {
      // Convert image to base64
      const base64Image = await this.fileToBase64(params.imageFile);
      
      // Create detailed prompt based on ML classification
      const prompt = `You are analyzing a civic infrastructure issue that has been classified by an ML model.

ML Classification Results:
- Category: ${params.mlClassification.category}
- Subcategory: ${params.mlClassification.subcategory}
- Severity: ${params.mlClassification.severity}
- Confidence: ${params.mlClassification.confidence}%
- Timestamp: ${params.mlClassification.timestamp.toLocaleString()}
${params.mlClassification.location ? `- Location: ${params.mlClassification.location.latitude}, ${params.mlClassification.location.longitude}` : ''}

Based on the image and ML classification, generate a comprehensive report in JSON format:
{
  "category": "${params.mlClassification.category}",
  "subcategory": "${params.mlClassification.subcategory}",
  "severity": "${params.mlClassification.severity}",
  "confidence": ${params.mlClassification.confidence},
  "description": "brief technical description of the issue seen in the image",
  "suggestedDepartment": "responsible municipal department",
  "title": "concise, specific issue title (max 10 words)",
  "detailedDescription": "comprehensive 2-3 sentence description including specific details visible in the image, safety concerns, and community impact",
  "safetyRisk": boolean (true if immediate safety hazard),
  "estimatedImpact": "community impact assessment"
}

Provide accurate, specific details based on what you see in the image. Verify the ML classification is correct.`;

      const response = await fetch(
        `${this.baseURL}/models/${this.model}:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [
                { text: prompt },
                {
                  inline_data: {
                    mime_type: params.imageFile.type,
                    data: base64Image
                  }
                }
              ]
            }]
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.statusText}`);
      }

      const data = await response.json();
      const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!textResponse) {
        throw new Error('No response from Gemini API');
      }

      // Parse JSON from response
      const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid JSON response from Gemini');
      }

      const result = JSON.parse(jsonMatch[0]);
      return result as GeminiAnalysisResult;

    } catch (error) {
      console.error('Gemini Report Generation Error:', error);
      // Return enhanced ML classification as fallback
      return this.enhanceMLClassification(params.mlClassification);
    }
  }

  /**
   * Enhance ML classification with additional details when Gemini fails
   */
  private enhanceMLClassification(mlData: any): GeminiAnalysisResult {
    const departmentMapping: Record<string, string> = {
      'Road Infrastructure': 'Public Works - Road Maintenance',
      'Street Lighting': 'Utilities - Street Lighting Division',
      'Waste Management': 'Sanitation - Waste Collection',
      'Traffic Safety': 'Transportation - Traffic Management',
      'Water & Drainage': 'Water Management - Infrastructure',
      'Parks & Recreation': 'Parks & Recreation Department'
    };

    return {
      category: mlData.category,
      subcategory: mlData.subcategory,
      severity: mlData.severity,
      confidence: mlData.confidence,
      description: `${mlData.category} issue detected requiring attention`,
      suggestedDepartment: departmentMapping[mlData.category] || 'Public Works',
      title: `${mlData.category} - ${mlData.subcategory}`,
      detailedDescription: `A ${mlData.severity} severity ${mlData.category.toLowerCase()} issue has been detected. Immediate assessment and appropriate action required to address this ${mlData.subcategory.toLowerCase()} problem.`,
      safetyRisk: mlData.severity === 'urgent' || mlData.severity === 'high',
      estimatedImpact: mlData.severity === 'urgent' ? 'High - Immediate action required' : 'Moderate - Scheduled maintenance needed'
    };
  }

  /**
   * Generate auto-report summary from issue details
   */
  async generateReportSummary(issueData: {
    category: string;
    location: string;
    images: number;
    aiAnalysis?: GeminiAnalysisResult;
  }): Promise<string> {
    try {
      const prompt = `Generate a professional civic issue report summary based on:
Category: ${issueData.category}
Location: ${issueData.location}
Number of images: ${issueData.images}
AI Analysis: ${JSON.stringify(issueData.aiAnalysis)}

Create a concise, formal summary for municipal authorities including:
1. Issue overview
2. Location and severity
3. Recommended action
4. Priority justification

Keep it under 150 words, professional tone.`;

      const response = await fetch(
        `${this.baseURL}/models/${this.model}:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: prompt }]
            }]
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Report summary unavailable';

    } catch (error) {
      console.error('Gemini Report Generation Error:', error);
      return `Issue reported in ${issueData.category} at ${issueData.location}. ${issueData.images} photo(s) submitted for review. Awaiting municipal assessment and action.`;
    }
  }

  /**
   * Convert File to base64 string
   */
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Fallback mock analysis when API is unavailable
   */
  private getMockAnalysis(fileName: string): GeminiAnalysisResult {
    const mockAnalyses: GeminiAnalysisResult[] = [
      {
        category: 'Road Infrastructure',
        subcategory: 'Potholes',
        severity: 'high',
        confidence: 92,
        description: 'Pothole detected on asphalt surface with visible damage to road structure',
        suggestedDepartment: 'Public Works - Road Maintenance',
        title: 'Severe Pothole Requiring Immediate Repair',
        detailedDescription: 'Large pothole approximately 2-3 feet in diameter with deep cracks extending from the main cavity. Poses risk to vehicle damage and potential safety hazard. Located in high-traffic area requiring prompt attention.',
        safetyRisk: true,
        estimatedImpact: 'High - Affects daily commuters and poses vehicle damage risk'
      },
      {
        category: 'Street Lighting',
        subcategory: 'Broken Light',
        severity: 'medium',
        confidence: 88,
        description: 'Broken street light fixture requiring electrical repair or replacement',
        suggestedDepartment: 'Utilities - Street Lighting Division',
        title: 'Non-functional Street Light Reducing Visibility',
        detailedDescription: 'Street light pole appears intact but fixture is not illuminating. May be electrical fault or bulb replacement needed. Affects pedestrian safety during nighttime hours.',
        safetyRisk: false,
        estimatedImpact: 'Medium - Reduces nighttime visibility and pedestrian safety'
      },
      {
        category: 'Waste Management',
        subcategory: 'Overflowing Bin',
        severity: 'medium',
        confidence: 95,
        description: 'Overflowing garbage bin requiring immediate collection and cleanup',
        suggestedDepartment: 'Sanitation - Waste Collection',
        title: 'Overflowing Waste Bin Creating Sanitation Concern',
        detailedDescription: 'Public waste receptacle is completely full with trash overflow on surrounding area. Creates unsanitary conditions and attracts pests. Requires immediate collection service.',
        safetyRisk: false,
        estimatedImpact: 'Medium - Sanitation concern affecting community cleanliness'
      }
    ];
    return mockAnalyses[Math.floor(Math.random() * mockAnalyses.length)];
  }
}

// Singleton instance
let geminiInstance: GeminiService | null = null;

export const getGeminiService = (): GeminiService => {
  if (!geminiInstance) {
    geminiInstance = new GeminiService({
      apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || '',
    });
  }
  return geminiInstance;
};

export type { GeminiAnalysisResult };
export default GeminiService;
