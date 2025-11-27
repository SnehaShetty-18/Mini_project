import React from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  status: 'completed' | 'current' | 'pending';
  department?: string;
  assignee?: string;
  image?: string;
  alt?: string;
}

interface IssueTimelineProps {
  events: TimelineEvent[];
  issueTitle: string;
  issueId: string;
}

const IssueTimeline = ({ events, issueTitle, issueId }: IssueTimelineProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return { name: 'CheckCircleIcon', color: 'text-success' };
      case 'current':
        return { name: 'ClockIcon', color: 'text-warning' };
      default:
        return { name: 'CircleStackIcon', color: 'text-muted-foreground' };
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 civic-shadow">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{issueTitle}</h3>
          <p className="text-sm text-text-secondary">Issue ID: {issueId}</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-civic text-text-secondary hover:text-foreground hover:bg-muted civic-transition">
            <Icon name="ShareIcon" size={16} />
          </button>
          <button className="p-2 rounded-civic text-text-secondary hover:text-foreground hover:bg-muted civic-transition">
            <Icon name="BellIcon" size={16} />
          </button>
        </div>
      </div>

      <div className="relative">
        {events.map((event, index) => {
          const statusIcon = getStatusIcon(event.status);
          const isLast = index === events.length - 1;
          
          return (
            <div key={event.id} className="relative flex items-start space-x-4 pb-6">
              {/* Timeline line */}
              {!isLast && (
                <div className="absolute left-4 top-8 w-0.5 h-full bg-border"></div>
              )}
              
              {/* Status icon */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-card border-2 ${
                event.status === 'completed' ? 'border-success bg-success/10' :
                event.status === 'current'? 'border-warning bg-warning/10' : 'border-border bg-muted'
              } flex items-center justify-center`}>
                <Icon name={statusIcon.name as any} size={16} className={statusIcon.color} />
              </div>
              
              {/* Event content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-foreground">{event.title}</h4>
                  <span className="text-xs text-text-secondary">{event.timestamp}</span>
                </div>
                
                <p className="text-sm text-text-secondary mb-2">{event.description}</p>
                
                {(event.department || event.assignee) && (
                  <div className="flex items-center space-x-4 text-xs text-text-secondary mb-2">
                    {event.department && (
                      <div className="flex items-center space-x-1">
                        <Icon name="BuildingOfficeIcon" size={12} />
                        <span>{event.department}</span>
                      </div>
                    )}
                    {event.assignee && (
                      <div className="flex items-center space-x-1">
                        <Icon name="UserIcon" size={12} />
                        <span>{event.assignee}</span>
                      </div>
                    )}
                  </div>
                )}
                
                {event.image && event.alt && (
                  <div className="mt-2">
                    <AppImage 
                      src={event.image} 
                      alt={event.alt}
                      className="w-32 h-24 rounded-civic object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IssueTimeline;