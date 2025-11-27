const axios = require('axios');
const config = require('../config/env');
const { getDetailedLocationInfo: getOSMLocationInfo } = require('./osmService');

// @desc    Get detailed location information using Google Maps Geocoding API or fallback to OSM
// @param   latitude - GPS latitude
// @param   longitude - GPS longitude
// @return  detailed location information
exports.getDetailedLocationInfo = async (latitude, longitude) => {
  try {
    // Check if Google Maps API key is configured and billing is enabled
    if (config.MAP_API_KEY && config.MAP_API_KEY !== 'your_google_maps_api_key_here') {
      // Try Google Maps first
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${config.MAP_API_KEY}`
        );
        
        if (response.data.status === 'OK' && response.data.results && response.data.results.length > 0) {
          const result = response.data.results[0];
          
          // Extract useful information
          const locationInfo = {
            formatted_address: result.formatted_address,
            place_id: result.place_id,
            types: result.types,
            address_components: {}
          };
          
          // Parse address components
          result.address_components.forEach(component => {
            const type = component.types[0];
            locationInfo.address_components[type] = {
              long_name: component.long_name,
              short_name: component.short_name
            };
          });
          
          return locationInfo;
        }
      } catch (googleError) {
        console.warn('Google Maps API error, falling back to OpenStreetMap:', googleError.message);
      }
    }
    
    // Fallback to OpenStreetMap Nominatim
    console.log('Using OpenStreetMap Nominatim as fallback for location data');
    return await getOSMLocationInfo(latitude, longitude);
  } catch (error) {
    console.error('Location service error:', error.message);
    return null;
  }
};

// @desc    Reverse geocode using Google Maps API via server-side call
// @param   latitude - GPS latitude
// @param   longitude - GPS longitude
// @return  detailed location information
exports.reverseGeocode = async (latitude, longitude) => {
  try {
    // Check if Google Maps API key is configured and billing is enabled
    if (config.MAP_API_KEY && config.MAP_API_KEY !== 'your_google_maps_api_key_here') {
      // Use Google Maps first
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${config.MAP_API_KEY}`
        );
        
        if (response.data.status === 'OK' && response.data.results && response.data.results.length > 0) {
          const result = response.data.results[0];
          
          // Extract useful information
          const locationInfo = {
            formatted_address: result.formatted_address,
            place_id: result.place_id,
            types: result.types,
            address_components: {}
          };
          
          // Parse address components
          result.address_components.forEach(component => {
            const type = component.types[0];
            locationInfo.address_components[type] = {
              long_name: component.long_name,
              short_name: component.short_name
            };
          });
          
          // Special handling for Mangaluru coordinates
          // Check if coordinates are in the Mangaluru region
          const isLikelyMangaluru = 
            latitude >= 12.8 && latitude <= 13.0 && 
            longitude >= 74.8 && longitude <= 75.0;
          
          // Extract specific components for our app
          const components = locationInfo.address_components;
          
          // Special handling for Mangaluru - ensure we get the correct city name
          let city = '';
          if (isLikelyMangaluru) {
            // Look for Mangaluru/Mangalore in the results
            const mangaluruMatch = response.data.results.find(r => 
              r.formatted_address?.toLowerCase().includes('mangaluru') || 
              r.formatted_address?.toLowerCase().includes('mangalore')
            );
            
            if (mangaluruMatch) {
              // Find the locality component in the Mangaluru result
              const mangaluruComponents = {};
              mangaluruMatch.address_components.forEach(component => {
                mangaluruComponents[component.types[0]] = {
                  long_name: component.long_name,
                  short_name: component.short_name
                };
              });
              
              city = mangaluruComponents.locality ? mangaluruComponents.locality.long_name : 
                    mangaluruComponents.administrative_area_level_2 ? mangaluruComponents.administrative_area_level_2.long_name : 
                    'Mangaluru';
            } else {
              // Fallback but still use Mangaluru as the city name
              city = 'Mangaluru';
            }
          } else {
            // Standard city extraction
            city = components.locality ? components.locality.long_name : 
                  components.administrative_area_level_2 ? components.administrative_area_level_2.long_name : 
                  components.administrative_area_level_1 ? components.administrative_area_level_1.long_name : 
                  '';
          }
          
          const state = components.administrative_area_level_1 ? components.administrative_area_level_1.long_name : '';
          const country = components.country ? components.country.long_name : '';
          const neighborhood = components.neighborhood ? components.neighborhood.long_name : 
                             components.sublocality ? components.sublocality.long_name : 
                             '';
          
          return {
            address: locationInfo.formatted_address,
            city: city,
            state: state,
            country: country,
            neighborhood: neighborhood,
            ward: '', // Google Maps doesn't typically provide ward info
            district: components.administrative_area_level_2 ? components.administrative_area_level_2.long_name : '',
            place_name: neighborhood || city
          };
        }
      } catch (googleError) {
        console.warn('Google Maps API error, falling back to OpenStreetMap:', googleError.message);
      }
    }
    
    // Fallback to OpenStreetMap Nominatim
    console.log('Using OpenStreetMap Nominatim as fallback for location data');
    return await getOSMLocationInfo(latitude, longitude);
  } catch (error) {
    console.error('Location service error:', error.message);
    return null;
  }
};

