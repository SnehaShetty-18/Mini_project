import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface ActivityItem {
  id: string;
  type: 'issue_assigned' | 'issue_resolved' | 'budget_approved' | 'inspection_completed' | 'contractor_assigned';
  title: string;
  description: string;
  timestamp: string;
  user: string;
  department: string;
  priority?: 'high' | 'medium' | 'low';
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

const RecentActivity = ({ activities }: RecentActivityProps) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'issue_assigned':
        return 'UserPlusIcon';
      case 'issue_resolved':
        return 'CheckCircleIcon';
      case 'budget_approved':
        return 'CurrencyDollarIcon';
      case 'inspection_completed':
        return 'ClipboardDocumentCheckIcon';
      case 'contractor_assigned':
        return 'WrenchScrewdriverIcon';
      default:
        return 'InformationCircleIcon';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'issue_assigned':
        return 'bg-primary';
      case 'issue_resolved':
        return 'bg-success';
      case 'budget_approved':
        return 'bg-accent';
      case 'inspection_completed':
        return 'bg-warning';
      case 'contractor_assigned':
        return 'bg-secondary';
      default:
        return 'bg-muted';
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high':
        return 'text-error';
      case 'medium':
        return 'text-warning';
      case 'low':
        return 'text-success';
      default:
        return 'text-text-secondary';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
          <button className="text-sm font-medium text-primary hover:text-primary/80 civic-transition">
            View All
          </button>
        </div>
      </div>
      
      <div className="divide-y divide-border max-h-96 overflow-y-auto">
        {activities.map((activity) => (
          <div key={activity.id} className="p-6 hover:bg-muted/50 civic-transition">
            <div className="flex items-start space-x-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getActivityColor(activity.type)}`}>
                <Icon name={getActivityIcon(activity.type) as any} size={18} className="text-white" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <h4 className="text-sm font-semibold text-foreground line-clamp-1">
                    {activity.title}
                  </h4>
                  {activity.priority && (
                    <span className={`text-xs font-medium ml-2 ${getPriorityColor(activity.priority)}`}>
                      {activity.priority.toUpperCase()}
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-text-secondary line-clamp-2 mb-2">
                  {activity.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-text-secondary">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <Icon name="UserIcon" size={12} className="mr-1" />
                      {activity.user}
                    </span>
                    <span className="flex items-center">
                      <Icon name="BuildingOfficeIcon" size={12} className="mr-1" />
                      {activity.department}
                    </span>
                  </div>
                  <span>{activity.timestamp}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;