'use client';

import React, { useState, useEffect } from 'react';
import MapFilters from './MapFilters';
import MapLegend from './MapLegend';
import IssueMarkerPopup from './IssueMarkerPopup';
import NeighborhoodStats from './NeighborhoodStats';
import MapControls from './MapControls';
import Icon from '@/components/ui/AppIcon';
import { getIssuesDataService } from '@/services/issuesData';
import type { Issue as ServiceIssue } from '@/services/issuesData';

interface FilterOptions {
  issueTypes: string[];
  statuses: string[];
  departments: string[];
  dateRange: string;
}

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
  images: Array<{url: string;alt: string;}>;
  estimatedResolution?: string;
  cost?: number;
  coordinates: {lat: number;lng: number;};
}

const CommunityMapInteractive = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [isHeatmapEnabled, setIsHeatmapEnabled] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({
    issueTypes: [],
    statuses: [],
    departments: [],
    dateRange: '30d'
  });
  const [mockIssues, setMockIssues] = useState<Issue[]>([]);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Load issues when component mounts
  useEffect(() => {
    const loadIssues = async () => {
      try {
        const issuesService = getIssuesDataService();
        const allServiceIssues = await issuesService.getAllIssues();
        
        // Convert service issues to map format
        const issues: Issue[] = allServiceIssues.map(serviceIssue => ({
          id: serviceIssue.id,
          title: serviceIssue.title,
          description: serviceIssue.description,
          type: serviceIssue.category.toLowerCase().replace(/ /g, '-'),
          status: serviceIssue.status === 'submitted' ? 'reported' : 
                  serviceIssue.status === 'verified' ? 'verified' :
                  serviceIssue.status === 'resolved' ? 'resolved' : 'in-progress',
          priority: serviceIssue.priority === 'urgent' ? 'critical' : serviceIssue.priority,
          location: serviceIssue.location.address,
          reportedDate: serviceIssue.submittedDate.toISOString().split('T')[0],
          lastUpdate: new Date().toISOString().split('T')[0],
          department: serviceIssue.department,
          reporterName: serviceIssue.reporter?.name || 'Anonymous',
          upvotes: 0, // Will be managed by upvote service
          images: serviceIssue.images?.map(url => ({ url, alt: serviceIssue.title })) || [],
          estimatedResolution: serviceIssue.estimatedCompletion?.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          coordinates: { lat: serviceIssue.location.latitude, lng: serviceIssue.location.longitude }
        }));
        
        setMockIssues(issues);
      } catch (error) {
        console.error('Failed to load issues:', error);
      }
    };
    
    loadIssues();
  }, []);

  const handleFiltersChange = (filters: FilterOptions) => {
    setActiveFilters(filters);
  };

  const handleIssueClick = (issue: Issue) => {
    setSelectedIssue(issue);
  };

  const handleUpvote = (issueId: string) => {
    console.log('Upvoting issue:', issueId);
  };

  const handleViewDetails = (issueId: string) => {
    console.log('Viewing details for issue:', issueId);
    setSelectedIssue(null);
  };

  const handleLayerToggle = (layerId: string) => {
    console.log('Toggling layer:', layerId);
  };

  const handleZoomIn = () => {
    console.log('Zooming in');
  };

  const handleZoomOut = () => {
    console.log('Zooming out');
  };

  const handleResetView = () => {
    console.log('Resetting view');
  };

  const handleToggleHeatmap = () => {
    setIsHeatmapEnabled(!isHeatmapEnabled);
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>);

  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col lg:flex-row h-screen">
        {/* Sidebar */}
        <div className="w-full lg:w-80 bg-card border-r border-border overflow-y-auto">
          <div className="p-4 space-y-4">
            <MapFilters
              onFiltersChange={handleFiltersChange}
              activeFilters={activeFilters} />

            <MapLegend />
            <NeighborhoodStats />
          </div>
        </div>

        {/* Main Map Area */}
        <div className="flex-1 relative">
          {/* Map Container */}
          <div className="h-full bg-muted relative">
            {/* Google Maps Iframe */}
            <iframe
              width="100%"
              height="100%"
              loading="lazy"
              title="Community Impact Map"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps?q=40.7128,-74.0060&z=12&output=embed"
              className="border-0" />


            {/* Heat Map Overlay */}
            {isHeatmapEnabled &&
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-yellow-500/30 to-red-500/40 pointer-events-none">
                <div className="absolute top-4 left-4 bg-card border border-border rounded-civic px-3 py-2 civic-shadow">
                  <div className="flex items-center space-x-2">
                    <Icon name="FireIcon" size={16} className="text-red-500" />
                    <span className="text-sm font-medium text-foreground">Heat Map Active</span>
                  </div>
                </div>
              </div>
            }

            {/* Issue Markers Overlay */}
            <div className="absolute inset-0 pointer-events-none">
              {mockIssues.map((issue, index) =>
              <button
                key={issue.id}
                onClick={() => handleIssueClick(issue)}
                className="absolute pointer-events-auto"
                style={{
                  left: `${20 + index * 15}%`,
                  top: `${30 + index * 10}%`,
                  transform: 'translate(-50%, -50%)'
                }}>

                  <div className={`w-6 h-6 rounded-full border-2 border-white civic-shadow flex items-center justify-center ${
                issue.status === 'resolved' ? 'bg-green-500' :
                issue.status === 'in-progress' ? 'bg-yellow-500' :
                issue.status === 'verified' ? 'bg-blue-500' : 'bg-red-500'}`
                }>
                    <Icon
                    name={
                    issue.status === 'resolved' ? 'CheckIcon' :
                    issue.status === 'in-progress' ? 'ClockIcon' : 'ExclamationMarkIcon'
                    }
                    size={12}
                    className="text-white" />

                  </div>
                </button>
              )}
            </div>

            {/* Map Controls */}
            <div className="absolute top-4 right-4">
              <MapControls
                onLayerToggle={handleLayerToggle}
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onResetView={handleResetView}
                onToggleHeatmap={handleToggleHeatmap}
                isHeatmapEnabled={isHeatmapEnabled} />

            </div>

            {/* Map Stats Overlay */}
            <div className="absolute bottom-4 left-4 bg-card border border-border rounded-civic civic-shadow p-4">
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-primary">151</div>
                  <div className="text-xs text-text-secondary">Active Issues</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-600">286</div>
                  <div className="text-xs text-text-secondary">Resolved</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-blue-600">168</div>
                  <div className="text-xs text-text-secondary">Active Citizens</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-accent">89%</div>
                  <div className="text-xs text-text-secondary">Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Issue Popup Modal */}
      {selectedIssue &&
      <IssueMarkerPopup
        issue={selectedIssue}
        onClose={() => setSelectedIssue(null)}
        onUpvote={handleUpvote}
        onViewDetails={handleViewDetails} />

      }
    </div>);

};

export default CommunityMapInteractive;