'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface MapLayer {
  id: string;
  name: string;
  icon: string;
  enabled: boolean;
  description: string;
}

interface MapControlsProps {
  onLayerToggle: (layerId: string) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  onToggleHeatmap: () => void;
  isHeatmapEnabled: boolean;
  className?: string;
}

const MapControls = ({
  onLayerToggle,
  onZoomIn,
  onZoomOut,
  onResetView,
  onToggleHeatmap,
  isHeatmapEnabled,
  className = ''
}: MapControlsProps) => {
  const [isLayersExpanded, setIsLayersExpanded] = useState(false);
  
  const [layers, setLayers] = useState<MapLayer[]>([
    { id: 'issues', name: 'Issue Markers', icon: 'MapPinIcon', enabled: true, description: 'Show all reported issues' },
    { id: 'boundaries', name: 'Neighborhoods', icon: 'Square3Stack3DIcon', enabled: true, description: 'Neighborhood boundaries' },
    { id: 'traffic', name: 'Traffic Data', icon: 'TruckIcon', enabled: false, description: 'Real-time traffic information' },
    { id: 'utilities', name: 'Utilities', icon: 'BoltIcon', enabled: false, description: 'Utility infrastructure' },
    { id: 'safety', name: 'Public Safety', icon: 'ShieldCheckIcon', enabled: false, description: 'Safety zones and cameras' },
    { id: 'construction', name: 'Construction', icon: 'WrenchScrewdriverIcon', enabled: true, description: 'Active construction zones' }
  ]);

  const handleLayerToggle = (layerId: string) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId ? { ...layer, enabled: !layer.enabled } : layer
    ));
    onLayerToggle(layerId);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Zoom Controls */}
      <div className="bg-card border border-border rounded-lg civic-shadow">
        <div className="p-3">
          <div className="flex flex-col space-y-2">
            <button
              onClick={onZoomIn}
              className="flex items-center justify-center w-10 h-10 rounded-civic text-foreground hover:bg-muted civic-transition"
              title="Zoom In"
            >
              <Icon name="PlusIcon" size={20} />
            </button>
            <button
              onClick={onZoomOut}
              className="flex items-center justify-center w-10 h-10 rounded-civic text-foreground hover:bg-muted civic-transition"
              title="Zoom Out"
            >
              <Icon name="MinusIcon" size={20} />
            </button>
            <div className="border-t border-border my-1"></div>
            <button
              onClick={onResetView}
              className="flex items-center justify-center w-10 h-10 rounded-civic text-foreground hover:bg-muted civic-transition"
              title="Reset View"
            >
              <Icon name="HomeIcon" size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Layer Controls */}
      <div className="bg-card border border-border rounded-lg civic-shadow">
        <div className="p-3">
          <button
            onClick={() => setIsLayersExpanded(!isLayersExpanded)}
            className="flex items-center justify-between w-full text-left"
          >
            <div className="flex items-center space-x-2">
              <Icon name="Squares2X2Icon" size={18} className="text-primary" />
              <span className="text-sm font-medium text-foreground">Layers</span>
            </div>
            <Icon 
              name={isLayersExpanded ? 'ChevronUpIcon' : 'ChevronDownIcon'} 
              size={16} 
              className="text-text-secondary" 
            />
          </button>

          {isLayersExpanded && (
            <div className="mt-3 space-y-2">
              {layers.map((layer) => (
                <label
                  key={layer.id}
                  className="flex items-start space-x-2 p-2 rounded-civic hover:bg-muted cursor-pointer civic-transition"
                  title={layer.description}
                >
                  <input
                    type="checkbox"
                    checked={layer.enabled}
                    onChange={() => handleLayerToggle(layer.id)}
                    className="mt-0.5 rounded border-border text-primary focus:ring-primary"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <Icon name={layer.icon as any} size={14} className="text-text-secondary" />
                      <span className="text-sm text-foreground">{layer.name}</span>
                    </div>
                    <p className="text-xs text-text-secondary mt-0.5">{layer.description}</p>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Heat Map Toggle */}
      <div className="bg-card border border-border rounded-lg civic-shadow">
        <div className="p-3">
          <button
            onClick={onToggleHeatmap}
            className={`flex items-center space-x-2 w-full p-2 rounded-civic civic-transition ${
              isHeatmapEnabled 
                ? 'bg-primary text-primary-foreground' 
                : 'text-foreground hover:bg-muted'
            }`}
          >
            <Icon name="FireIcon" size={18} />
            <span className="text-sm font-medium">Heat Map</span>
          </button>
          <p className="text-xs text-text-secondary mt-2 px-2">
            Shows engagement density across neighborhoods
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-lg civic-shadow">
        <div className="p-3">
          <h4 className="text-sm font-medium text-foreground mb-2">Quick Actions</h4>
          <div className="space-y-1">
            <button className="flex items-center space-x-2 w-full p-2 rounded-civic text-foreground hover:bg-muted civic-transition text-left">
              <Icon name="PlusCircleIcon" size={16} className="text-accent" />
              <span className="text-sm">Report Issue</span>
            </button>
            <button className="flex items-center space-x-2 w-full p-2 rounded-civic text-foreground hover:bg-muted civic-transition text-left">
              <Icon name="MagnifyingGlassIcon" size={16} className="text-blue-500" />
              <span className="text-sm">Search Location</span>
            </button>
            <button className="flex items-center space-x-2 w-full p-2 rounded-civic text-foreground hover:bg-muted civic-transition text-left">
              <Icon name="ShareIcon" size={16} className="text-purple-500" />
              <span className="text-sm">Share Map</span>
            </button>
          </div>
        </div>
      </div>

      {/* Map Info */}
      <div className="bg-card border border-border rounded-lg civic-shadow">
        <div className="p-3">
          <div className="text-center">
            <div className="text-xs text-text-secondary mb-1">Last Updated</div>
            <div className="text-sm font-medium text-foreground">
              {new Date().toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapControls;