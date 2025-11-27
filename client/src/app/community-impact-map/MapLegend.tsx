import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface LegendItem {
  id: string;
  label: string;
  color: string;
  icon?: string;
  count?: number;
}

interface MapLegendProps {
  className?: string;
}

const MapLegend = ({ className = '' }: MapLegendProps) => {
  const issueTypes: LegendItem[] = [
    { id: 'infrastructure', label: 'Infrastructure', color: 'bg-red-500', icon: 'WrenchScrewdriverIcon', count: 45 },
    { id: 'environment', label: 'Environment', color: 'bg-green-500', icon: 'GlobeAmericasIcon', count: 32 },
    { id: 'safety', label: 'Public Safety', color: 'bg-yellow-500', icon: 'ShieldExclamationIcon', count: 28 },
    { id: 'utilities', label: 'Utilities', color: 'bg-blue-500', icon: 'BoltIcon', count: 19 },
    { id: 'transportation', label: 'Transportation', color: 'bg-purple-500', icon: 'TruckIcon', count: 15 },
    { id: 'community', label: 'Community Services', color: 'bg-pink-500', icon: 'BuildingLibraryIcon', count: 12 }
  ];

  const statusTypes: LegendItem[] = [
    { id: 'reported', label: 'Reported', color: 'border-red-400', icon: 'ExclamationCircleIcon' },
    { id: 'in-progress', label: 'In Progress', color: 'border-yellow-400', icon: 'ClockIcon' },
    { id: 'resolved', label: 'Resolved', color: 'border-green-400', icon: 'CheckCircleIcon' },
    { id: 'verified', label: 'Verified', color: 'border-blue-400', icon: 'ShieldCheckIcon' }
  ];

  return (
    <div className={`bg-card border border-border rounded-lg civic-shadow ${className}`}>
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="MapIcon" size={20} className="text-primary" />
          <h3 className="font-semibold text-foreground">Map Legend</h3>
        </div>

        {/* Issue Types */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-text-secondary mb-3 uppercase tracking-wider">
            Issue Types
          </h4>
          <div className="space-y-2">
            {issueTypes.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
                  <div className="flex items-center space-x-2">
                    <Icon name={item.icon as any} size={14} className="text-text-secondary" />
                    <span className="text-sm text-foreground">{item.label}</span>
                  </div>
                </div>
                <span className="text-xs text-text-secondary bg-muted px-2 py-1 rounded-full">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Status Indicators */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-text-secondary mb-3 uppercase tracking-wider">
            Status Indicators
          </h4>
          <div className="space-y-2">
            {statusTypes.map((item) => (
              <div key={item.id} className="flex items-center space-x-3">
                <div className={`w-4 h-4 border-2 rounded ${item.color} bg-white`}></div>
                <div className="flex items-center space-x-2">
                  <Icon name={item.icon as any} size={14} className="text-text-secondary" />
                  <span className="text-sm text-foreground">{item.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Heat Map Scale */}
        <div>
          <h4 className="text-sm font-medium text-text-secondary mb-3 uppercase tracking-wider">
            Engagement Level
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-text-secondary">
              <span>Low</span>
              <span>High</span>
            </div>
            <div className="h-3 bg-gradient-to-r from-blue-200 via-yellow-300 to-red-500 rounded-full"></div>
            <div className="flex items-center space-x-2 text-xs text-text-secondary">
              <Icon name="FireIcon" size={12} />
              <span>Community activity density</span>
            </div>
          </div>
        </div>

        {/* Map Controls Info */}
        <div className="mt-6 pt-4 border-t border-border">
          <h4 className="text-sm font-medium text-text-secondary mb-2 uppercase tracking-wider">
            Controls
          </h4>
          <div className="space-y-1 text-xs text-text-secondary">
            <div className="flex items-center space-x-2">
              <Icon name="MagnifyingGlassPlusIcon" size={12} />
              <span>Click to zoom in</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="CursorArrowRaysIcon" size={12} />
              <span>Drag to pan</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="MapPinIcon" size={12} />
              <span>Click markers for details</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapLegend;