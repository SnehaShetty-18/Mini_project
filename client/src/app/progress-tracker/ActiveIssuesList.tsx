'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface Issue {
  id: string;
  title: string;
  category: string;
  status: 'submitted' | 'assigned' | 'in-progress' | 'resolved' | 'verified';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  submittedDate: string;
  estimatedCompletion: string;
  department: string;
  location: string;
  image: string;
  alt: string;
  progress: number;
}

interface ActiveIssuesListProps {
  issues: Issue[];
}

const ActiveIssuesList = ({ issues }: ActiveIssuesListProps) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'assigned': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'in-progress': return 'bg-warning/10 text-warning border-warning/20';
      case 'resolved': return 'bg-success/10 text-success border-success/20';
      case 'verified': return 'bg-accent/10 text-accent border-accent/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-error';
      case 'high': return 'text-warning';
      case 'medium': return 'text-brand-primary';
      case 'low': return 'text-success';
      default: return 'text-text-secondary';
    }
  };

  const filteredIssues = issues.filter(issue => 
    selectedFilter === 'all' || issue.status === selectedFilter
  );

  const sortedIssues = [...filteredIssues].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime();
    }
    if (sortBy === 'priority') {
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    return 0;
  });

  return (
    <div className="bg-card rounded-lg border border-border civic-shadow">
      <div className="p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <h2 className="text-xl font-semibold text-foreground">Active Issues</h2>
          
          <div className="flex items-center space-x-4">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-3 py-2 bg-input border border-border rounded-civic text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Status</option>
              <option value="submitted">Submitted</option>
              <option value="assigned">Assigned</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-input border border-border rounded-civic text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="date">Sort by Date</option>
              <option value="priority">Sort by Priority</option>
            </select>
          </div>
        </div>
      </div>

      <div className="divide-y divide-border">
        {sortedIssues.map((issue) => (
          <div key={issue.id} className="p-6 hover:bg-muted/50 civic-transition">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <AppImage 
                  src={issue.image} 
                  alt={issue.alt}
                  className="w-16 h-16 rounded-civic object-cover"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-sm font-medium text-foreground truncate">{issue.title}</h3>
                    <p className="text-xs text-text-secondary">{issue.location}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(issue.status)}`}>
                      {issue.status.replace('-', ' ')}
                    </span>
                    <Icon name="ExclamationTriangleIcon" size={14} className={getPriorityColor(issue.priority)} />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-text-secondary mb-3">
                  <div>
                    <span className="font-medium">Category:</span> {issue.category}
                  </div>
                  <div>
                    <span className="font-medium">Department:</span> {issue.department}
                  </div>
                  <div>
                    <span className="font-medium">Submitted:</span> {issue.submittedDate}
                  </div>
                  <div>
                    <span className="font-medium">Est. Completion:</span> {issue.estimatedCompletion}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex-1 mr-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-text-secondary">Progress</span>
                      <span className="font-medium text-foreground">{issue.progress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div 
                        className="bg-gradient-to-r from-primary to-accent h-1.5 rounded-full civic-transition"
                        style={{ width: `${issue.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="p-1.5 rounded-civic text-text-secondary hover:text-foreground hover:bg-muted civic-transition">
                      <Icon name="EyeIcon" size={14} />
                    </button>
                    <button className="p-1.5 rounded-civic text-text-secondary hover:text-foreground hover:bg-muted civic-transition">
                      <Icon name="ChatBubbleLeftIcon" size={14} />
                    </button>
                    <button className="p-1.5 rounded-civic text-text-secondary hover:text-foreground hover:bg-muted civic-transition">
                      <Icon name="ShareIcon" size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {sortedIssues.length === 0 && (
        <div className="p-12 text-center">
          <Icon name="DocumentTextIcon" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No Issues Found</h3>
          <p className="text-text-secondary">No issues match your current filter criteria.</p>
        </div>
      )}
    </div>
  );
};

export default ActiveIssuesList;