// @desc    Get place details using Google Maps Places API
// @param   placeId - Google Maps Place ID
// @return  detailed place information
exports.getPlaceDetails = async (placeId) => {
  try {
    // Check if API key is configured
    if (!config.MAP_API_KEY || config.MAP_API_KEY === 'your_google_maps_api_key_here') {
      console.warn('Google Maps API key not configured. Cannot fetch place details.');
      return null;
    }
    
    // Make API call to Google Maps Places API
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${config.MAP_API_KEY}`
    );
    
    if (response.data.status === 'OK' && response.data.result) {
      const result = response.data.result;
      
      return {
        name: result.name,
        formatted_address: result.formatted_address,
        place_id: result.place_id,
        types: result.types,
        rating: result.rating,
        user_ratings_total: result.user_ratings_total,
        price_level: result.price_level,
        vicinity: result.vicinity,
        website: result.website,
        international_phone_number: result.international_phone_number,
        opening_hours: result.opening_hours
      };
    } else {
      console.warn('Google Maps Places API returned no results');
      return null;
    }
  } catch (error) {
    console.error('Google Maps Places API error:', error.message);
    return null;
  }
};

// @desc    Find nearby places using Google Maps Places API
// @param   latitude - GPS latitude
// @param   longitude - GPS longitude
// @param   radius - Search radius in meters (default: 1000)
// @param   type - Type of place to search for (e.g., 'park', 'hospital', 'school')
// @return  list of nearby places
exports.findNearbyPlaces = async (latitude, longitude, radius = 1000, type = null) => {
  try {
    // Check if API key is configured
    if (!config.MAP_API_KEY || config.MAP_API_KEY === 'your_google_maps_api_key_here') {
      console.warn('Google Maps API key not configured. Cannot search for nearby places.');
      return [];
    }
    
    // Build query parameters
    let queryParams = `location=${latitude},${longitude}&radius=${radius}&key=${config.MAP_API_KEY}`;
    if (type) {
      queryParams += `&type=${type}`;
    }
    
    // Make API call to Google Maps Places API
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?${queryParams}`
    );
    
    if (response.data.status === 'OK' && response.data.results) {
      // Map results to a cleaner format
      return response.data.results.map(place => ({
        name: place.name,
        place_id: place.place_id,
        formatted_address: place.vicinity,
        types: place.types,
        rating: place.rating,
        user_ratings_total: place.user_ratings_total,
        price_level: place.price_level,
        geometry: place.geometry
      }));
    } else {
      console.warn('Google Maps Places API returned no results');
      return [];
    }
  } catch (error) {
    console.error('Google Maps Places API error:', error.message);
    return [];
  }
};