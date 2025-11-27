'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import { navigationConfig, quickActionsConfig } from '@/config/navigation';

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
  className?: string;
}

const Sidebar = ({ isCollapsed = false, onToggle, className = '' }: SidebarProps) => {
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const isActivePath = (href: string) => pathname === href;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 ${className}`}>
        <div className={`flex flex-col bg-card border-r border-border civic-transition-all duration-300 ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}>
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-border">
            {!isCollapsed && (
              <Link href="/homepage" className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-brand-primary rounded-lg flex items-center justify-center">
                  <Icon name="BuildingLibraryIcon" size={20} className="text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-foreground">Civic AI</h1>
                  <p className="text-xs text-text-secondary">Connect</p>
                </div>
              </Link>
            )}
            
            {isCollapsed && (
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-brand-primary rounded-lg flex items-center justify-center mx-auto">
                <Icon name="BuildingLibraryIcon" size={20} className="text-white" />
              </div>
            )}
            
            {onToggle && (
              <button
                onClick={onToggle}
                className="p-1.5 rounded-civic text-text-secondary hover:text-foreground hover:bg-muted civic-transition"
                aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                <Icon name={isCollapsed ? 'ChevronRightIcon' : 'ChevronLeftIcon'} size={16} />
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            <div className={`${isCollapsed ? 'text-center' : ''} mb-4`}>
              {!isCollapsed && (
                <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-wider px-3 mb-2">
                  Navigation
                </h2>
              )}
              
              {navigationConfig.map((item) => (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => setHoveredItem(item.name)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <Link
                    href={item.href}
                    className={`flex items-center px-3 py-2.5 rounded-civic text-sm font-medium civic-transition group ${
                      isActivePath(item.href)
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-muted hover:text-foreground'
                    } ${isCollapsed ? 'justify-center' : 'space-x-3'}`}
                  >
                    <Icon name={item.icon as any} size={18} />
                    {!isCollapsed && <span>{item.name}</span>}
                  </Link>
                  
                  {/* Tooltip for collapsed state */}
                  {isCollapsed && hoveredItem === item.name && (
                    <div className="absolute left-full top-0 ml-2 px-3 py-2 bg-popover border border-border rounded-civic-lg civic-shadow-lg z-50 whitespace-nowrap">
                      <div className="text-sm font-medium text-popover-foreground">{item.name}</div>
                      <div className="text-xs text-text-secondary">{item.description}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className={`${isCollapsed ? 'text-center' : ''} pt-4 border-t border-border`}>
              {!isCollapsed && (
                <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-wider px-3 mb-2">
                  Quick Actions
                </h2>
              )}
              
              {quickActionsConfig.map((action) => (
                <button
                  key={action.name}
                  onClick={() => action.href ? window.location.href = action.href : action.action?.()}
                  className={`w-full flex items-center px-3 py-2.5 rounded-civic text-sm font-medium text-foreground hover:bg-muted civic-transition ${
                    isCollapsed ? 'justify-center' : 'space-x-3'
                  }`}
                >
                  <Icon name={action.icon as any} size={18} />
                  {!isCollapsed && <span>{action.name}</span>}
                </button>
              ))}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            {!isCollapsed ? (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                  <Icon name="UserIcon" size={16} className="text-accent-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">Community Member</p>
                  <p className="text-xs text-text-secondary truncate">Active Citizen</p>
                </div>
                <button className="p-1 rounded-civic text-text-secondary hover:text-foreground hover:bg-muted civic-transition">
                  <Icon name="EllipsisVerticalIcon" size={16} />
                </button>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                  <Icon name="UserIcon" size={16} className="text-accent-foreground" />
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      <div className="lg:hidden">
        {/* This would be implemented with a mobile menu state */}
      </div>
    </>
  );
};

export default Sidebar;