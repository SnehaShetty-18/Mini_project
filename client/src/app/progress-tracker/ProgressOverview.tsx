import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface ProgressStats {
  totalReports: number;
  inProgress: number;
  resolved: number;
  avgResolutionTime: number;
  satisfactionRate: number;
}

interface ProgressOverviewProps {
  stats: ProgressStats;
}

const ProgressOverview = ({ stats }: ProgressOverviewProps) => {
  const completionRate = Math.round((stats.resolved / stats.totalReports) * 100);
  
  return (
    <div className="bg-card rounded-lg border border-border p-6 civic-shadow">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Progress Overview</h2>
        <div className="flex items-center space-x-2 text-sm text-text-secondary">
          <Icon name="ClockIcon" size={16} />
          <span>Updated 2 minutes ago</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{stats.totalReports}</div>
          <div className="text-sm text-text-secondary">Total Reports</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-warning">{stats.inProgress}</div>
          <div className="text-sm text-text-secondary">In Progress</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-success">{stats.resolved}</div>
          <div className="text-sm text-text-secondary">Resolved</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-accent">{stats.avgResolutionTime}</div>
          <div className="text-sm text-text-secondary">Avg Days</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-brand-primary">{stats.satisfactionRate}%</div>
          <div className="text-sm text-text-secondary">Satisfaction</div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">Completion Rate</span>
          <span className="font-medium text-foreground">{completionRate}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-primary to-accent h-2 rounded-full civic-transition"
            style={{ width: `${completionRate}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressOverview;