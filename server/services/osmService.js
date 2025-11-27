const axios = require('axios');

// @desc    Get detailed location information using OpenStreetMap Nominatim API
// @param   latitude - GPS latitude
// @param   longitude - GPS longitude
// @return  detailed location information
exports.getDetailedLocationInfo = async (latitude, longitude) => {
  try {
    // Make API call to OpenStreetMap Nominatim API
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'CivicConnect/1.0' // Required by Nominatim terms
        }
      }
    );
    
    if (response.data && response.data.address) {
      const data = response.data;
      const address = data.address || {};
      
      // Special handling for Mangaluru coordinates
      // Check if coordinates are in the Mangaluru region
      const isLikelyMangaluru = 
        latitude >= 12.8 && latitude <= 13.0 && 
        longitude >= 74.8 && longitude <= 75.0;
      
      // Build formatted address
      const addressParts = [
        address.house_number,
        address.road,
        address.suburb || address.neighbourhood,
        isLikelyMangaluru ? 'Mangaluru' : (address.city || address.town || address.village)
      ].filter(Boolean);
      
      // Special handling for Mangaluru - ensure correct city name
      let city = '';
      if (isLikelyMangaluru) {
        city = 'Mangaluru';
      } else {
        city = address.city || address.town || address.village || '';
      }
      
      return {
        formatted_address: data.display_name || addressParts.join(', '),
        place_id: data.place_id,
        osm_id: data.osm_id,
        osm_type: data.osm_type,
        lat: data.lat,
        lon: data.lon,
        address_components: {
          house_number: address.house_number,
          road: address.road,
          neighborhood: address.suburb || address.neighbourhood,
          city: city,
          state: address.state,
          postcode: address.postcode,
          country: address.country
        },
        boundingbox: data.boundingbox
      };
    } else {
      console.warn('OpenStreetMap Nominatim API returned no results');
      return null;
    }
  } catch (error) {
    console.error('OpenStreetMap Nominatim API error:', error.message);
    return null;
  }
};

// @desc    Forward geocode: Convert address to coordinates using OpenStreetMap
// @param   address - Text address to geocode
// @return  coordinates
exports.geocode = async (address) => {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
      {
        headers: {
          'User-Agent': 'CivicConnect/1.0' // Required by Nominatim terms
        }
      }
    );
    
    if (response.data && response.data.length > 0) {
      const result = response.data[0];
      return {
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        boundingbox: result.boundingbox
      };
    } else {
      console.warn('OpenStreetMap Nominatim API returned no results for geocoding');
      return null;
    }
  } catch (error) {
    console.error('OpenStreetMap Nominatim geocoding error:', error.message);
    return null;
  }
};

// @desc    Find nearby places using Overpass API (alternative to Google Places)
// @param   latitude - GPS latitude
// @param   longitude - GPS longitude
// @param   radius - Search radius in meters (default: 1000)
// @return  list of nearby places
exports.findNearbyPlaces = async (latitude, longitude, radius = 1000) => {
  try {
    // This is a simplified version - Overpass API queries can be complex
    // For now, we'll return an empty array as this requires more complex implementation
    console.log('Overpass API implementation would go here for finding nearby places');
    return [];
  } catch (error) {
    console.error('OpenStreetMap Overpass API error:', error.message);
    return [];
  }
};