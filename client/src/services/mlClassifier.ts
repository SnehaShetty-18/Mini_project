/**
 * Machine Learning Image Classification Service
 * Uses the backend Python ML model for civic issue classification
 */

interface MLClassificationResult {
  category: string;
  subcategory: string;
  severity: 'low' | 'medium' | 'high' | 'urgent';
  confidence: number;
  timestamp: Date;
  location?: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  rawPredictions?: any[];
  isSimulated?: boolean; // Flag to indicate if this is simulated data
}

class MLClassificationService {
  // Use proxy URL to avoid CORS issues
  private readonly ML_SERVICE_URL = '/api/ml';

  /**
   * Classify image using backend Python ML model
   */
  async classifyImage(imageFile: File): Promise<MLClassificationResult> {
    try {
      // Auto-detect timestamp
      const timestamp = new Date();
      
      // Auto-detect location
      const location = await this.detectLocation();

      // Create FormData for the image
      const formData = new FormData();
      formData.append('file', imageFile);

      // Call the ML service API through the proxy
      console.log('🔍 Sending image to ML service for classification...');
      const response = await fetch(`${this.ML_SERVICE_URL}/classify`, {
        method: 'POST',
        body: formData,
      });

      console.log('📊 ML service response status:', response.status);
      // Convert headers to array for logging (avoiding TypeScript error)
      const headersArray: [string, string][] = [];
      response.headers.forEach((value, key) => {
        headersArray.push([key, value]);
      });
      console.log('📊 ML service response headers:', headersArray);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ ML service error response:', errorText);
        throw new Error(`ML service error: ${response.statusText} - ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ ML service response:', result);
      
      if (result && result.issueType) {
        console.log('🎯 Issue type detected:', result.issueType);
        // Map the issue type to category, subcategory, and severity
        const classification = this.mapIssueTypeToClassification(result.issueType);
        console.log('📋 Mapped classification:', classification);
        
        return {
          category: classification.category,
          subcategory: classification.subcategory,
          severity: classification.severity,
          confidence: result.confidence ? Math.round(result.confidence * 100) : 75,
          timestamp: timestamp,
          location: location,
          isSimulated: false
        };
      } else {
        // Fallback to simulated classification if the service doesn't return expected data
        console.warn('⚠️ ML service returned unexpected data, using simulated classification');
        return this.getSimulatedClassification(timestamp, location, true);
      }
    } catch (error) {
      console.error('❌ ML Classification Error:', error);
      // Fallback to simulated classification on error
      return this.getSimulatedClassification(new Date(), undefined, true);
    }
  }

  /**
   * Map issue type to category, subcategory, and severity
   */
  private mapIssueTypeToClassification(issueType: string): { 
    category: string; 
    subcategory: string; 
    severity: 'low' | 'medium' | 'high' | 'urgent' 
  } {
    // Use the actual issue types returned by the ML service as categories
    const mappings: Record<string, { category: string; subcategory: string; severity: 'low' | 'medium' | 'high' | 'urgent' }> = {
      'pothole': {
        category: 'Pothole',
        subcategory: 'Road Surface Damage',
        severity: 'high'
      },
      'garbage': {
        category: 'Garbage',
        subcategory: 'Overflowing Bin',
        severity: 'medium'
      },
      'streetlight': {
        category: 'Street Light',
        subcategory: 'Lighting Failure',
        severity: 'medium'
      },
      'water_leak': {
        category: 'Water Leak',
        subcategory: 'Infrastructure Leak',
        severity: 'urgent'
      },
      'other': {
        category: 'Other Issue',
        subcategory: 'Unidentified Issue',
        severity: 'medium'
      }
    };

    const mapped = mappings[issueType.toLowerCase()] || mappings['other'];
    console.log(`Mapping issue type "${issueType}" to category "${mapped.category}"`);
    return mapped;
  }

  /**
   * Auto-detect user's location using Geolocation API
   */
  private async detectLocation(): Promise<{ latitude: number; longitude: number; accuracy: number } | undefined> {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      return undefined;
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          console.warn('Geolocation error:', error);
          resolve(undefined);
        },
        { timeout: 5000, enableHighAccuracy: true }
      );
    });
  }

  /**
   * Simulated classification for demo purposes when ML model is not available
   */
  private getSimulatedClassification(
    timestamp: Date,
    location?: { latitude: number; longitude: number; accuracy: number },
    isSimulated: boolean = true
  ): MLClassificationResult {
    // Simulate different classifications for demo purposes using actual issue types
    const categories = [
      { name: 'Pothole', subcategory: 'Road Surface Damage', severity: 'high' as const },
      { name: 'Garbage', subcategory: 'Overflowing Bin', severity: 'medium' as const },
      { name: 'Street Light', subcategory: 'Lighting Failure', severity: 'medium' as const },
      { name: 'Water Leak', subcategory: 'Infrastructure Leak', severity: 'urgent' as const },
      { name: 'Other Issue', subcategory: 'Unidentified Issue', severity: 'medium' as const },
    ];
    
    // Randomly select a category for demo
    const randomIndex = Math.floor(Math.random() * categories.length);
    const selectedCategory = categories[randomIndex];
    
    // Generate realistic confidence score
    const confidence = Math.floor(Math.random() * 40) + 60; // Between 60-99%
    
    return {
      category: selectedCategory.name,
      subcategory: selectedCategory.subcategory,
      severity: selectedCategory.severity,
      confidence: confidence,
      timestamp: timestamp,
      location: location,
      isSimulated: isSimulated // Explicitly mark as simulated
    };
  }
}

// Singleton instance
let mlClassifierInstance: MLClassificationService | null = null;

export const getMLClassifier = (): MLClassificationService => {
  if (!mlClassifierInstance) {
    mlClassifierInstance = new MLClassificationService();
  }
  return mlClassifierInstance;
};

export type { MLClassificationResult };
export default MLClassificationService;