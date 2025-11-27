'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface Issue {
  id: string;
  title: string;
  description: string;
  type: string;
  status: 'reported' | 'in-progress' | 'resolved' | 'verified';
  priority: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  reportedDate: string;
  lastUpdate: string;
  department: string;
  reporterName: string;
  upvotes: number;
  images: Array<{ url: string; alt: string }>;
  estimatedResolution?: string;
  cost?: number;
}

interface IssueMarkerPopupProps {
  issue: Issue;
  onClose: () => void;
  onUpvote: (issueId: string) => void;
  onViewDetails: (issueId: string) => void;
}

const IssueMarkerPopup = ({ issue, onClose, onUpvote, onViewDetails }: IssueMarkerPopupProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'reported': return 'text-red-600 bg-red-50';
      case 'in-progress': return 'text-yellow-600 bg-yellow-50';
      case 'resolved': return 'text-green-600 bg-green-50';
      case 'verified': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-700 bg-red-100';
      case 'high': return 'text-orange-700 bg-orange-100';
      case 'medium': return 'text-yellow-700 bg-yellow-100';
      case 'low': return 'text-green-700 bg-green-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'reported': return 'ExclamationCircleIcon';
      case 'in-progress': return 'ClockIcon';
      case 'resolved': return 'CheckCircleIcon';
      case 'verified': return 'ShieldCheckIcon';
      default: return 'InformationCircleIcon';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg civic-shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between p-4 border-b border-border">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground truncate">
              {issue.title}
            </h3>
            <p className="text-sm text-text-secondary mt-1">
              {issue.location}
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-3 p-1 rounded-civic text-text-secondary hover:text-foreground hover:bg-muted civic-transition"
          >
            <Icon name="XMarkIcon" size={20} />
          </button>
        </div>

        {/* Status and Priority */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
                <Icon name={getStatusIcon(issue.status) as any} size={12} className="mr-1" />
                {issue.status.charAt(0).toUpperCase() + issue.status.slice(1).replace('-', ' ')}
              </span>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(issue.priority)}`}>
                {issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1)} Priority
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-text-secondary">Department:</span>
              <p className="text-foreground font-medium">{issue.department}</p>
            </div>
            <div>
              <span className="text-text-secondary">Reported:</span>
              <p className="text-foreground font-medium">{formatDate(issue.reportedDate)}</p>
            </div>
          </div>
        </div>

        {/* Images */}
        {issue.images.length > 0 && (
          <div className="p-4 border-b border-border">
            <div className="grid grid-cols-2 gap-2">
              {issue.images.slice(0, 4).map((image, index) => (
                <div key={index} className="aspect-square rounded-civic overflow-hidden">
                  <AppImage
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        <div className="p-4 border-b border-border">
          <h4 className="text-sm font-medium text-foreground mb-2">Description</h4>
          <p className="text-sm text-text-secondary leading-relaxed">
            {issue.description}
          </p>
        </div>

        {/* Additional Info */}
        <div className="p-4 border-b border-border">
          <div className="grid grid-cols-1 gap-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">Reporter:</span>
              <span className="text-foreground font-medium">{issue.reporterName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">Last Update:</span>
              <span className="text-foreground font-medium">{formatDate(issue.lastUpdate)}</span>
            </div>
            {issue.estimatedResolution && (
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Est. Resolution:</span>
                <span className="text-foreground font-medium">{issue.estimatedResolution}</span>
              </div>
            )}
            {issue.cost && (
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Est. Cost:</span>
                <span className="text-foreground font-medium">${issue.cost.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => onUpvote(issue.id)}
              className="flex items-center space-x-2 px-3 py-2 rounded-civic text-sm font-medium text-foreground hover:bg-muted civic-transition"
            >
              <Icon name="HandThumbUpIcon" size={16} />
              <span>Upvote</span>
              <span className="bg-muted text-text-secondary px-2 py-1 rounded-full text-xs">
                {issue.upvotes}
              </span>
            </button>
            
            <button
              onClick={() => onViewDetails(issue.id)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-civic text-sm font-semibold civic-transition"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueMarkerPopup;