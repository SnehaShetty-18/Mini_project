import React from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

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

interface ReportSummaryProps {
  formData: IssueFormData;
  location: LocationData | null;
  images: UploadedImage[];
  transcription?: string;
}

const ReportSummary = ({ formData, location, images, transcription }: ReportSummaryProps) => {
  const issueCategories = {
    'road-infrastructure': { name: 'Road Infrastructure', icon: 'RoadIcon', department: 'Public Works - Road Maintenance' },
    'street-lighting': { name: 'Street Lighting', icon: 'LightBulbIcon', department: 'Utilities - Street Lighting Division' },
    'waste-management': { name: 'Waste Management', icon: 'TrashIcon', department: 'Sanitation - Waste Collection' },
    'traffic-safety': { name: 'Traffic Safety', icon: 'ExclamationTriangleIcon', department: 'Transportation - Traffic Management' },
    'water-drainage': { name: 'Water & Drainage', icon: 'BeakerIcon', department: 'Water Management - Infrastructure' },
    'parks-recreation': { name: 'Parks & Recreation', icon: 'TreePineIcon', department: 'Parks & Recreation Department' }
  };

  const selectedCategory = issueCategories[formData.category as keyof typeof issueCategories];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const generateReportId = () => {
    const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.random().toString(36).substr(2, 6).toUpperCase();
    return `RPT-${timestamp}-${random}`;
  };

  return (
    <div className="space-y-6">
      {/* Report Header */}
      <div className="bg-card border border-border rounded-civic-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-foreground">Report Summary</h3>
            <p className="text-text-secondary">Review your report before submission</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-text-secondary">Report ID</p>
            <p className="font-mono text-sm font-medium text-foreground">{generateReportId()}</p>
          </div>
        </div>

        {/* Issue Category & Priority */}
        <div className="flex items-center justify-between p-4 bg-muted rounded-civic">
          <div className="flex items-center space-x-3">
            {selectedCategory && (
              <>
                <div className="w-10 h-10 bg-primary/10 rounded-civic flex items-center justify-center">
                  <Icon name={selectedCategory.icon as any} size={20} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{selectedCategory.name}</h4>
                  {formData.subcategory && (
                    <p className="text-sm text-text-secondary">{formData.subcategory}</p>
                  )}
                </div>
              </>
            )}
          </div>
          <span className={`px-3 py-1 rounded-civic text-sm font-medium border ${getPriorityColor(formData.priority)}`}>
            {formData.priority.charAt(0).toUpperCase() + formData.priority.slice(1)} Priority
          </span>
        </div>
      </div>

      {/* Issue Details */}
      <div className="bg-card border border-border rounded-civic-lg p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4">Issue Details</h4>
        
        <div className="space-y-4">
          <div>
            <h5 className="text-sm font-medium text-foreground mb-1">Title</h5>
            <p className="text-foreground">{formData.title || 'No title provided'}</p>
          </div>
          
          <div>
            <h5 className="text-sm font-medium text-foreground mb-1">Description</h5>
            <p className="text-foreground leading-relaxed">{formData.description || 'No description provided'}</p>
          </div>

          {transcription && (
            <div>
              <h5 className="text-sm font-medium text-foreground mb-1">Voice Recording Transcription</h5>
              <div className="bg-muted rounded-civic p-3">
                <p className="text-foreground leading-relaxed">{transcription}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Location Information */}
      {location && (
        <div className="bg-card border border-border rounded-civic-lg p-6">
          <h4 className="text-lg font-semibold text-foreground mb-4">Location Information</h4>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Icon name="MapPinIcon" size={20} className="text-primary mt-0.5" />
              <div>
                <p className="text-foreground font-medium">{location.address}</p>
                {location.neighborhood && (
                  <p className="text-sm text-text-secondary">
                    {location.neighborhood} • {location.ward}
                  </p>
                )}
                <p className="text-xs text-text-secondary mt-1">
                  Coordinates: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)} (±{Math.round(location.accuracy)}m)
                </p>
              </div>
            </div>
            
            <div className="h-32 bg-muted rounded-civic overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                loading="lazy"
                title="Issue Location Preview"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${location.latitude},${location.longitude}&z=16&output=embed`}
                className="border-0"
              />
            </div>
          </div>
        </div>
      )}

      {/* Uploaded Images */}
      {images.length > 0 && (
        <div className="bg-card border border-border rounded-civic-lg p-6">
          <h4 className="text-lg font-semibold text-foreground mb-4">
            Attached Images ({images.length})
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((image) => (
              <div key={image.id} className="space-y-2">
                <div className="relative h-24 bg-muted rounded-civic overflow-hidden">
                  <AppImage
                    src={image.preview}
                    alt={`Issue evidence photo showing ${image.aiAnalysis?.description || 'civic problem'}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                {image.aiAnalysis && (
                  <div className="text-xs">
                    <p className="font-medium text-foreground">{image.aiAnalysis.category}</p>
                    <p className="text-text-secondary">{image.aiAnalysis.confidence}% confidence</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contact Information */}
      <div className="bg-card border border-border rounded-civic-lg p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4">Contact Information</h4>
        
        {formData.isAnonymous ? (
          <div className="flex items-center space-x-2 text-text-secondary">
            <Icon name="EyeSlashIcon" size={16} />
            <span>This report will be submitted anonymously</span>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Icon name="UserIcon" size={16} className="text-text-secondary" />
              <span className="text-foreground">{formData.contactInfo.name || 'Not provided'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="EnvelopeIcon" size={16} className="text-text-secondary" />
              <span className="text-foreground">{formData.contactInfo.email || 'Not provided'}</span>
            </div>
            {formData.contactInfo.phone && (
              <div className="flex items-center space-x-2">
                <Icon name="PhoneIcon" size={16} className="text-text-secondary" />
                <span className="text-foreground">{formData.contactInfo.phone}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Department Assignment */}
      {selectedCategory && (
        <div className="bg-primary/5 border border-primary/20 rounded-civic-lg p-6">
          <div className="flex items-start space-x-3">
            <Icon name="BuildingOfficeIcon" size={20} className="text-primary mt-0.5" />
            <div>
              <h4 className="font-semibold text-foreground mb-1">Assigned Department</h4>
              <p className="text-foreground">{selectedCategory.department}</p>
              <p className="text-sm text-text-secondary mt-2">
                Your report will be automatically routed to the appropriate department for review and action.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Submission Notice */}
      <div className="bg-accent/5 border border-accent/20 rounded-civic-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="InformationCircleIcon" size={20} className="text-accent mt-0.5" />
          <div>
            <h5 className="font-medium text-foreground mb-1">What happens next?</h5>
            <ul className="text-sm text-text-secondary space-y-1">
              <li>• Your report will be reviewed within 24 hours</li>
              <li>• You'll receive confirmation and tracking information</li>
              <li>• The assigned department will assess and prioritize the issue</li>
              <li>• You'll get regular updates on the resolution progress</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportSummary;