import React from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface PriorityIssue {
  id: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  location: string;
  reportedAt: string;
  estimatedCost: string;
  department: string;
  image: string;
  alt: string;
  reporterName: string;
}

interface PriorityQueueProps {
  issues: PriorityIssue[];
}

const PriorityQueue = ({ issues }: PriorityQueueProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-error text-error-foreground';
      case 'high':
        return 'bg-warning text-warning-foreground';
      case 'medium':
        return 'bg-accent text-accent-foreground';
      case 'low':
        return 'bg-muted text-foreground';
      default:
        return 'bg-muted text-foreground';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'ExclamationTriangleIcon';
      case 'high':
        return 'FireIcon';
      case 'medium':
        return 'ClockIcon';
      case 'low':
        return 'InformationCircleIcon';
      default:
        return 'InformationCircleIcon';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Priority Queue</h3>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted rounded-civic civic-transition">
              Filter
            </button>
            <button className="px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted rounded-civic civic-transition">
              Sort
            </button>
          </div>
        </div>
      </div>
      
      <div className="divide-y divide-border max-h-96 overflow-y-auto">
        {issues.map((issue) => (
          <div key={issue.id} className="p-6 hover:bg-muted/50 civic-transition">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                <AppImage
                  src={issue.image}
                  alt={issue.alt}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-foreground mb-1 line-clamp-1">
                      {issue.title}
                    </h4>
                    <p className="text-sm text-text-secondary line-clamp-2 mb-2">
                      {issue.description}
                    </p>
                  </div>
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ml-2 ${getPriorityColor(issue.priority)}`}>
                    <Icon name={getPriorityIcon(issue.priority) as any} size={12} className="mr-1" />
                    {issue.priority.toUpperCase()}
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs text-text-secondary">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <Icon name="MapPinIcon" size={12} className="mr-1" />
                      {issue.location}
                    </span>
                    <span className="flex items-center">
                      <Icon name="TagIcon" size={12} className="mr-1" />
                      {issue.category}
                    </span>
                    <span className="flex items-center">
                      <Icon name="BuildingOfficeIcon" size={12} className="mr-1" />
                      {issue.department}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-foreground">{issue.estimatedCost}</span>
                    <span>{issue.reportedAt}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PriorityQueue;