const { reverseGeocode: reverseGeocodeService } = require('../services/locationService');

// @desc    Reverse geocode coordinates to address
// @route   GET /api/location/reverse-geocode
// @access  Public
exports.reverseGeocode = async (req, res) => {
  try {
    const { lat, lng } = req.query;
    
    // Validate coordinates
    if (!lat || !lng) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }
    
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    
    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({ message: 'Invalid coordinates' });
    }
    
    // Call the service to reverse geocode
    const locationData = await reverseGeocodeService(latitude, longitude);
    
    if (!locationData) {
      return res.status(404).json({ message: 'Location not found' });
    }
    
    res.json(locationData);
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};