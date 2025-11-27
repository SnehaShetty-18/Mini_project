'use client';

import React, { useState, useCallback } from 'react';
import Icon from '@/components/ui/AppIcon';
import { getMLClassifier } from '@/services/mlClassifier';
import { getGeocodingService } from '@/services/geocoding';

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
}

interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
  accuracy: number;
}

const SimplifiedReportForm = () => {
  const [step, setStep] = useState<'photo' | 'location' | 'severity' | 'summary'>('photo');
  const [image, setImage] = useState<UploadedImage | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isUsingCurrentLocation, setIsUsingCurrentLocation] = useState(false);
  const [manualAddress, setManualAddress] = useState('');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high'>('medium');
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [manualLocation, setManualLocation] = useState({ lat: '', lng: '' });
  const [modelStatus, setModelStatus] = useState<'loading' | 'ready' | 'not-available'>('loading');

  // Handle image selection
  const handleImageSelect = useCallback(async (file: File) => {
    const preview = URL.createObjectURL(file);
    const newImage = {
      id: `img_${Date.now()}`,
      file,
      preview
    };
    
    setImage(newImage);
    
    // Process image with ML
    setIsProcessing(true);
    try {
      console.log('🚀 Starting ML classification for image:', file.name);
      const mlClassifier = getMLClassifier();
      const analysis = await mlClassifier.classifyImage(file);
      console.log('✅ ML classification result:', analysis);
      setAiAnalysis(analysis);
      
      // Check if this is a simulated result
      if (analysis.isSimulated) {
        setModelStatus('not-available');
        console.warn('⚠️ Using simulated classification (ML model not available)');
      } else {
        setModelStatus('ready');
        console.log('✅ Using real ML classification');
      }
    } catch (error) {
      console.error('❌ Error analyzing image:', error);
      setModelStatus('not-available');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Handle file input change
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageSelect(e.target.files[0]);
    }
  }, [handleImageSelect]);

  // Capture photo from camera
  const captureFromCamera = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        handleImageSelect(target.files[0]);
      }
    };
    input.click();
  }, [handleImageSelect]);

  // Get current location
  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsUsingCurrentLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const geocodingService = getGeocodingService();
          const geocodingResult = await geocodingService.reverseGeocode(
            position.coords.latitude,
            position.coords.longitude
          );
          
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            address: geocodingResult.address,
            accuracy: position.coords.accuracy
          });
          
          setStep('severity');
        } catch (error) {
          console.error('Geocoding failed:', error);
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            address: `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`,
            accuracy: position.coords.accuracy
          });
          
          setStep('severity');
        }
      },
      (error) => {
        setIsUsingCurrentLocation(false);
        alert('Unable to retrieve your location. Please enter manually.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  }, []);

  // Handle manual location submission
  const handleManualLocationSubmit = useCallback(async () => {
    if (!manualAddress.trim() && (!manualLocation.lat || !manualLocation.lng)) {
      alert('Please enter an address or coordinates');
      return;
    }

    setIsProcessing(true);
    
    try {
      let lat = parseFloat(manualLocation.lat);
      let lng = parseFloat(manualLocation.lng);
      
      // If we have an address but no coordinates, geocode it
      if (manualAddress.trim() && (!lat || !lng)) {
        const geocodingService = getGeocodingService();
        const coordinates = await geocodingService.geocode(manualAddress);
        
        if (coordinates) {
          lat = coordinates.latitude;
          lng = coordinates.longitude;
        } else {
          throw new Error('Could not geocode address');
        }
      }
      
      // Get address from coordinates if we don't have one
      let address = manualAddress;
      if (!address && lat && lng) {
        const geocodingService = getGeocodingService();
        const geocodingResult = await geocodingService.reverseGeocode(lat, lng);
        address = geocodingResult.address;
      }
      
      setLocation({
        latitude: lat,
        longitude: lng,
        address: address || `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        accuracy: 10 // Manual accuracy
      });
      
      setStep('severity');
    } catch (error) {
      console.error('Error processing location:', error);
      alert('Error processing location. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [manualAddress, manualLocation]);

  // Submit report
  const handleSubmit = useCallback(async () => {
    if (!image || !location) {
      alert('Please complete all steps');
      return;
    }

    setIsProcessing(true);
    
    try {
      // In a real app, you would send this data to your backend
      const reportData = {
        image: image.preview,
        location: location,
        severity: severity,
        aiAnalysis: aiAnalysis,
        timestamp: new Date().toISOString()
      };
      
      console.log('Report submitted:', reportData);
      
      // Show success message
      alert('Report submitted successfully!');
      
      // Reset form
      setImage(null);
      setLocation(null);
      setSeverity('medium');
      setAiAnalysis(null);
      setManualAddress('');
      setManualLocation({ lat: '', lng: '' });
      setStep('photo');
      setModelStatus('loading');
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Error submitting report. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [image, location, severity, aiAnalysis]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-card border border-border rounded-civic-lg p-6">
        <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
          Report Civic Issue
        </h2>
        
        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-8">
          <div className={`flex flex-col items-center ${step === 'photo' ? 'text-primary' : 'text-text-secondary'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
              step === 'photo' ? 'bg-primary text-primary-foreground' : 'bg-muted'
            }`}>
              1
            </div>
            <span className="text-sm">Photo</span>
          </div>
          
          <div className={`flex-1 h-1 mx-2 ${step !== 'photo' ? 'bg-primary' : 'bg-border'}`}></div>
          
          <div className={`flex flex-col items-center ${step === 'location' ? 'text-primary' : 'text-text-secondary'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
              step === 'location' ? 'bg-primary text-primary-foreground' : 'bg-muted'
            }`}>
              2
            </div>
            <span className="text-sm">Location</span>
          </div>
          
          <div className={`flex-1 h-1 mx-2 ${step === 'severity' || step === 'summary' ? 'bg-primary' : 'bg-border'}`}></div>
          
          <div className={`flex flex-col items-center ${step === 'severity' ? 'text-primary' : 'text-text-secondary'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
              step === 'severity' ? 'bg-primary text-primary-foreground' : 'bg-muted'
            }`}>
              3
            </div>
            <span className="text-sm">Severity</span>
          </div>
          
          <div className={`flex-1 h-1 mx-2 ${step === 'summary' ? 'bg-primary' : 'bg-border'}`}></div>
          
          <div className={`flex flex-col items-center ${step === 'summary' ? 'text-primary' : 'text-text-secondary'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
              step === 'summary' ? 'bg-primary text-primary-foreground' : 'bg-muted'
            }`}>
              4
            </div>
            <span className="text-sm">Summary</span>
          </div>
        </div>
        
        {/* Step 1: Photo */}
        {step === 'photo' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-foreground">Upload Issue Photo</h3>
            
            {image ? (
              <div className="space-y-4">
                <div className="relative">
                  <img 
                    src={image.preview} 
                    alt="Issue" 
                    className="w-full h-64 object-cover rounded-civic border border-border"
                  />
                  <button
                    onClick={() => setImage(null)}
                    className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-2 hover:bg-destructive/90"
                  >
                    <Icon name="XMarkIcon" size={16} />
                  </button>
                </div>
                
                {isProcessing ? (
                  <div className="flex items-center justify-center space-x-2 text-foreground">
                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <span>Analyzing image...</span>
                  </div>
                ) : (
                  <div className="bg-primary/5 border border-primary/20 rounded-civic p-4">
                    <h4 className="font-medium text-foreground mb-2">AI Analysis</h4>
                    {aiAnalysis ? (
                      <div className="space-y-1 text-sm">
                        <p><span className="font-medium">Category:</span> {aiAnalysis.category}</p>
                        <p><span className="font-medium">Confidence:</span> {aiAnalysis.confidence}%</p>
                        {aiAnalysis.isSimulated && (
                          <p className="text-xs text-warning mt-2">
                            <Icon name="ExclamationTriangleIcon" size={14} className="inline mr-1" />
                            Using demo classification
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-text-secondary">No analysis available</p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="border-2 border-dashed border-border rounded-civic-lg p-8 text-center">
                <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
                  <Icon name="PhotoIcon" size={32} className="text-text-secondary" />
                </div>
                <p className="text-text-secondary mb-4">
                  Take a photo or upload an image of the civic issue
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <label className="inline-flex items-center space-x-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-civic font-medium civic-transition cursor-pointer">
                    <Icon name="FolderOpenIcon" size={20} />
                    <span>Choose File</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                  
                  <button
                    type="button"
                    onClick={captureFromCamera}
                    className="inline-flex items-center space-x-2 bg-accent hover:bg-accent/90 text-accent-foreground px-6 py-3 rounded-civic font-medium civic-transition"
                  >
                    <Icon name="CameraIcon" size={20} />
                    <span>Take Photo</span>
                  </button>
                </div>
              </div>
            )}
            
            {image && (
              <button
                onClick={() => setStep('location')}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-civic font-medium civic-transition"
              >
                Continue to Location
              </button>
            )}
          </div>
        )}
        
        {/* Step 2: Location */}
        {step === 'location' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-foreground">Set Issue Location</h3>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setIsUsingCurrentLocation(!isUsingCurrentLocation)}
                className={`flex-1 py-3 rounded-civic font-medium civic-transition ${
                  isUsingCurrentLocation 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
              >
                <Icon name="MapPinIcon" size={20} className="inline mr-2" />
                Use Current Location
              </button>
              
              <button
                onClick={() => setIsUsingCurrentLocation(false)}
                className={`flex-1 py-3 rounded-civic font-medium civic-transition ${
                  !isUsingCurrentLocation 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
              >
                <Icon name="PencilIcon" size={20} className="inline mr-2" />
                Enter Manually
              </button>
            </div>
            
            {isUsingCurrentLocation ? (
              <div className="text-center space-y-4">
                {location ? (
                  <div className="bg-success/10 border border-success/20 rounded-civic p-4">
                    <div className="flex items-center space-x-2 text-success mb-2">
                      <Icon name="CheckCircleIcon" size={20} />
                      <span className="font-medium">Location Detected</span>
                    </div>
                    <p className="text-foreground">{location.address}</p>
                    <p className="text-sm text-text-secondary">
                      Accuracy: ±{Math.round(location.accuracy)}m
                    </p>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={getCurrentLocation}
                      disabled={isProcessing}
                      className="inline-flex items-center space-x-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-civic font-medium civic-transition"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                          <span>Detecting Location...</span>
                        </>
                      ) : (
                        <>
                          <Icon name="MapPinIcon" size={20} />
                          <span>Detect My Location</span>
                        </>
                      )}
                    </button>
                    <p className="text-sm text-text-secondary">
                      Your browser will ask for permission to access your location
                    </p>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={manualAddress}
                    onChange={(e) => setManualAddress(e.target.value)}
                    placeholder="Enter the full address"
                    className="w-full px-4 py-3 border border-border rounded-civic bg-input text-foreground placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Latitude
                    </label>
                    <input
                      type="text"
                      value={manualLocation.lat}
                      onChange={(e) => setManualLocation({...manualLocation, lat: e.target.value})}
                      placeholder="40.7128"
                      className="w-full px-4 py-3 border border-border rounded-civic bg-input text-foreground placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Longitude
                    </label>
                    <input
                      type="text"
                      value={manualLocation.lng}
                      onChange={(e) => setManualLocation({...manualLocation, lng: e.target.value})}
                      placeholder="-74.0060"
                      className="w-full px-4 py-3 border border-border rounded-civic bg-input text-foreground placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    />
                  </div>
                </div>
                
                <button
                  onClick={handleManualLocationSubmit}
                  disabled={isProcessing}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-civic font-medium civic-transition"
                >
                  {isProcessing ? 'Processing...' : 'Set Location'}
                </button>
              </div>
            )}
            
            {location && (
              <div className="flex space-x-3">
                <button
                  onClick={() => setStep('photo')}
                  className="flex-1 bg-muted text-foreground py-3 rounded-civic font-medium civic-transition hover:bg-muted/80"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep('severity')}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-civic font-medium civic-transition"
                >
                  Continue to Severity
                </button>
              </div>
            )}
          </div>
        )}
        
        {/* Step 3: Severity */}
        {step === 'severity' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-foreground">Set Issue Severity</h3>
            
            <div className="space-y-3">
              <button
                onClick={() => setSeverity('low')}
                className={`w-full text-left p-4 rounded-civic border civic-transition ${
                  severity === 'low' 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/30'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                    severity === 'low' ? 'border-primary bg-primary' : 'border-border'
                  }`}>
                    {severity === 'low' && <Icon name="CheckIcon" size={12} className="text-primary-foreground" />}
                  </div>
                  <div>
                    <div className="font-medium text-foreground">Low Severity</div>
                    <div className="text-sm text-text-secondary">Minor issue, can be addressed in normal timeframe</div>
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => setSeverity('medium')}
                className={`w-full text-left p-4 rounded-civic border civic-transition ${
                  severity === 'medium' 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/30'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                    severity === 'medium' ? 'border-primary bg-primary' : 'border-border'
                  }`}>
                    {severity === 'medium' && <Icon name="CheckIcon" size={12} className="text-primary-foreground" />}
                  </div>
                  <div>
                    <div className="font-medium text-foreground">Medium Severity</div>
                    <div className="text-sm text-text-secondary">Moderate issue, should be addressed within a week</div>
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => setSeverity('high')}
                className={`w-full text-left p-4 rounded-civic border civic-transition ${
                  severity === 'high' 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/30'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                    severity === 'high' ? 'border-primary bg-primary' : 'border-border'
                  }`}>
                    {severity === 'high' && <Icon name="CheckIcon" size={12} className="text-primary-foreground" />}
                  </div>
                  <div>
                    <div className="font-medium text-foreground">High Severity</div>
                    <div className="text-sm text-text-secondary">Urgent issue, requires immediate attention</div>
                  </div>
                </div>
              </button>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setStep('location')}
                className="flex-1 bg-muted text-foreground py-3 rounded-civic font-medium civic-transition hover:bg-muted/80"
              >
                Back
              </button>
              <button
                onClick={() => setStep('summary')}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-civic font-medium civic-transition"
              >
                Continue to Summary
              </button>
            </div>
          </div>
        )}
        
        {/* Step 4: Summary */}
        {step === 'summary' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-foreground">Report Summary</h3>
            
            <div className="space-y-6">
              {image && (
                <div>
                  <h4 className="font-medium text-foreground mb-2">Issue Photo</h4>
                  <img 
                    src={image.preview} 
                    alt="Issue" 
                    className="w-full h-48 object-cover rounded-civic border border-border"
                  />
                </div>
              )}
              
              {aiAnalysis && (
                <div className="bg-primary/5 border border-primary/20 rounded-civic p-4">
                  <h4 className="font-medium text-foreground mb-2">Issue Classification</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Category:</span> {aiAnalysis.category}</p>
                    <p><span className="font-medium">Confidence:</span> {aiAnalysis.confidence}%</p>
                    {aiAnalysis.isSimulated && (
                      <p className="text-xs text-warning mt-2">
                        <Icon name="ExclamationTriangleIcon" size={14} className="inline mr-1" />
                        Using demo classification
                      </p>
                    )}
                  </div>
                </div>
              )}
              
              {location && (
                <div className="bg-primary/5 border border-primary/20 rounded-civic p-4">
                  <h4 className="font-medium text-foreground mb-2">Location</h4>
                  <p className="text-sm">{location.address}</p>
                  <p className="text-xs text-text-secondary mt-1">
                    Coordinates: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                  </p>
                </div>
              )}
              
              <div className="bg-primary/5 border border-primary/20 rounded-civic p-4">
                <h4 className="font-medium text-foreground mb-2">Issue Details</h4>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Severity:</span> 
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                      severity === 'low' ? 'bg-success/20 text-success' :
                      severity === 'medium' ? 'bg-warning/20 text-warning' :
                      'bg-destructive/20 text-destructive'
                    }`}>
                      {severity.charAt(0).toUpperCase() + severity.slice(1)}
                    </span>
                  </p>
                  <p><span className="font-medium">Date Reported:</span> {new Date().toLocaleDateString()}</p>
                  <p><span className="font-medium">Time Reported:</span> {new Date().toLocaleTimeString()}</p>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setStep('severity')}
                className="flex-1 bg-muted text-foreground py-3 rounded-civic font-medium civic-transition hover:bg-muted/80"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={isProcessing}
                className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground py-3 rounded-civic font-semibold civic-transition"
              >
                {isProcessing ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimplifiedReportForm;