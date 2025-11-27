'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface Notification {
  id: string;
  type: 'update' | 'completion' | 'escalation' | 'reminder';
  title: string;
  message: string;
  timestamp: string;
  issueId: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface NotificationCenterProps {
  notifications: Notification[];
}

const NotificationCenter = ({ notifications }: NotificationCenterProps) => {
  const [selectedTab, setSelectedTab] = useState<string>('all');
  const [expandedNotification, setExpandedNotification] = useState<string | null>(null);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'update': return { name: 'InformationCircleIcon', color: 'text-primary' };
      case 'completion': return { name: 'CheckCircleIcon', color: 'text-success' };
      case 'escalation': return { name: 'ExclamationTriangleIcon', color: 'text-error' };
      case 'reminder': return { name: 'ClockIcon', color: 'text-warning' };
      default: return { name: 'BellIcon', color: 'text-text-secondary' };
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-error';
      case 'medium': return 'border-l-warning';
      case 'low': return 'border-l-success';
      default: return 'border-l-border';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (selectedTab === 'all') return true;
    if (selectedTab === 'unread') return !notification.isRead;
    return notification.type === selectedTab;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="bg-card rounded-lg border border-border civic-shadow">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">Notifications</h2>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <span className="px-2 py-1 bg-error text-error-foreground text-xs font-medium rounded-full">
                {unreadCount}
              </span>
            )}
            <button className="p-2 rounded-civic text-text-secondary hover:text-foreground hover:bg-muted civic-transition">
              <Icon name="Cog6ToothIcon" size={16} />
            </button>
          </div>
        </div>

        <div className="flex space-x-1 bg-muted rounded-civic p-1">
          {[
            { key: 'all', label: 'All', count: notifications.length },
            { key: 'unread', label: 'Unread', count: unreadCount },
            { key: 'update', label: 'Updates', count: notifications.filter(n => n.type === 'update').length },
            { key: 'completion', label: 'Completed', count: notifications.filter(n => n.type === 'completion').length }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key)}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-civic civic-transition ${
                selectedTab === tab.key
                  ? 'bg-card text-foreground civic-shadow'
                  : 'text-text-secondary hover:text-foreground'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-1 text-xs opacity-60">({tab.count})</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {filteredNotifications.length > 0 ? (
          <div className="divide-y divide-border">
            {filteredNotifications.map((notification) => {
              const icon = getNotificationIcon(notification.type);
              const isExpanded = expandedNotification === notification.id;
              
              return (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-muted/50 civic-transition border-l-4 ${getPriorityColor(notification.priority)} ${
                    !notification.isRead ? 'bg-primary/5' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <Icon name={icon.name as any} size={20} className={icon.color} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className={`text-sm font-medium ${!notification.isRead ? 'text-foreground' : 'text-text-secondary'}`}>
                          {notification.title}
                        </h4>
                        <div className="flex items-center space-x-2 ml-4">
                          <span className="text-xs text-text-secondary">{notification.timestamp}</span>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                          )}
                        </div>
                      </div>
                      
                      <p className={`text-sm mb-2 ${isExpanded ? '' : 'line-clamp-2'} ${
                        !notification.isRead ? 'text-foreground' : 'text-text-secondary'
                      }`}>
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-text-secondary">
                          Issue #{notification.issueId}
                        </span>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setExpandedNotification(
                              isExpanded ? null : notification.id
                            )}
                            className="text-xs text-primary hover:text-primary/80 civic-transition"
                          >
                            {isExpanded ? 'Show Less' : 'Show More'}
                          </button>
                          <button className="p-1 rounded-civic text-text-secondary hover:text-foreground hover:bg-muted civic-transition">
                            <Icon name="EllipsisHorizontalIcon" size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center">
            <Icon name="BellSlashIcon" size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No Notifications</h3>
            <p className="text-text-secondary">You're all caught up! No new notifications to display.</p>
          </div>
        )}
      </div>

      {filteredNotifications.length > 0 && (
        <div className="p-4 border-t border-border bg-muted/30">
          <div className="flex items-center justify-between">
            <button className="text-sm text-primary hover:text-primary/80 civic-transition">
              Mark All as Read
            </button>
            <button className="text-sm text-text-secondary hover:text-foreground civic-transition">
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;