'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import ImageUploadSection from './ImageUploadSection';
import VoiceRecordingSection from './VoiceRecordingSection';
import LocationSection from './LocationSection';
import IssueClassificationForm from './IssueClassificationForm';
import ReportSummary from './ReportSummary';
import { getIssuesDataService } from '@/services/issuesData';

interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
  accuracy: number;
  neighborhood?: string;
  ward?: string;
}

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  aiAnalysis?: {
    category: string;
    confidence: number;
    description: string;
    suggestedDepartment: string;
  };
}

interface IssueFormData {
  category: string;
  subcategory: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isAnonymous: boolean;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
}

const SmartReportingInteractive = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentTab, setCurrentTab] = useState('images');
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [transcription, setTranscription] = useState('');
  const [formData, setFormData] = useState<IssueFormData>({
    category: '',
    subcategory: '',
    title: '',
    description: '',
    priority: 'medium',
    isAnonymous: false,
    contactInfo: {
      name: '',
      email: '',
      phone: ''
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-64 bg-muted rounded-civic-lg"></div>
            <div className="h-32 bg-muted rounded-civic-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'images', name: 'Upload Images', icon: 'PhotoIcon', description: 'Add photos of the issue' },
    { id: 'voice', name: 'Voice Recording', icon: 'MicrophoneIcon', description: 'Record audio description' },
    { id: 'location', name: 'Location', icon: 'MapPinIcon', description: 'Set issue location' },
    { id: 'details', name: 'Issue Details', icon: 'DocumentTextIcon', description: 'Classify and describe' },
  ];

  const getAISuggestion = () => {
    if (images.length > 0 && images[0].aiAnalysis) {
      return images[0].aiAnalysis;
    }
    return undefined;
  };

  const canProceedToSummary = () => {
    return formData.category && formData.title && formData.description && location;
  };

  const handleSubmit = async () => {
    if (!canProceedToSummary()) return;
    
    setIsSubmitting(true);
    
    try {
      // Create issue in data service
      const issuesService = getIssuesDataService();
      const newIssue = await issuesService.addIssue({
        title: formData.title,
        category: formData.category,
        subcategory: formData.subcategory,
        status: 'submitted',
        priority: formData.priority,
        submittedDate: new Date(),
        estimatedCompletion: undefined, // Will be set by system
        department: getDepartmentFromCategory(formData.category),
        location: {
          address: location!.address,
          latitude: location!.latitude,
          longitude: location!.longitude,
          neighborhood: location?.neighborhood,
          ward: location?.ward
        },
        description: formData.description + (transcription ? `\n\nVoice Note: ${transcription}` : ''),
        images: images.map(img => img.preview),
        reporter: formData.isAnonymous ? {
          isAnonymous: true
        } : {
          name: formData.contactInfo.name,
          email: formData.contactInfo.email,
          phone: formData.contactInfo.phone,
          isAnonymous: false
        }
      });
      
      // Show success message
      alert(`Report submitted successfully! Your issue ID is ${newIssue.id}. You will receive a confirmation email shortly.`);
      
      // Reset form
      setImages([]);
      setLocation(null);
      setTranscription('');
      setFormData({
        category: '',
        subcategory: '',
        title: '',
        description: '',
        priority: 'medium',
        isAnonymous: false,
        contactInfo: { name: '', email: '', phone: '' }
      });
      setShowSummary(false);
      setCurrentTab('images');
    } catch (error) {
      console.error('Failed to submit report:', error);
      alert('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Helper function to map category to department
  const getDepartmentFromCategory = (category: string): string => {
    const departmentMap: Record<string, string> = {
      'Road Infrastructure': 'Public Works - Road Maintenance',
      'Street Lighting': 'Utilities - Street Lighting Division',
      'Waste Management': 'Sanitation Department',
      'Traffic Safety': 'Transportation & Safety',
      'Water & Drainage': 'Public Works - Water Division',
      'Parks & Recreation': 'Parks & Recreation Department'
    };
    return departmentMap[category] || 'General Services';
  };

  const getTabStatus = (tabId: string) => {
    switch (tabId) {
      case 'images':
        return images.length > 0 ? 'completed' : 'pending';
      case 'voice':
        return transcription ? 'completed' : 'pending';
      case 'location':
        return location ? 'completed' : 'pending';
      case 'details':
        return formData.category && formData.title ? 'completed' : 'pending';
      default:
        return 'pending';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Smart Reporting Center</h1>
          <p className="text-lg text-text-secondary">
            AI-powered civic issue reporting with intelligent classification and routing
          </p>
        </div>

        {!showSummary ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Navigation Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-civic-lg p-6 sticky top-24">
                <h3 className="text-lg font-semibold text-foreground mb-4">Report Steps</h3>
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const status = getTabStatus(tab.id);
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setCurrentTab(tab.id)}
                        className={`w-full flex items-center space-x-3 p-3 rounded-civic text-left civic-transition ${
                          currentTab === tab.id
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-muted text-foreground'
                        }`}
                      >
                        <div className="relative">
                          <Icon name={tab.icon as any} size={20} />
                          {status === 'completed' && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full flex items-center justify-center">
                              <Icon name="CheckIcon" size={8} className="text-success-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium">{tab.name}</div>
                          <div className={`text-xs ${
                            currentTab === tab.id ? 'text-primary-foreground/80' : 'text-text-secondary'
                          }`}>
                            {tab.description}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </nav>

                {/* Progress Summary */}
                <div className="mt-6 pt-6 border-t border-border">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">Images</span>
                      <span className="text-foreground">{images.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">Location</span>
                      <span className="text-foreground">{location ? '✓' : '—'}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">Voice Note</span>
                      <span className="text-foreground">{transcription ? '✓' : '—'}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">Category</span>
                      <span className="text-foreground">{formData.category ? '✓' : '—'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-card border border-border rounded-civic-lg p-6">
                {currentTab === 'images' && (
                  <ImageUploadSection
                    onImagesChange={setImages}
                    maxImages={5}
                  />
                )}

                {currentTab === 'voice' && (
                  <VoiceRecordingSection
                    onTranscriptionChange={setTranscription}
                  />
                )}

                {currentTab === 'location' && (
                  <LocationSection
                    onLocationChange={setLocation}
                    initialLocation={location}
                  />
                )}

                {currentTab === 'details' && (
                  <IssueClassificationForm
                    onFormChange={setFormData}
                    aiSuggestion={getAISuggestion()}
                  />
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center mt-6">
                <div className="text-sm text-text-secondary">
                  {canProceedToSummary() 
                    ? 'All required information collected'
                    : 'Please complete location and issue details to continue'
                  }
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowSummary(true)}
                    disabled={!canProceedToSummary()}
                    className="inline-flex items-center space-x-2 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-text-secondary text-primary-foreground px-6 py-3 rounded-civic font-medium civic-transition"
                  >
                    <Icon name="DocumentCheckIcon" size={20} />
                    <span>Review & Submit</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Summary View */
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Review Your Report</h2>
              <button
                onClick={() => setShowSummary(false)}
                className="text-text-secondary hover:text-foreground civic-transition"
              >
                <Icon name="PencilIcon" size={20} />
              </button>
            </div>

            <ReportSummary
              formData={formData}
              location={location}
              images={images}
              transcription={transcription}
            />

            <div className="flex justify-between items-center mt-8">
              <button
                onClick={() => setShowSummary(false)}
                className="inline-flex items-center space-x-2 border border-border text-foreground px-6 py-3 rounded-civic hover:bg-muted civic-transition"
              >
                <Icon name="ArrowLeftIcon" size={20} />
                <span>Back to Edit</span>
              </button>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="inline-flex items-center space-x-2 bg-accent hover:bg-accent/90 disabled:bg-muted disabled:text-text-secondary text-accent-foreground px-8 py-3 rounded-civic font-semibold civic-transition"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-accent-foreground border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Icon name="PaperAirplaneIcon" size={20} />
                    <span>Submit Report</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartReportingInteractive;