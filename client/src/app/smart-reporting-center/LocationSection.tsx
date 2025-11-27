'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Icon from '@/components/ui/AppIcon';
import { getGeocodingService } from '@/services/geocoding';

interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
  accuracy: number;
  neighborhood?: string;
  ward?: string;
}

interface LocationSectionProps {
  onLocationChange: (location: LocationData | null) => void;
  initialLocation?: LocationData | null;
}

const LocationSection = ({ onLocationChange, initialLocation }: LocationSectionProps) => {
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(initialLocation || null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [manualAddress, setManualAddress] = useState('');
  const [manualCoordinates, setManualCoordinates] = useState({
    lat: '',
    lng: ''
  });
  const [locationMethod, setLocationMethod] = useState<'auto' | 'manual' | 'coordinates'>('auto');
  const [error, setError] = useState<string | null>(null);
  
  const geocodingService = getGeocodingService();

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      // Browser doesn't support geolocation, try IP geolocation
      setIsDetecting(true);
      setError(null);
      
      fetch('https://ipapi.co/json/')
        .then(response => {
          if (!response.ok) {
            throw new Error('IP geolocation service unavailable');
          }
          return response.json();
        })
        .then(data => {
          if (data.latitude && data.longitude) {
            // Get address details from coordinates
            return geocodingService.reverseGeocode(data.latitude, data.longitude)
              .then(geocodingResult => {
                const locationData: LocationData = {
                  latitude: data.latitude,
                  longitude: data.longitude,
                  address: geocodingResult.address,
                  accuracy: 1000, // IP geolocation is less accurate
                  neighborhood: geocodingResult.neighborhood,
                  ward: geocodingResult.ward
                };
                
                setCurrentLocation(locationData);
                onLocationChange(locationData);
              });
          } else {
            throw new Error('IP geolocation did not return coordinates');
          }
        })
        .catch(error => {
          console.error('IP geolocation failed:', error);
          setError('Unable to detect location. Please enter manually.');
        })
        .finally(() => {
          setIsDetecting(false);
        });
      
      return;
    }

    setIsDetecting(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // Use real reverse geocoding
          const geocodingResult = await geocodingService.reverseGeocode(
            position.coords.latitude,
            position.coords.longitude
          );
          
          const locationData: LocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            address: geocodingResult.address,
            accuracy: position.coords.accuracy,
            neighborhood: geocodingResult.neighborhood,
            ward: geocodingResult.ward
          };
          
          setCurrentLocation(locationData);
          onLocationChange(locationData);
          setIsDetecting(false);
        } catch (error) {
          console.error('Geocoding failed:', error);
          // Fallback: use coordinates as address
          const locationData: LocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            address: `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`,
            accuracy: position.coords.accuracy,
            neighborhood: 'Unknown',
            ward: 'Unknown'
          };
          setCurrentLocation(locationData);
          onLocationChange(locationData);
          setIsDetecting(false);
        }
      },
      (error) => {
        // Browser geolocation failed, try IP geolocation as fallback
        console.log('Browser geolocation failed, trying IP geolocation...');
        fetch('https://ipapi.co/json/')
          .then(response => {
            if (!response.ok) {
              throw new Error('IP geolocation service unavailable');
            }
            return response.json();
          })
          .then(data => {
            if (data.latitude && data.longitude) {
              // Get address details from coordinates
              return geocodingService.reverseGeocode(data.latitude, data.longitude)
                .then(geocodingResult => {
                  const locationData: LocationData = {
                    latitude: data.latitude,
                    longitude: data.longitude,
                    address: geocodingResult.address,
                    accuracy: 1000, // IP geolocation is less accurate
                    neighborhood: geocodingResult.neighborhood,
                    ward: geocodingResult.ward
                  };
                  
                  setCurrentLocation(locationData);
                  onLocationChange(locationData);
                });
            } else {
              throw new Error('IP geolocation did not return coordinates');
            }
          })
          .catch(ipError => {
            console.error('IP geolocation failed:', ipError);
            setError('Unable to detect location. Please enter manually.');
          })
          .finally(() => {
            setIsDetecting(false);
          });
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000
      }
    );
  }, [onLocationChange, geocodingService]);

  const handleManualAddressSubmit = useCallback(async () => {
    if (!manualAddress.trim()) return;
    
    setIsDetecting(true);
    try {
      // Use real geocoding for manual address
      const coordinates = await geocodingService.geocode(manualAddress);
      
      if (coordinates) {
        // Get full address details
        const geocodingResult = await geocodingService.reverseGeocode(
          coordinates.latitude,
          coordinates.longitude
        );
        
        const locationData: LocationData = {
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          address: geocodingResult.address,
          accuracy: 10,
          neighborhood: geocodingResult.neighborhood,
          ward: geocodingResult.ward
        };
        
        setCurrentLocation(locationData);
        onLocationChange(locationData);
      } else {
        setError('Address not found. Please try a different address.');
      }
    } catch (error) {
      console.error('Geocoding failed:', error);
      setError('Failed to geocode address. Please try again.');
    } finally {
      setIsDetecting(false);
    }
  }, [manualAddress, onLocationChange, geocodingService]);

  const handleManualCoordinatesSubmit = useCallback(async () => {
    const lat = parseFloat(manualCoordinates.lat);
    const lng = parseFloat(manualCoordinates.lng);
    
    if (isNaN(lat) || isNaN(lng)) {
      setError('Please enter valid latitude and longitude coordinates');
      return;
    }
    
    // Validate coordinate ranges
    if (lat < -90 || lat > 90) {
      setError('Latitude must be between -90 and 90');
      return;
    }
    
    if (lng < -180 || lng > 180) {
      setError('Longitude must be between -180 and 180');
      return;
    }
    
    setIsDetecting(true);
    setError(null);
    
    try {
      // Get address details from coordinates
      const geocodingResult = await geocodingService.reverseGeocode(lat, lng);
      
      const locationData: LocationData = {
        latitude: lat,
        longitude: lng,
        address: geocodingResult.address,
        accuracy: 10, // Manual entry accuracy
        neighborhood: geocodingResult.neighborhood,
        ward: geocodingResult.ward
      };
      
      setCurrentLocation(locationData);
      onLocationChange(locationData);
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      // Still set the location with just coordinates if geocoding fails
      const locationData: LocationData = {
        latitude: lat,
        longitude: lng,
        address: `Location at ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        accuracy: 10,
        neighborhood: 'Unknown',
        ward: 'Unknown'
      };
      
      setCurrentLocation(locationData);
      onLocationChange(locationData);
    } finally {
      setIsDetecting(false);
    }
  }, [manualCoordinates, onLocationChange, geocodingService]);

  const clearLocation = useCallback(() => {
    setCurrentLocation(null);
    setManualAddress('');
    setManualCoordinates({ lat: '', lng: '' });
    setError(null);
    onLocationChange(null);
  }, [onLocationChange]);

  useEffect(() => {
    if (initialLocation) {
      setCurrentLocation(initialLocation);
    }
  }, [initialLocation]);

  // Clear error when user starts typing in manual address
  useEffect(() => {
    if (error && manualAddress) {
      setError(null);
    }
  }, [manualAddress, error]);

  // Clear error when user starts typing in manual coordinates
  useEffect(() => {
    if (error && (manualCoordinates.lat || manualCoordinates.lng)) {
      setError(null);
    }
  }, [manualCoordinates, error]);

  return (
    <div className="space-y-6">
      {/* Location Method Toggle */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setLocationMethod('auto')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-civic text-sm font-medium civic-transition ${
            locationMethod === 'auto' ?'bg-primary text-primary-foreground' :'bg-muted text-foreground hover:bg-muted/80'
          }`}
        >
          <Icon name="MapPinIcon" size={16} />
          <span>Auto-Detect</span>
        </button>
        
        <button
          onClick={() => setLocationMethod('manual')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-civic text-sm font-medium civic-transition ${
            locationMethod === 'manual' ?'bg-primary text-primary-foreground' :'bg-muted text-foreground hover:bg-muted/80'
          }`}
        >
          <Icon name="PencilIcon" size={16} />
          <span>Address</span>
        </button>

        <button
          onClick={() => setLocationMethod('coordinates')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-civic text-sm font-medium civic-transition ${
            locationMethod === 'coordinates' ?'bg-primary text-primary-foreground' :'bg-muted text-foreground hover:bg-muted/80'
          }`}
        >
          <Icon name="GlobeAltIcon" size={16} />
          <span>Coordinates</span>
        </button>
      </div>

      {/* Auto-Detection Section */}
      {locationMethod === 'auto' && (
        <div className="bg-card border border-border rounded-civic-lg p-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="MapPinIcon" size={32} className="text-primary" />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                GPS Location Detection
              </h3>
              <p className="text-text-secondary">
                {isDetecting 
                  ? 'Detecting your current location...' :'Get precise location coordinates for accurate issue reporting'
                }
              </p>
            </div>
            
            {isDetecting && (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm text-foreground">Acquiring GPS signal...</span>
              </div>
            )}
            
            {!isDetecting && !currentLocation && (
              <button
                onClick={getCurrentLocation}
                className="inline-flex items-center space-x-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-civic font-medium civic-transition"
              >
                <Icon name="MapPinIcon" size={20} />
                <span>Detect My Location</span>
              </button>
            )}
            
            {error && (
              <div className="bg-blue-50 border border-blue-200 rounded-civic p-4">
                <div className="flex items-center space-x-2 text-blue-800">
                  <Icon name="InformationCircleIcon" size={16} />
                  <span className="text-sm">{error}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Manual Entry Section */}
      {(locationMethod === 'manual' || locationMethod === 'coordinates') && (
        <div className="bg-card border border-border rounded-civic-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Enter Location Manually
          </h3>
          
          <div className="space-y-6">
            {/* Address Input */}
            {locationMethod === 'manual' && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Street Address
                </label>
                
                {/* Helpful tip for Mangaluru addresses */}
                <div className="bg-blue-50 border border-blue-200 rounded-civic p-3 mb-3">
                  <div className="flex items-start space-x-2">
                    <Icon name="InformationCircleIcon" size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">Tip for Mangaluru</p>
                      <p className="text-xs text-blue-700 mt-1">
                        Include city name "Mangaluru" in your address for better accuracy.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <input
                    type="text"
                    value={manualAddress}
                    onChange={(e) => setManualAddress(e.target.value)}
                    placeholder="Enter the full address where the issue is located"
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-civic bg-input text-foreground placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                  <Icon name="MapPinIcon" size={20} className="absolute left-3 top-3.5 text-text-secondary" />
                </div>
                <button
                  onClick={handleManualAddressSubmit}
                  disabled={!manualAddress.trim() || isDetecting}
                  className="mt-2 w-full bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-text-secondary text-primary-foreground py-2 rounded-civic text-sm font-medium civic-transition"
                >
                  {isDetecting ? 'Processing...' : 'Confirm Address'}
                </button>
              </div>
            )}
            
            {(locationMethod === 'manual' || locationMethod === 'coordinates') && (
              <div className="relative flex items-center">
                <div className="flex-grow border-t border-border"></div>
                <span className="flex-shrink mx-4 text-text-secondary text-sm">OR</span>
                <div className="flex-grow border-t border-border"></div>
              </div>
            )}
            
            {/* Coordinates Input */}
            {locationMethod === 'coordinates' && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Enter Coordinates
                </label>
                
                {/* Helpful tip for Mangaluru */}
                <div className="bg-blue-50 border border-blue-200 rounded-civic p-3 mb-4">
                  <div className="flex items-start space-x-2">
                    <Icon name="InformationCircleIcon" size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">Tip for Mangaluru</p>
                      <p className="text-xs text-blue-700 mt-1">
                        Mangaluru coordinates are typically around:<br />
                        <strong>Latitude:</strong> 12.9141 &nbsp; <strong>Longitude:</strong> 74.8560
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-text-secondary mb-1">Latitude</label>
                    <input
                      type="text"
                      value={manualCoordinates.lat}
                      onChange={(e) => setManualCoordinates(prev => ({ ...prev, lat: e.target.value }))}
                      placeholder="e.g., 12.9141"
                      className="w-full px-3 py-2 border border-border rounded-civic bg-input text-foreground placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-text-secondary mb-1">Longitude</label>
                    <input
                      type="text"
                      value={manualCoordinates.lng}
                      onChange={(e) => setManualCoordinates(prev => ({ ...prev, lng: e.target.value }))}
                      placeholder="e.g., 74.8560"
                      className="w-full px-3 py-2 border border-border rounded-civic bg-input text-foreground placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    />
                  </div>
                </div>
                <button
                  onClick={handleManualCoordinatesSubmit}
                  disabled={!manualCoordinates.lat.trim() || !manualCoordinates.lng.trim() || isDetecting}
                  className="mt-2 w-full bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-text-secondary text-primary-foreground py-2 rounded-civic text-sm font-medium civic-transition"
                >
                  {isDetecting ? 'Processing...' : 'Confirm Coordinates'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Current Location Display */}
      {currentLocation && (
        <div className="bg-card border border-border rounded-civic-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <h4 className="text-lg font-semibold text-foreground">Current Location</h4>
            <button
              onClick={clearLocation}
              className="text-text-secondary hover:text-foreground civic-transition"
            >
              <Icon name="XMarkIcon" size={20} />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Icon name="MapPinIcon" size={20} className="text-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-foreground font-medium">{currentLocation.address}</p>
                {currentLocation.neighborhood && (
                  <p className="text-sm text-text-secondary">
                    {currentLocation.neighborhood} • {currentLocation.ward}
                  </p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
              <div>
                <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">Coordinates</p>
                <p className="text-sm font-mono text-foreground">
                  {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
                </p>
              </div>
              <div>
                <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">Accuracy</p>
                <p className="text-sm text-foreground">±{Math.round(currentLocation.accuracy)}m</p>
              </div>
            </div>
            
            {/* Map Preview */}
            <div className="h-48 bg-muted rounded-civic overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                loading="lazy"
                title="Issue Location"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${currentLocation.latitude},${currentLocation.longitude}&z=16&output=embed`}
                className="border-0"
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Location Tips */}
      <div className="bg-primary/5 border border-primary/20 rounded-civic-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="InformationCircleIcon" size={20} className="text-primary mt-0.5" />
          <div>
            <h5 className="font-medium text-foreground mb-1">Location Accuracy Tips</h5>
            <ul className="text-sm text-text-secondary space-y-1">
              <li>• Enable location services for precise GPS coordinates</li>
              <li>• Stand near the actual issue location when detecting</li>
              <li>• Include nearby landmarks in manual address entries</li>
              <li>• Verify the map preview shows the correct location</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationSection;