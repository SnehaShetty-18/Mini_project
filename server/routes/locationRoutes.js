const express = require('express');
const { reverseGeocode } = require('../controllers/locationController');

const router = express.Router();

// @desc    Reverse geocode coordinates to address
// @route   GET /api/location/reverse-geocode
// @access  Public
router.get('/reverse-geocode', reverseGeocode);

module.exports = router;