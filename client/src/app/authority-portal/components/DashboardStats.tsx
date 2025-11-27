import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface StatItem {
  id: string;
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: string;
  color: string;
}

interface DashboardStatsProps {
  stats: StatItem[];
}

const DashboardStats = ({ stats }: DashboardStatsProps) => {
  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'increase':
        return 'text-success';
      case 'decrease':
        return 'text-error';
      default:
        return 'text-text-secondary';
    }
  };

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'increase':
        return 'ArrowUpIcon';
      case 'decrease':
        return 'ArrowDownIcon';
      default:
        return 'MinusIcon';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.id}
          className="bg-card border border-border rounded-lg p-6 civic-shadow hover:civic-shadow-lg civic-transition"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-text-secondary mb-1">
                {stat.title}
              </p>
              <p className="text-2xl font-bold text-foreground mb-2">
                {stat.value}
              </p>
              <div className="flex items-center space-x-1">
                <Icon
                  name={getChangeIcon(stat.changeType) as any}
                  size={16}
                  className={getChangeColor(stat.changeType)}
                />
                <span className={`text-sm font-medium ${getChangeColor(stat.changeType)}`}>
                  {stat.change}
                </span>
              </div>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
              <Icon name={stat.icon as any} size={24} className="text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;