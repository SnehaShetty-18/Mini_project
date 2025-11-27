import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  icon: string;
  color: string;
}

interface CityHealthDashboardProps {
  className?: string;
}

const MetricCard = ({ title, value, change, trend, icon, color }: MetricCardProps) => {
  const trendIcon = trend === 'up' ? 'ArrowUpIcon' : trend === 'down' ? 'ArrowDownIcon' : 'MinusIcon';
  const trendColor = trend === 'up' ? 'text-success' : trend === 'down' ? 'text-error' : 'text-text-secondary';
  
  return (
    <div className="bg-card rounded-civic-lg p-6 civic-shadow border border-border">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${color} rounded-civic flex items-center justify-center`}>
          <Icon name={icon as any} size={24} className="text-white" />
        </div>
        <div className={`flex items-center space-x-1 ${trendColor}`}>
          <Icon name={trendIcon as any} size={16} />
          <span className="text-sm font-medium">{change}</span>
        </div>
      </div>
      
      <div className="space-y-1">
        <h3 className="text-2xl font-bold text-foreground">{value}</h3>
        <p className="text-sm text-text-secondary">{title}</p>
      </div>
    </div>
  );
};

const CityHealthDashboard = ({ className = '' }: CityHealthDashboardProps) => {
  const metrics = [
    {
      title: 'Active Issues',
      value: '127',
      change: '-12%',
      trend: 'down' as const,
      icon: 'ExclamationTriangleIcon',
      color: 'bg-warning'
    },
    {
      title: 'Resolved This Week',
      value: '89',
      change: '+23%',
      trend: 'up' as const,
      icon: 'CheckCircleIcon',
      color: 'bg-success'
    },
    {
      title: 'Community Engagement',
      value: '94%',
      change: '+5%',
      trend: 'up' as const,
      icon: 'UserGroupIcon',
      color: 'bg-accent'
    },
    {
      title: 'Response Time',
      value: '2.3hrs',
      change: '-18%',
      trend: 'down' as const,
      icon: 'ClockIcon',
      color: 'bg-primary'
    }
  ];

  return (
    <section className={`py-16 bg-surface ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Real-Time City Health Dashboard
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Monitor your community's pulse with live metrics and AI-powered insights that drive meaningful change.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>
        
        {/* Additional Dashboard Elements */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Priority Issues */}
          <div className="bg-card rounded-civic-lg p-6 civic-shadow border border-border">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Priority Issues</h3>
              <Icon name="FireIcon" size={20} className="text-error" />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-error/5 rounded-civic border-l-4 border-error">
                <div className="w-2 h-2 bg-error rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Water Main Break</p>
                  <p className="text-xs text-text-secondary">Oak Street - 47 reports</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-warning/5 rounded-civic border-l-4 border-warning">
                <div className="w-2 h-2 bg-warning rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Traffic Light Malfunction</p>
                  <p className="text-xs text-text-secondary">Main & 5th - 23 reports</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-accent/5 rounded-civic border-l-4 border-accent">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Pothole Cluster</p>
                  <p className="text-xs text-text-secondary">Downtown Area - 18 reports</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Department Performance */}
          <div className="bg-card rounded-civic-lg p-6 civic-shadow border border-border">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Department Performance</h3>
              <Icon name="ChartBarIcon" size={20} className="text-primary" />
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground">Public Works</span>
                  <span className="text-success font-medium">92%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-success h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground">Transportation</span>
                  <span className="text-accent font-medium">87%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-accent h-2 rounded-full" style={{ width: '87%' }}></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground">Parks & Recreation</span>
                  <span className="text-warning font-medium">78%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-warning h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recent Activity */}
          <div className="bg-card rounded-civic-lg p-6 civic-shadow border border-border">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
              <Icon name="BoltIcon" size={20} className="text-accent" />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name="CheckIcon" size={16} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">Streetlight repaired on Elm Street</p>
                  <p className="text-xs text-text-secondary">2 minutes ago</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name="WrenchScrewdriverIcon" size={16} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">Crew dispatched to Oak Street</p>
                  <p className="text-xs text-text-secondary">15 minutes ago</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name="PlusIcon" size={16} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">New report: Graffiti on Main St</p>
                  <p className="text-xs text-text-secondary">32 minutes ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CityHealthDashboard;