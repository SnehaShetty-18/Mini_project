'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  action: string;
}

interface QuickActionsProps {
  actions: QuickAction[];
}

const QuickActions = ({ actions }: QuickActionsProps) => {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  const handleActionClick = (actionId: string, actionType: string) => {
    setSelectedAction(actionId);
    
    // Simulate action execution
    setTimeout(() => {
      setSelectedAction(null);
      // In a real app, this would trigger the actual action
      console.log(`Executing action: ${actionType}`);
    }, 1000);
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
        <p className="text-sm text-text-secondary mt-1">Streamline common municipal tasks</p>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={() => handleActionClick(action.id, action.action)}
              disabled={selectedAction === action.id}
              className={`p-4 border border-border rounded-lg text-left hover:civic-shadow civic-transition group ${
                selectedAction === action.id ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${action.color} group-hover:scale-105 civic-transition`}>
                  {selectedAction === action.id ? (
                    <Icon name="ArrowPathIcon" size={20} className="text-white animate-spin" />
                  ) : (
                    <Icon name={action.icon as any} size={20} className="text-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-foreground mb-1 group-hover:text-primary civic-transition">
                    {action.title}
                  </h4>
                  <p className="text-xs text-text-secondary line-clamp-2">
                    {action.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickActions;