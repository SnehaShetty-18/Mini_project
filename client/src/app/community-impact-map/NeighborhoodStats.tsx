import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface NeighborhoodData {
  name: string;
  totalIssues: number;
  resolvedIssues: number;
  avgResolutionTime: number;
  engagementScore: number;
  activeReporters: number;
  costSavings: number;
}

interface NeighborhoodStatsProps {
  className?: string;
}

const NeighborhoodStats = ({ className = '' }: NeighborhoodStatsProps) => {
  const neighborhoods: NeighborhoodData[] = [
    {
      name: 'Downtown District',
      totalIssues: 89,
      resolvedIssues: 76,
      avgResolutionTime: 12,
      engagementScore: 94,
      activeReporters: 45,
      costSavings: 125000
    },
    {
      name: 'Riverside Commons',
      totalIssues: 67,
      resolvedIssues: 58,
      avgResolutionTime: 15,
      engagementScore: 87,
      activeReporters: 32,
      costSavings: 89000
    },
    {
      name: 'Heritage Hills',
      totalIssues: 54,
      resolvedIssues: 49,
      avgResolutionTime: 10,
      engagementScore: 91,
      activeReporters: 28,
      costSavings: 67000
    },
    {
      name: 'Tech Quarter',
      totalIssues: 78,
      resolvedIssues: 65,
      avgResolutionTime: 14,
      engagementScore: 89,
      activeReporters: 41,
      costSavings: 98000
    },
    {
      name: 'Green Valley',
      totalIssues: 43,
      resolvedIssues: 38,
      avgResolutionTime: 11,
      engagementScore: 85,
      activeReporters: 22,
      costSavings: 54000
    }
  ];

  const getResolutionRate = (resolved: number, total: number) => {
    return Math.round((resolved / total) * 100);
  };

  const getEngagementLevel = (score: number) => {
    if (score >= 90) return { label: 'Excellent', color: 'text-green-600 bg-green-50' };
    if (score >= 80) return { label: 'Good', color: 'text-blue-600 bg-blue-50' };
    if (score >= 70) return { label: 'Fair', color: 'text-yellow-600 bg-yellow-50' };
    return { label: 'Needs Improvement', color: 'text-red-600 bg-red-50' };
  };

  return (
    <div className={`bg-card border border-border rounded-lg civic-shadow ${className}`}>
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="BuildingOffice2Icon" size={20} className="text-primary" />
          <h3 className="font-semibold text-foreground">Neighborhood Performance</h3>
        </div>
        <p className="text-sm text-text-secondary mt-1">
          Community engagement and resolution metrics by area
        </p>
      </div>

      <div className="p-4">
        <div className="space-y-4">
          {neighborhoods.map((neighborhood, index) => {
            const resolutionRate = getResolutionRate(neighborhood.resolvedIssues, neighborhood.totalIssues);
            const engagementLevel = getEngagementLevel(neighborhood.engagementScore);
            
            return (
              <div key={neighborhood.name} className="p-4 border border-border rounded-civic hover:bg-muted/50 civic-transition">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-foreground">{neighborhood.name}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${engagementLevel.color}`}>
                        {engagementLevel.label}
                      </span>
                      <span className="text-xs text-text-secondary">
                        #{index + 1} in city
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">{resolutionRate}%</div>
                    <div className="text-xs text-text-secondary">Resolution Rate</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Icon name="ExclamationTriangleIcon" size={14} className="text-text-secondary" />
                    <div>
                      <div className="font-medium text-foreground">{neighborhood.totalIssues}</div>
                      <div className="text-xs text-text-secondary">Total Issues</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Icon name="ClockIcon" size={14} className="text-text-secondary" />
                    <div>
                      <div className="font-medium text-foreground">{neighborhood.avgResolutionTime}d</div>
                      <div className="text-xs text-text-secondary">Avg Resolution</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Icon name="UserGroupIcon" size={14} className="text-text-secondary" />
                    <div>
                      <div className="font-medium text-foreground">{neighborhood.activeReporters}</div>
                      <div className="text-xs text-text-secondary">Active Citizens</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Icon name="CurrencyDollarIcon" size={14} className="text-text-secondary" />
                    <div>
                      <div className="font-medium text-foreground">${(neighborhood.costSavings / 1000).toFixed(0)}K</div>
                      <div className="text-xs text-text-secondary">Cost Savings</div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-text-secondary mb-1">
                    <span>Progress</span>
                    <span>{neighborhood.resolvedIssues}/{neighborhood.totalIssues} resolved</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full civic-transition"
                      style={{ width: `${resolutionRate}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Stats */}
        <div className="mt-6 pt-4 border-t border-border">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">331</div>
              <div className="text-xs text-text-secondary">Total Issues</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">286</div>
              <div className="text-xs text-text-secondary">Resolved</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">12.4d</div>
              <div className="text-xs text-text-secondary">Avg Resolution</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">$433K</div>
              <div className="text-xs text-text-secondary">Total Savings</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeighborhoodStats;