'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface FilterOptions {
  issueTypes: string[];
  statuses: string[];
  departments: string[];
  dateRange: string;
}

interface MapFiltersProps {
  onFiltersChange: (filters: FilterOptions) => void;
  activeFilters: FilterOptions;
}

const MapFilters = ({ onFiltersChange, activeFilters }: MapFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const issueTypes = [
    { id: 'infrastructure', label: 'Infrastructure', color: 'bg-red-500' },
    { id: 'environment', label: 'Environment', color: 'bg-green-500' },
    { id: 'safety', label: 'Public Safety', color: 'bg-yellow-500' },
    { id: 'utilities', label: 'Utilities', color: 'bg-blue-500' },
    { id: 'transportation', label: 'Transportation', color: 'bg-purple-500' },
    { id: 'community', label: 'Community Services', color: 'bg-pink-500' }
  ];

  const statuses = [
    { id: 'reported', label: 'Reported', icon: 'ExclamationCircleIcon' },
    { id: 'in-progress', label: 'In Progress', icon: 'ClockIcon' },
    { id: 'resolved', label: 'Resolved', icon: 'CheckCircleIcon' },
    { id: 'verified', label: 'Verified', icon: 'ShieldCheckIcon' }
  ];

  const departments = [
    'Public Works',
    'Environmental Services',
    'Transportation',
    'Parks & Recreation',
    'Public Safety',
    'Utilities'
  ];

  const dateRanges = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' },
    { value: '1y', label: 'Last year' },
    { value: 'all', label: 'All time' }
  ];

  const handleFilterChange = (filterType: keyof FilterOptions, value: string) => {
    const newFilters = { ...activeFilters };
    
    if (filterType === 'dateRange') {
      newFilters.dateRange = value;
    } else {
      const currentArray = newFilters[filterType] as string[];
      if (currentArray.includes(value)) {
        newFilters[filterType] = currentArray.filter(item => item !== value);
      } else {
        newFilters[filterType] = [...currentArray, value];
      }
    }
    
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    onFiltersChange({
      issueTypes: [],
      statuses: [],
      departments: [],
      dateRange: '30d'
    });
  };

  const getActiveFilterCount = () => {
    return activeFilters.issueTypes.length + 
           activeFilters.statuses.length + 
           activeFilters.departments.length;
  };

  return (
    <div className="bg-card border border-border rounded-lg civic-shadow">
      {/* Filter Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="FunnelIcon" size={20} className="text-primary" />
          <h3 className="font-semibold text-foreground">Filters</h3>
          {getActiveFilterCount() > 0 && (
            <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
              {getActiveFilterCount()}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {getActiveFilterCount() > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-text-secondary hover:text-foreground civic-transition"
            >
              Clear All
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-civic text-text-secondary hover:text-foreground hover:bg-muted civic-transition"
          >
            <Icon name={isExpanded ? 'ChevronUpIcon' : 'ChevronDownIcon'} size={16} />
          </button>
        </div>
      </div>

      {/* Filter Content */}
      {isExpanded && (
        <div className="p-4 space-y-6">
          {/* Issue Types */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Issue Types</h4>
            <div className="grid grid-cols-2 gap-2">
              {issueTypes.map((type) => (
                <label
                  key={type.id}
                  className="flex items-center space-x-2 p-2 rounded-civic hover:bg-muted cursor-pointer civic-transition"
                >
                  <input
                    type="checkbox"
                    checked={activeFilters.issueTypes.includes(type.id)}
                    onChange={() => handleFilterChange('issueTypes', type.id)}
                    className="rounded border-border text-primary focus:ring-primary"
                  />
                  <div className={`w-3 h-3 rounded-full ${type.color}`}></div>
                  <span className="text-sm text-foreground">{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Status</h4>
            <div className="grid grid-cols-2 gap-2">
              {statuses.map((status) => (
                <label
                  key={status.id}
                  className="flex items-center space-x-2 p-2 rounded-civic hover:bg-muted cursor-pointer civic-transition"
                >
                  <input
                    type="checkbox"
                    checked={activeFilters.statuses.includes(status.id)}
                    onChange={() => handleFilterChange('statuses', status.id)}
                    className="rounded border-border text-primary focus:ring-primary"
                  />
                  <Icon name={status.icon as any} size={16} className="text-text-secondary" />
                  <span className="text-sm text-foreground">{status.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Departments */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Departments</h4>
            <div className="space-y-1">
              {departments.map((dept) => (
                <label
                  key={dept}
                  className="flex items-center space-x-2 p-2 rounded-civic hover:bg-muted cursor-pointer civic-transition"
                >
                  <input
                    type="checkbox"
                    checked={activeFilters.departments.includes(dept)}
                    onChange={() => handleFilterChange('departments', dept)}
                    className="rounded border-border text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-foreground">{dept}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Time Period</h4>
            <select
              value={activeFilters.dateRange}
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
              className="w-full p-2 border border-border rounded-civic bg-input text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {dateRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapFilters;