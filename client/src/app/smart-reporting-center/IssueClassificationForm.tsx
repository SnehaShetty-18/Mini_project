'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface IssueCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  department: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedResolution: string;
  subcategories: string[];
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

interface IssueClassificationFormProps {
  onFormChange: (data: IssueFormData) => void;
  aiSuggestion?: {
    category: string;
    description: string;
    suggestedDepartment: string;
  };
}

const IssueClassificationForm = ({ onFormChange, aiSuggestion }: IssueClassificationFormProps) => {
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

  const [currentStep, setCurrentStep] = useState(1);
  const [showContactForm, setShowContactForm] = useState(false);

  const issueCategories: IssueCategory[] = [
    {
      id: 'road-infrastructure',
      name: 'Road Infrastructure',
      icon: 'RoadIcon',
      description: 'Potholes, road damage, surface issues',
      department: 'Public Works - Road Maintenance',
      priority: 'high',
      estimatedResolution: '3-7 days',
      subcategories: ['Potholes', 'Cracks', 'Uneven Surface', 'Missing Manhole Cover', 'Road Markings']
    },
    {
      id: 'street-lighting',
      name: 'Street Lighting',
      icon: 'LightBulbIcon',
      description: 'Broken lights, dark areas, electrical issues',
      department: 'Utilities - Street Lighting Division',
      priority: 'medium',
      estimatedResolution: '1-3 days',
      subcategories: ['Broken Light', 'Flickering Light', 'Dark Area', 'Damaged Pole', 'Electrical Hazard']
    },
    {
      id: 'waste-management',
      name: 'Waste Management',
      icon: 'TrashIcon',
      description: 'Garbage collection, overflowing bins, illegal dumping',
      department: 'Sanitation - Waste Collection',
      priority: 'medium',
      estimatedResolution: '1-2 days',
      subcategories: ['Overflowing Bin', 'Missed Collection', 'Illegal Dumping', 'Damaged Bin', 'Recycling Issues']
    },
    {
      id: 'traffic-safety',
      name: 'Traffic Safety',
      icon: 'ExclamationTriangleIcon',
      description: 'Traffic signs, signals, pedestrian safety',
      department: 'Transportation - Traffic Management',
      priority: 'high',
      estimatedResolution: '2-5 days',
      subcategories: ['Damaged Sign', 'Broken Signal', 'Missing Sign', 'Crosswalk Issues', 'Speed Bump Needed']
    },
    {
      id: 'water-drainage',
      name: 'Water & Drainage',
      icon: 'BeakerIcon',
      description: 'Water leaks, drainage problems, flooding',
      department: 'Water Management - Infrastructure',
      priority: 'urgent',
      estimatedResolution: '4-8 hours',
      subcategories: ['Water Leak', 'Blocked Drain', 'Flooding', 'Broken Hydrant', 'Sewer Issues']
    },
    {
      id: 'parks-recreation',
      name: 'Parks & Recreation',
      icon: 'TreePineIcon',
      description: 'Park maintenance, playground equipment, landscaping',
      department: 'Parks & Recreation Department',
      priority: 'low',
      estimatedResolution: '5-10 days',
      subcategories: ['Damaged Equipment', 'Tree Issues', 'Landscaping', 'Vandalism', 'Maintenance Needed']
    }
  ];

  const priorityLevels = [
    { value: 'low', label: 'Low', color: 'text-blue-600', bg: 'bg-blue-50', description: 'Non-urgent, cosmetic issues' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-50', description: 'Standard maintenance required' },
    { value: 'high', label: 'High', color: 'text-orange-600', bg: 'bg-orange-50', description: 'Safety concern, needs attention' },
    { value: 'urgent', label: 'Urgent', color: 'text-red-600', bg: 'bg-red-50', description: 'Immediate safety hazard' }
  ];

  useEffect(() => {
    if (aiSuggestion) {
      const matchedCategory = issueCategories.find(cat => 
        cat.name.toLowerCase().includes(aiSuggestion.category.toLowerCase()) ||
        aiSuggestion.category.toLowerCase().includes(cat.name.toLowerCase())
      );
      
      if (matchedCategory) {
        setFormData(prev => ({
          ...prev,
          category: matchedCategory.id,
          description: aiSuggestion.description,
          priority: matchedCategory.priority
        }));
      }
    }
  }, [aiSuggestion]);

  useEffect(() => {
    onFormChange(formData);
  }, [formData, onFormChange]);

  const selectedCategory = issueCategories.find(cat => cat.id === formData.category);

  const handleCategorySelect = (categoryId: string) => {
    const category = issueCategories.find(cat => cat.id === categoryId);
    setFormData(prev => ({
      ...prev,
      category: categoryId,
      subcategory: '',
      priority: category?.priority || 'medium'
    }));
    setCurrentStep(2);
  };

  const handleInputChange = (field: keyof IssueFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleContactInfoChange = (field: keyof IssueFormData['contactInfo'], value: string) => {
    setFormData(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [field]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step <= currentStep 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-text-secondary'
            }`}>
              {step < currentStep ? (
                <Icon name="CheckIcon" size={16} />
              ) : (
                step
              )}
            </div>
            {step < 3 && (
              <div className={`w-16 h-0.5 mx-2 ${
                step < currentStep ? 'bg-primary' : 'bg-border'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Category Selection */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-bold text-foreground mb-2">Select Issue Category</h3>
            <p className="text-text-secondary">Choose the category that best describes your issue</p>
          </div>

          {aiSuggestion && (
            <div className="bg-accent/10 border border-accent/20 rounded-civic-lg p-4">
              <div className="flex items-start space-x-3">
                <Icon name="SparklesIcon" size={20} className="text-accent mt-0.5" />
                <div>
                  <h4 className="font-medium text-foreground mb-1">AI Suggestion</h4>
                  <p className="text-sm text-text-secondary mb-2">
                    Based on your uploaded images, we suggest: <strong>{aiSuggestion.category}</strong>
                  </p>
                  <p className="text-sm text-text-secondary">{aiSuggestion.description}</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {issueCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className={`p-6 border rounded-civic-lg text-left civic-transition hover:border-primary hover:bg-primary/5 ${
                  formData.category === category.id 
                    ? 'border-primary bg-primary/5' :'border-border bg-card'
                }`}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-civic flex items-center justify-center">
                    <Icon name={category.icon as any} size={20} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{category.name}</h4>
                    <span className={`text-xs px-2 py-1 rounded-civic ${
                      category.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                      category.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                      category.priority === 'medium'? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {category.priority}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-text-secondary mb-2">{category.description}</p>
                <div className="text-xs text-text-secondary">
                  <p>Dept: {category.department}</p>
                  <p>Est. Resolution: {category.estimatedResolution}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Details Form */}
      {currentStep === 2 && selectedCategory && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-foreground">Issue Details</h3>
              <p className="text-text-secondary">Category: {selectedCategory.name}</p>
            </div>
            <button
              onClick={() => setCurrentStep(1)}
              className="text-text-secondary hover:text-foreground civic-transition"
            >
              <Icon name="PencilIcon" size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              {/* Subcategory */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Subcategory
                </label>
                <select
                  value={formData.subcategory}
                  onChange={(e) => handleInputChange('subcategory', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-civic bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select subcategory</option>
                  {selectedCategory.subcategories.map((sub) => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Issue Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Brief, descriptive title for the issue"
                  className="w-full px-3 py-2 border border-border rounded-civic bg-input text-foreground placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Priority Level
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {priorityLevels.map((priority) => (
                    <button
                      key={priority.value}
                      type="button"
                      onClick={() => handleInputChange('priority', priority.value)}
                      className={`p-3 border rounded-civic text-left civic-transition ${
                        formData.priority === priority.value
                          ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className={`text-sm font-medium ${priority.color}`}>
                        {priority.label}
                      </div>
                      <div className="text-xs text-text-secondary">
                        {priority.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Detailed Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Provide a detailed description of the issue, including any relevant context or safety concerns..."
                  rows={8}
                  className="w-full px-3 py-2 border border-border rounded-civic bg-input text-foreground placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
                <p className="text-xs text-text-secondary mt-1">
                  {formData.description.length}/500 characters
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-6 py-2 border border-border text-foreground rounded-civic hover:bg-muted civic-transition"
            >
              Back
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              disabled={!formData.title || !formData.description}
              className="px-6 py-2 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-text-secondary text-primary-foreground rounded-civic civic-transition"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Contact Information */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-foreground mb-2">Contact Information</h3>
            <p className="text-text-secondary">Help us keep you updated on the progress</p>
          </div>

          <div className="bg-card border border-border rounded-civic-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.isAnonymous}
                  onChange={(e) => {
                    handleInputChange('isAnonymous', e.target.checked);
                    setShowContactForm(!e.target.checked);
                  }}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-ring"
                />
                <span className="text-sm font-medium text-foreground">Submit anonymously</span>
              </label>
            </div>

            {!formData.isAnonymous && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.contactInfo.name}
                    onChange={(e) => handleContactInfoChange('name', e.target.value)}
                    placeholder="Your full name"
                    className="w-full px-3 py-2 border border-border rounded-civic bg-input text-foreground placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.contactInfo.email}
                    onChange={(e) => handleContactInfoChange('email', e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full px-3 py-2 border border-border rounded-civic bg-input text-foreground placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={formData.contactInfo.phone}
                    onChange={(e) => handleContactInfoChange('phone', e.target.value)}
                    placeholder="(555) 123-4567"
                    className="w-full px-3 py-2 border border-border rounded-civic bg-input text-foreground placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
            )}

            {formData.isAnonymous && (
              <div className="bg-muted rounded-civic p-4">
                <div className="flex items-center space-x-2 text-text-secondary">
                  <Icon name="EyeSlashIcon" size={16} />
                  <span className="text-sm">
                    Your report will be submitted anonymously. You won't receive updates on the progress.
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-6 py-2 border border-border text-foreground rounded-civic hover:bg-muted civic-transition"
            >
              Back
            </button>
            <div className="text-sm text-text-secondary">
              Ready to submit your report
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IssueClassificationForm;