/**
 * Geocoding Service
 * Handles reverse geocoding (coordinates to address) and geocoding (address to coordinates)
 * Uses OpenCage Geocoding API (free tier available) and Google Maps as fallback
 */

export interface GeocodingResult {
  address: string;
  neighborhood?: string;
  ward?: string;
  city?: string;
  state?: string;
  country?: string;
  district?: string;
  place_name?: string;
}

class GeocodingService {
  private readonly OPENCAGE_BASE_URL = 'https://api.opencagedata.com/geocode/v1/json';
  private readonly API_KEY = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY || '';

  /**
   * Get location using IP Geolocation as fallback
   */
  private async getLocationFromIP(): Promise<{ latitude: number; longitude: number } | null> {
    try {
      // Use ipapi.co for IP geolocation (free tier allows 1000 requests per day)
      const response = await fetch('https://ipapi.co/json/');
      
      if (!response.ok) {
        throw new Error(`IP Geolocation failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.latitude && data.longitude) {
        return {
          latitude: data.latitude,
          longitude: data.longitude
        };
      }
      
      return null;
    } catch (error) {
      console.error('IP Geolocation error:', error);
      return null;
    }
  }

  /**
   * Reverse geocode: Convert lat/lng to address using server-side Google Maps or OpenCage
   */
  async reverseGeocode(latitude: number, longitude: number): Promise<GeocodingResult> {
    try {
      // Use our server endpoint which has access to Google Maps API
      const response = await fetch(`/api/location/reverse-geocode?lat=${latitude}&lng=${longitude}`);
      
      if (!response.ok) {
        throw new Error(`Geocoding failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Server geocoding error:', error);
      
      // Fallback to OpenCage if server endpoint fails
      return this.reverseGeocodeOpenCage(latitude, longitude);
    }
  }

  /**
   * Reverse geocode using OpenCage as fallback with improved accuracy for Indian locations
   */
  private async reverseGeocodeOpenCage(latitude: number, longitude: number): Promise<GeocodingResult> {
    try {
      // If no API key is provided, return basic coordinate information
      if (!this.API_KEY) {
        console.warn('OpenCage API key not configured. Returning basic location data.');
        return {
          address: `Location at ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
          neighborhood: 'Unknown',
          ward: 'Unknown',
          city: 'Unknown',
          state: 'Unknown',
          country: 'Unknown'
        };
      }

      // Use a more precise request with additional parameters for better accuracy
      // Increased limit to get more results and added bounds for India
      const url = `${this.OPENCAGE_BASE_URL}?q=${latitude}%2C${longitude}&key=${this.API_KEY}&no_annotations=1&pretty=1&limit=15&language=en&countrycode=IN&bounds=6.7471,68.0322,35.5133,97.3954`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Geocoding failed: ${response.statusText}`);
      }

      const data = await response.json();

      // Debug log to see what we're getting
      console.log('OpenCage API Response:', data);

      if (!data || data.status?.code !== 200 || !data.results || data.results.length === 0) {
        throw new Error(data?.status?.message || 'No results found');
      }

      // Special handling for Mangaluru coordinates (approx. 12.9141° N, 74.8560° E)
      // Check if coordinates are close to Mangaluru
      const isLikelyMangaluru = 
        latitude >= 12.8 && latitude <= 13.0 && 
        longitude >= 74.8 && longitude <= 75.0;

      if (isLikelyMangaluru) {
        // Look for results that mention Mangaluru/Mangalore specifically
        const mangaluruResults = data.results.filter((result: any) => 
          result.formatted?.toLowerCase().includes('mangaluru') || 
          result.formatted?.toLowerCase().includes('mangalore') ||
          result.components?.city?.toLowerCase().includes('mangaluru') ||
          result.components?.city?.toLowerCase().includes('mangalore')
        );

        if (mangaluruResults.length > 0) {
          // Prefer results that mention Mangaluru
          const bestResult = mangaluruResults[0];
          const components = bestResult.components || {};

          // Extract components with priority for Mangaluru-specific data
          const place_name = components.attraction || 
                            components.building || 
                            components.road || 
                            components.neighbourhood ||
                            components.suburb ||
                            components.city_district ||
                            '';

          const neighborhood = components.neighbourhood || 
                             components.suburb || 
                             components.city_district ||
                             '';

          const ward = components.city_district || 
                      components.municipality || 
                      components.county ||
                      '';

          const city = components.city?.toLowerCase().includes('mangaluru') || components.city?.toLowerCase().includes('mangalore') ?
                      components.city : 'Mangaluru';

          const district = components.county || 
                          components.state_district ||
                          'Dakshina Kannada';

          const state = components.state || 'Karnataka';
          const country = components.country || 'India';

          return {
            address: bestResult.formatted,
            neighborhood: neighborhood || '',
            ward: ward || '',
            city: city || 'Mangaluru',
            state: state || 'Karnataka',
            country: country || 'India',
            district: district || 'Dakshina Kannada',
            place_name: place_name || ''
          };
        }
      }

      // Look for the most accurate result for the given coordinates
      // Filter results that are closest to the provided coordinates
      const results = data.results;
      let bestResult = results[0]; // Default to first result
      
      // Find the result with the closest coordinates
      let minDistance = Infinity;
      for (const result of results) {
        const resultLat = result.geometry.lat;
        const resultLng = result.geometry.lng;
        const distance = Math.sqrt(Math.pow(resultLat - latitude, 2) + Math.pow(resultLng - longitude, 2));
        
        if (distance < minDistance) {
          minDistance = distance;
          bestResult = result;
        }
      }
      
      const components = bestResult.components || {};
      
      // Extract components with better hierarchy for Indian locations
      // Prioritize more specific location identifiers
      const place_name = components.attraction || 
                        components.building || 
                        components.road || 
                        components.neighbourhood ||
                        components.suburb ||
                        components.city_district ||
                        '';
      
      const neighborhood = components.neighbourhood || 
                         components.suburb || 
                         components.city_district ||
                         '';
      
      const ward = components.city_district || 
                  components.municipality || 
                  components.county ||
                  '';
      
      const city = components.city || 
                  components.town || 
                  components.village || 
                  '';
      
      const district = components.county || 
                      components.state_district ||
                      '';
      
      const state = components.state || 
                   '';
      
      const country = components.country || '';

      return {
        address: bestResult.formatted,
        neighborhood: neighborhood || '',
        ward: ward || '',
        city: city || '',
        state: state || '',
        country: country || '',
        district: district || '',
        place_name: place_name || ''
      };
    } catch (error) {
      console.error('OpenCage reverse geocoding error:', error);
      
      // Fallback to coordinate-based address
      return {
        address: `Location at ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
        neighborhood: 'Unknown',
        ward: 'Unknown',
        city: 'Unknown',
        state: 'Unknown',
        country: 'Unknown'
      };
    }
  }

  /**
   * Forward geocode: Convert address to coordinates using OpenCage
   */
  async geocode(address: string): Promise<{ latitude: number; longitude: number } | null> {
    try {
      // If no API key is provided, return null
      if (!this.API_KEY) {
        console.warn('OpenCage API key not configured. Geocoding unavailable.');
        return null;
      }

      const url = `${this.OPENCAGE_BASE_URL}?q=${encodeURIComponent(address)}&key=${this.API_KEY}&no_annotations=1`;
      
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Geocoding failed: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data || data.status?.code !== 200 || !data.results || data.results.length === 0) {
        throw new Error(data?.status?.message || 'No results found');
      }

      const result = data.results[0];
      return {
        latitude: result.geometry.lat,
        longitude: result.geometry.lng
      };
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  }

  /**
   * Get neighborhood info from coordinates
   */
  async getNeighborhoodInfo(latitude: number, longitude: number): Promise<{
    neighborhood: string;
    ward: string;
  }> {
    const result = await this.reverseGeocode(latitude, longitude);
    return {
      neighborhood: result.neighborhood || 'Unknown',
      ward: result.ward || 'Unknown'
    };
  }
}

// Singleton instance
let geocodingServiceInstance: GeocodingService | null = null;

export const getGeocodingService = (): GeocodingService => {
  if (!geocodingServiceInstance) {
    geocodingServiceInstance = new GeocodingService();
  }
  return geocodingServiceInstance;
};

// Helper function for reverse geocoding
export const reverseGeocode = async (latitude: number, longitude: number) => {
  const service = getGeocodingService();
  return await service.reverseGeocode(latitude, longitude);
};

export default GeocodingService;