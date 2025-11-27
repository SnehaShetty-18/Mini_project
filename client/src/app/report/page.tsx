'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import UserGuard from '@/components/common/UserGuard';
import MainLayout from '@/components/common/MainLayout';
import StepIndicator from '@/components/report/StepIndicator';
import { complaintService } from '@/services/complaintService';
import { getMLClassifier } from '@/services/mlClassifier';
import { getGeminiService } from '@/services/gemini';
import { reverseGeocode } from '@/services/geocoding';
import Icon from '@/components/ui/AppIcon';

export default function ReportIssuePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    issue_type: 'pothole',
    severity_level: 'medium',
    location_text: '',
    place_name: '',
    district: '',
    state: '',
    country: '',
    latitude: '',
    longitude: '',
    image: null as File | null
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [mlClassification, setMlClassification] = useState<any>(null);
  const [geminiReport, setGeminiReport] = useState<string>('');
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  const steps = [
    { id: 1, title: 'Upload Image', description: 'Take or upload a photo' },
    { id: 2, title: 'Location', description: 'Set issue location' },
    { id: 3, title: 'Severity', description: 'Set issue severity' },
    { id: 4, title: 'Review', description: 'Review and submit' }
  ];

  const severityLevels = [
    { value: 'low', label: 'Low', color: 'bg-green-200 text-green-800' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-200 text-yellow-800' },
    { value: 'high', label: 'High', color: 'bg-red-200 text-red-800' }
  ];

  // Format location text from individual fields
  const formatLocationText = (place_name: string, district: string, state: string, country: string) => {
    // Create a more comprehensive location text
    const parts = [place_name, district, state, country].filter(Boolean);
    
    // If we don't have enough meaningful parts, fall back to using what we have
    if (parts.length === 0) {
      return 'Location';
    }
    
    return parts.join(', ');
  };

  // Validate if the location seems reasonable
  const isLocationReasonable = (locationData: any, userLat: number, userLng: number) => {
    // If we only have coordinate-based location, it's not very useful
    if (locationData.address?.includes('Location at')) {
      return false;
    }
    
    // Check if we have at least some meaningful location data
    const hasMeaningfulData = locationData.city || 
                             locationData.state || 
                             locationData.country || 
                             locationData.district ||
                             locationData.neighborhood ||
                             locationData.ward;
    
    // Even if we don't have all the data, if we have a formatted address that's not just coordinates, it's reasonable
    if (locationData.address && !locationData.address.includes('Location at')) {
      return true;
    }
    
    return !!hasMeaningfulData;
  };

  // Handle image upload and ML classification
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      // Clear error
      if (errors.image) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.image;
          return newErrors;
        });
      }
      
      // Process image with ML classifier
      setIsProcessingImage(true);
      try {
        const mlClassifier = getMLClassifier();
        const classification = await mlClassifier.classifyImage(file);
        
        setMlClassification(classification);
        
        // Auto-fill issue type based on ML classification
        const mappedIssueType = classification.category.toLowerCase().replace(' ', '_');
        const validIssueType = mappedIssueType;
        
        setFormData(prev => ({
          ...prev,
          issue_type: validIssueType,
          severity_level: classification.severity
        }));
        
        // Generate Gemini report
        try {
          const geminiService = getGeminiService();
          const report = await geminiService.generateReportFromMLClassification({
            mlClassification: classification,
            imageFile: file
          });
          
          setGeminiReport(report.detailedDescription);
          
          setFormData(prev => ({
            ...prev,
            title: report.title,
            description: report.detailedDescription
          }));
        } catch (error) {
          console.error('Gemini report generation failed:', error);
        }
      } catch (error) {
        console.error('ML classification failed:', error);
        setErrors({
          image: 'Failed to process image. Please try again.'
        });
      } finally {
        setIsProcessingImage(false);
      }
    }
  };

  const handleLocationClick = async () => {
    if (navigator.geolocation) {
      setIsFetchingLocation(true);
      // Use high accuracy settings for better location detection
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          
          // Store raw coordinates
          setFormData(prev => ({
            ...prev,
            latitude: latitude.toString(),
            longitude: longitude.toString()
          }));
          
          try {
            // Reverse geocode to get place name, district, state, country
            const locationData = await reverseGeocode(latitude, longitude);
            
            // Extract location components with better fallbacks
            const placeName = locationData.place_name || 
                             locationData.neighborhood || 
                             locationData.city || 
                             '';
            
            // For district, try multiple sources
            const district = locationData.district || 
                            locationData.ward || 
                            locationData.city ||
                            '';
            
            const state = locationData.state || '';
            const country = locationData.country || '';
            
            // Create a more comprehensive location text that includes coordinates
            const locationText = `${formatLocationText(placeName, district, state, country)} (${latitude.toFixed(6)}, ${longitude.toFixed(6)})`;
            
            setFormData(prev => ({
              ...prev,
              place_name: placeName,
              district: district,
              state: state,
              country: country,
              location_text: locationText
            }));
          } catch (error) {
            console.error('Reverse geocoding failed:', error);
            const locationText = `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`;
            setFormData(prev => ({
              ...prev,
              location_text: locationText
            }));
          }
          
          setIsFetchingLocation(false);
        },
        async (error) => {
          // Browser geolocation failed, try IP geolocation as fallback
          console.log('Browser geolocation failed, trying IP geolocation...');
          try {
            const response = await fetch('https://ipapi.co/json/');
            if (response.ok) {
              const data = await response.json();
              if (data.latitude && data.longitude) {
                const { latitude, longitude } = data;
                
                // Store coordinates
                setFormData(prev => ({
                  ...prev,
                  latitude: latitude.toString(),
                  longitude: longitude.toString()
                }));
                
                try {
                  // Reverse geocode to get place name, district, state, country
                  const locationData = await reverseGeocode(latitude, longitude);
                  
                  // Extract location components
                  const placeName = locationData.place_name || 
                                   locationData.neighborhood || 
                                   locationData.city || 
                                   '';
                  
                  const district = locationData.district || 
                                  locationData.ward || 
                                  locationData.city ||
                                  '';
                  
                  const state = locationData.state || '';
                  const country = locationData.country || '';
                  
                  // Create location text
                  const locationText = `${formatLocationText(placeName, district, state, country)} (${latitude.toFixed(6)}, ${longitude.toFixed(6)})`;
                  
                  setFormData(prev => ({
                    ...prev,
                    place_name: placeName,
                    district: district,
                    state: state,
                    country: country,
                    location_text: locationText
                  }));
                } catch (geoError) {
                  console.error('Reverse geocoding failed:', geoError);
                  const locationText = `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`;
                  setFormData(prev => ({
                    ...prev,
                    location_text: locationText
                  }));
                }
              } else {
                throw new Error('IP geolocation did not return coordinates');
              }
            } else {
              throw new Error('IP geolocation service unavailable');
            }
          } catch (ipError) {
            console.error('IP geolocation failed:', ipError);
          }
          
          setIsFetchingLocation(false);
          // Provide specific guidance for manual entry without warnings
          alert('For best results, please enter your location manually.\n\n' +
                'Mangaluru coordinates: 12.9141° N, 74.8560° E');
        },
        {
          enableHighAccuracy: true,      // Use GPS and other high accuracy sources
          timeout: 20000,               // Increase timeout to 20 seconds
          maximumAge: 0                 // Don't use cached positions
        }
      );
    } else {
      // Browser doesn't support geolocation, try IP geolocation
      setIsFetchingLocation(true);
      try {
        const response = await fetch('https://ipapi.co/json/');
        if (response.ok) {
          const data = await response.json();
          if (data.latitude && data.longitude) {
            const { latitude, longitude } = data;
            
            // Store coordinates
            setFormData(prev => ({
              ...prev,
              latitude: latitude.toString(),
              longitude: longitude.toString()
            }));
            
            try {
              // Reverse geocode to get place name, district, state, country
              const locationData = await reverseGeocode(latitude, longitude);
              
              // Extract location components
              const placeName = locationData.place_name || 
                               locationData.neighborhood || 
                               locationData.city || 
                               '';
              
              const district = locationData.district || 
                              locationData.ward || 
                              locationData.city ||
                              '';
              
              const state = locationData.state || '';
              const country = locationData.country || '';
              
              // Create location text
              const locationText = `${formatLocationText(placeName, district, state, country)} (${latitude.toFixed(6)}, ${longitude.toFixed(6)})`;
              
              setFormData(prev => ({
                ...prev,
                place_name: placeName,
                district: district,
                state: state,
                country: country,
                location_text: locationText
              }));
            } catch (error) {
              console.error('Reverse geocoding failed:', error);
              const locationText = `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`;
              setFormData(prev => ({
                ...prev,
                location_text: locationText
              }));
            }
          }
        }
      } catch (error) {
        console.error('IP geolocation failed:', error);
      }
      
      setIsFetchingLocation(false);
      // Provide specific guidance for manual entry
      alert('Geolocation not available. Please enter your location manually.\n\n' +
            'Mangaluru coordinates: 12.9141° N, 74.8560° E');
    }
  };

  const handleNext = () => {
    if (currentStep === 1 && !formData.image) {
      setErrors({
        image: 'Image is required'
      });
      return;
    }
    
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updatedData = {
        ...prev,
        [name]: value
      };
      
      // Update location_text when any location field changes
      if (['place_name', 'district', 'state', 'country'].includes(name)) {
        updatedData.location_text = formatLocationText(
          name === 'place_name' ? value : updatedData.place_name,
          name === 'district' ? value : updatedData.district,
          name === 'state' ? value : updatedData.state,
          name === 'country' ? value : updatedData.country
        );
        
        // Add coordinates if available
        if (updatedData.latitude || updatedData.longitude) {
          updatedData.location_text += ` (${updatedData.latitude || 'N/A'}, ${updatedData.longitude || 'N/A'})`;
        }
      }
      
      // Update location_text when latitude or longitude changes
      if (['latitude', 'longitude'].includes(name)) {
        // Rebuild location text with all components
        const baseLocation = formatLocationText(
          updatedData.place_name,
          updatedData.district,
          updatedData.state,
          updatedData.country
        );
        
        updatedData.location_text = baseLocation;
        
        // Add coordinates if available
        if (updatedData.latitude || updatedData.longitude) {
          updatedData.location_text += ` (${updatedData.latitude || 'N/A'}, ${updatedData.longitude || 'N/A'})`;
        }
      }
      
      return updatedData;
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate current step
    if (currentStep === 1 && !formData.image) {
      setErrors({
        image: 'Image is required'
      });
      return;
    }
    
    if (currentStep === 2 && !formData.location_text.trim()) {
      setErrors({
        location_text: 'Location is required'
      });
      return;
    }
    
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      return;
    }
    
    // Final validation
    if (!formData.title.trim()) {
      setErrors({
        title: 'Title is required'
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description || geminiReport);
      formDataToSend.append('issue_type', formData.issue_type);
      formDataToSend.append('severity_level', formData.severity_level);
      formDataToSend.append('latitude', formData.latitude);
      formDataToSend.append('longitude', formData.longitude);
      formDataToSend.append('address', formData.location_text);
      // Add place components for better location handling
      formDataToSend.append('place_name', formData.place_name);
      formDataToSend.append('district', formData.district);
      formDataToSend.append('state', formData.state);
      formDataToSend.append('country', formData.country);
      // Always append image field, even if null
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      } else {
        // Append empty string if no image
        formDataToSend.append('image', '');
      }
      
      await complaintService.create(formDataToSend);
      
      // Redirect to my complaints page
      router.push('/my-complaints');
    } catch (error: any) {
      setErrors({
        form: error.response?.data?.message || 'Failed to submit complaint. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Upload Image
              </label>
              <div className="flex items-start gap-6">
                <div className="flex-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-full px-4 py-3 border-2 border-dashed rounded-civic text-center cursor-pointer transition ${
                      errors.image 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-border hover:border-primary hover:bg-muted'
                    }`}
                    disabled={isProcessingImage}
                  >
                    {isProcessingImage ? (
                      <>
                        <Icon name="ArrowPathIcon" size={24} className="mx-auto text-gray-400 mb-2 animate-spin" />
                        <p className="text-sm text-foreground">
                          Processing image...
                        </p>
                      </>
                    ) : (
                      <>
                        <Icon name="CameraIcon" size={24} className="mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-foreground">
                          {formData.image ? 'Change Image' : 'Take or upload photo'}
                        </p>
                        <p className="text-xs text-text-secondary mt-1">
                          PNG, JPG up to 5MB
                        </p>
                      </>
                    )}
                  </button>
                  {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
                </div>
                
                {previewUrl && (
                  <div className="w-24 h-24 rounded-civic overflow-hidden border border-border">
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
              
              {mlClassification && (
                <div className="mt-4 p-4 bg-muted rounded-civic">
                  <h3 className="text-sm font-medium text-foreground mb-2">AI Analysis</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-text-secondary">Category</p>
                      <p className="font-medium">{mlClassification.category}</p>
                    </div>
                    <div>
                      <p className="text-text-secondary">Confidence</p>
                      <p className="font-medium">{mlClassification.confidence}%</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Location Details
              </label>
              <div className="space-y-4">
                <div>
                  <label htmlFor="place_name" className="block text-sm text-text-secondary mb-1">
                    Place Name
                  </label>
                  <input
                    id="place_name"
                    name="place_name"
                    type="text"
                    value={formData.place_name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-civic focus:ring-2 focus:ring-primary focus:border-primary outline-none transition ${
                      errors.place_name ? 'border-red-500' : 'border-border'
                    }`}
                    placeholder="Enter place name"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="district" className="block text-sm text-text-secondary mb-1">
                      District
                    </label>
                    <input
                      id="district"
                      name="district"
                      type="text"
                      value={formData.district}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-civic focus:ring-2 focus:ring-primary focus:border-primary outline-none transition ${
                        errors.district ? 'border-red-500' : 'border-border'
                      }`}
                      placeholder="Enter district"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="state" className="block text-sm text-text-secondary mb-1">
                      State
                    </label>
                    <input
                      id="state"
                      name="state"
                      type="text"
                      value={formData.state}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-civic focus:ring-2 focus:ring-primary focus:border-primary outline-none transition ${
                        errors.state ? 'border-red-500' : 'border-border'
                      }`}
                      placeholder="Enter state"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="country" className="block text-sm text-text-secondary mb-1">
                    Country
                  </label>
                  <input
                    id="country"
                    name="country"
                    type="text"
                    value={formData.country}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-civic focus:ring-2 focus:ring-primary focus:border-primary outline-none transition ${
                      errors.country ? 'border-red-500' : 'border-border'
                    }`}
                    placeholder="Enter country"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="latitude" className="block text-sm text-text-secondary mb-1">
                      Latitude
                    </label>
                    <input
                      id="latitude"
                      name="latitude"
                      type="text"
                      value={formData.latitude}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-civic focus:ring-2 focus:ring-primary focus:border-primary outline-none transition ${
                        errors.latitude ? 'border-red-500' : 'border-border'
                      }`}
                      placeholder="Enter latitude"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="longitude" className="block text-sm text-text-secondary mb-1">
                      Longitude
                    </label>
                    <input
                      id="longitude"
                      name="longitude"
                      type="text"
                      value={formData.longitude}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-civic focus:ring-2 focus:ring-primary focus:border-primary outline-none transition ${
                        errors.longitude ? 'border-red-500' : 'border-border'
                      }`}
                      placeholder="Enter longitude"
                    />
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={handleLocationClick}
                  disabled={isFetchingLocation}
                  className="w-full px-4 py-3 bg-muted hover:bg-muted/80 text-foreground rounded-civic font-medium civic-transition flex items-center justify-center"
                >
                  {isFetchingLocation ? (
                    <>
                      <Icon name="ArrowPathIcon" size={16} className="animate-spin mr-2" />
                      Fetching Location...
                    </>
                  ) : (
                    <>
                      <Icon name="MapPinIcon" size={16} className="mr-2" />
                      Fetch My Location
                    </>
                  )}
                </button>
              </div>
              
              {/* Hidden field to store combined location text */}
              <input
                type="hidden"
                name="location_text"
                value={formData.location_text}
              />
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="severity_level" className="block text-sm font-medium text-foreground mb-1">
                Severity Level
              </label>
              <div className="grid grid-cols-3 gap-4">
                {severityLevels.map((level) => (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, severity_level: level.value }))}
                    className={`p-4 rounded-civic border text-center transition ${
                      formData.severity_level === level.value
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary hover:bg-muted'
                    }`}
                  >
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${level.color}`}>
                      {level.label}
                    </span>
                    <p className="text-xs text-text-secondary mt-2">
                      {level.value === 'low' && 'Minor issue, no immediate action needed'}
                      {level.value === 'medium' && 'Moderate issue, should be addressed soon'}
                      {level.value === 'high' && 'Serious issue, requires immediate attention'}
                    </p>
                  </button>
                ))}
              </div>
            </div>
            
            {mlClassification && (
              <div className="bg-muted rounded-civic p-4">
                <h3 className="font-medium text-foreground mb-2">AI Analysis</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-text-secondary">Category</p>
                    <p className="font-medium">{mlClassification.category}</p>
                  </div>
                  <div>
                    <p className="text-text-secondary">Confidence</p>
                    <p className="font-medium">{mlClassification.confidence}%</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-foreground mb-1">
                Issue Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-civic focus:ring-2 focus:ring-primary focus:border-primary outline-none transition ${
                  errors.title ? 'border-red-500' : 'border-border'
                }`}
                placeholder="Briefly describe the issue"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-foreground mb-1">
                Detailed Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description || geminiReport}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-civic focus:ring-2 focus:ring-primary focus:border-primary outline-none transition ${
                  errors.description ? 'border-red-500' : 'border-border'
                }`}
                placeholder="Provide more details about the issue, when you noticed it, etc."
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>
            
            {previewUrl && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Image Preview
                </label>
                <div className="w-full h-48 rounded-civic overflow-hidden border border-border">
                  <img 
                    src={previewUrl} 
                    alt="Issue" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
            
            <div className="bg-muted rounded-civic p-4">
              <h3 className="font-medium text-foreground mb-2">Summary</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-text-secondary">Issue Type</p>
                  <p className="font-medium capitalize">{formData.issue_type.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-text-secondary">Severity</p>
                  <p className="font-medium capitalize">{formData.severity_level}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-text-secondary">Location</p>
                  <p className="font-medium">
                    {formData.place_name && `${formData.place_name}, `}
                    {formData.district && `${formData.district}, `}
                    {formData.state && `${formData.state}, `}
                    {formData.country}
                    {(formData.latitude || formData.longitude) && ` (${formData.latitude || 'N/A'}, ${formData.longitude || 'N/A'})`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <UserGuard>
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-foreground">Report New Issue</h1>
              <p className="text-text-secondary">
                Help improve your community by reporting civic issues
              </p>
            </div>
            
            <StepIndicator currentStep={currentStep} steps={steps} />
            
            {errors.form && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-civic">
                {errors.form}
              </div>
            )}
            
            <div className="bg-card border border-border rounded-civic-xl p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {renderStepContent()}
                
                <div className="flex gap-4 pt-4">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={handlePrevious}
                      className="px-6 py-3 border border-border text-foreground hover:bg-muted rounded-civic font-medium civic-transition"
                    >
                      Back
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => router.back()}
                      className="px-6 py-3 border border-border text-foreground hover:bg-muted rounded-civic font-medium civic-transition"
                    >
                      Cancel
                    </button>
                  )}
                  
                  <button
                    type="submit"
                    disabled={isLoading || isProcessingImage || isFetchingLocation}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-civic font-semibold civic-transition civic-hover flex items-center justify-center"
                  >
                    {isLoading ? (
                      <>
                        <Icon name="ArrowPathIcon" size={16} className="animate-spin mr-2" />
                        Submitting...
                      </>
                    ) : isProcessingImage ? (
                      <>
                        <Icon name="ArrowPathIcon" size={16} className="animate-spin mr-2" />
                        Processing...
                      </>
                    ) : isFetchingLocation ? (
                      <>
                        <Icon name="ArrowPathIcon" size={16} className="animate-spin mr-2" />
                        Fetching...
                      </>
                    ) : currentStep < steps.length ? (
                      'Next'
                    ) : (
                      'Submit Report'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </MainLayout>
    </UserGuard>
  );
}