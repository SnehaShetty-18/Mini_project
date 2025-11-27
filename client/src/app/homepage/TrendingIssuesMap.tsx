'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface IssueMarker {
  id: string;
  title: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  reports: number;
  status: 'reported' | 'in-progress' | 'resolved';
  coordinates: { lat: number; lng: number };
  address: string;
}

interface TrendingIssuesMapProps {
  className?: string;
}

const TrendingIssuesMap = ({ className = '' }: TrendingIssuesMapProps) => {
  const [selectedIssue, setSelectedIssue] = useState<IssueMarker | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const issues: IssueMarker[] = [
    {
      id: '1',
      title: 'Water Main Break',
      type: 'Infrastructure',
      severity: 'critical',
      reports: 47,
      status: 'in-progress',
      coordinates: { lat: 40.7128, lng: -74.0060 },
      address: '123 Oak Street'
    },
    {
      id: '2',
      title: 'Traffic Light Malfunction',
      type: 'Traffic',
      severity: 'high',
      reports: 23,
      status: 'reported',
      coordinates: { lat: 40.7589, lng: -73.9851 },
      address: 'Main St & 5th Ave'
    },
    {
      id: '3',
      title: 'Pothole Cluster',
      type: 'Roads',
      severity: 'medium',
      reports: 18,
      status: 'in-progress',
      coordinates: { lat: 40.7505, lng: -73.9934 },
      address: 'Downtown Area'
    },
    {
      id: '4',
      title: 'Broken Streetlight',
      type: 'Lighting',
      severity: 'low',
      reports: 8,
      status: 'resolved',
      coordinates: { lat: 40.7282, lng: -73.7949 },
      address: '456 Elm Street'
    },
    {
      id: '5',
      title: 'Graffiti Vandalism',
      type: 'Vandalism',
      severity: 'low',
      reports: 12,
      status: 'reported',
      coordinates: { lat: 40.7614, lng: -73.9776 },
      address: '789 Pine Avenue'
    }
  ];

  const filters = [
    { id: 'all', label: 'All Issues', count: issues.length },
    { id: 'critical', label: 'Critical', count: issues.filter(i => i.severity === 'critical').length },
    { id: 'in-progress', label: 'In Progress', count: issues.filter(i => i.status === 'in-progress').length },
    { id: 'reported', label: 'New Reports', count: issues.filter(i => i.status === 'reported').length }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-error';
      case 'high': return 'bg-warning';
      case 'medium': return 'bg-accent';
      case 'low': return 'bg-success';
      default: return 'bg-text-secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'text-success';
      case 'in-progress': return 'text-warning';
      case 'reported': return 'text-error';
      default: return 'text-text-secondary';
    }
  };

  const filteredIssues = activeFilter === 'all' 
    ? issues 
    : issues.filter(issue => 
        activeFilter === 'critical' ? issue.severity === 'critical' :
        activeFilter === 'in-progress' ? issue.status === 'in-progress' :
        activeFilter === 'reported' ? issue.status === 'reported' :
        true
      );

  return (
    <section className={`py-16 bg-background ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Trending Issues Map
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Interactive visualization of active civic problems across neighborhoods with real-time severity levels and community response.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-civic text-sm font-medium civic-transition ${
                activeFilter === filter.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card text-foreground hover:bg-muted border border-border'
              }`}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Map Container */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-civic-lg civic-shadow border border-border overflow-hidden">
              <div className="h-96 bg-muted relative">
                {/* Google Maps Iframe */}
                <iframe
                  width="100%"
                  height="100%"
                  loading="lazy"
                  title="Community Issues Map"
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://www.google.com/maps?q=40.7128,-74.0060&z=12&output=embed"
                  className="w-full h-full"
                />
                
                {/* Overlay Controls */}
                <div className="absolute top-4 left-4 bg-white rounded-civic civic-shadow p-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <Icon name="MapIcon" size={16} className="text-primary" />
                    <span className="font-medium">Live Issues: {filteredIssues.length}</span>
                  </div>
                </div>
                
                <div className="absolute top-4 right-4 bg-white rounded-civic civic-shadow p-2">
                  <div className="flex items-center space-x-4 text-xs">
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-error rounded-full"></div>
                      <span>Critical</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-warning rounded-full"></div>
                      <span>High</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-accent rounded-full"></div>
                      <span>Medium</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-success rounded-full"></div>
                      <span>Low</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Issues List */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground mb-4">Active Issues</h3>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredIssues.map((issue) => (
                <div
                  key={issue.id}
                  onClick={() => setSelectedIssue(issue)}
                  className={`bg-card rounded-civic p-4 civic-shadow border cursor-pointer civic-transition hover:civic-shadow-lg ${
                    selectedIssue?.id === issue.id ? 'border-primary' : 'border-border'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 ${getSeverityColor(issue.severity)} rounded-full`}></div>
                      <h4 className="font-medium text-foreground text-sm">{issue.title}</h4>
                    </div>
                    <span className="text-xs text-text-secondary">{issue.reports} reports</span>
                  </div>
                  
                  <p className="text-xs text-text-secondary mb-2">{issue.address}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-muted px-2 py-1 rounded-civic">{issue.type}</span>
                    <span className={`text-xs font-medium ${getStatusColor(issue.status)}`}>
                      {issue.status.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-6 p-4 bg-surface rounded-civic border border-border">
              <h4 className="font-medium text-foreground mb-3">Quick Actions</h4>
              <div className="space-y-2">
                <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-civic civic-transition">
                  <Icon name="PlusIcon" size={16} />
                  <span>Report New Issue</span>
                </button>
                <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-civic civic-transition">
                  <Icon name="MagnifyingGlassIcon" size={16} />
                  <span>Search by Address</span>
                </button>
                <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-civic civic-transition">
                  <Icon name="BellIcon" size={16} />
                  <span>Set Area Alerts</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrendingIssuesMap;