'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import { primaryNavItems, secondaryNavItems } from '@/config/navigation';

interface HeaderProps {
  className?: string;
}

const Header = ({ className = '' }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActivePath = (href: string) => pathname === href;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className={`bg-card border-b border-border sticky top-0 z-50 ${className}`}>
      <div className="w-full">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/homepage" className="flex items-center space-x-3 civic-transition hover:opacity-80">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-brand-primary rounded-lg flex items-center justify-center">
                <Icon name="BuildingLibraryIcon" size={20} className="text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-foreground">Civic AI Connect</h1>
                <p className="text-xs text-text-secondary">Intelligent Civic Transparency</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {primaryNavItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-2 px-3 py-2 rounded-civic text-sm font-medium civic-transition ${
                  isActivePath(item.href)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon name={item.icon as any} size={16} />
                <span>{item.name}</span>
              </Link>
            ))}
            
            {/* More Menu */}
            <div className="relative group">
              <button className="flex items-center space-x-2 px-3 py-2 rounded-civic text-sm font-medium text-foreground hover:bg-muted civic-transition">
                <Icon name="EllipsisHorizontalIcon" size={16} />
                <span>More</span>
              </button>
              
              <div className="absolute right-0 top-full mt-1 w-48 bg-popover border border-border rounded-civic-lg civic-shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible civic-transition">
                {secondaryNavItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-2 px-4 py-3 text-sm hover:bg-muted civic-transition first:rounded-t-civic-lg last:rounded-b-civic-lg ${
                      isActivePath(item.href) ? 'bg-accent text-accent-foreground' : 'text-popover-foreground'
                    }`}
                  >
                    <Icon name={item.icon as any} size={16} />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          {/* Admin Access Button */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              href="/auth/login/admin-login"
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-4 py-2 rounded-civic text-sm font-semibold civic-transition civic-hover"
            >
              Admin
            </Link>
            
            {/* CTA Button */}
            <Link
              href="/smart-reporting-center"
              className="bg-accent hover:bg-accent/90 text-accent-foreground px-4 py-2 rounded-civic text-sm font-semibold civic-transition civic-hover"
            >
              Report Issue
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 rounded-civic text-foreground hover:bg-muted civic-transition"
            aria-label="Toggle mobile menu"
          >
            <Icon name={isMobileMenuOpen ? 'XMarkIcon' : 'Bars3Icon'} size={24} />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-card">
            <div className="px-4 py-2 space-y-1">
              {primaryNavItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-civic text-sm font-medium civic-transition ${
                    isActivePath(item.href)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon name={item.icon as any} size={18} />
                  <span>{item.name}</span>
                </Link>
              ))}
              
              {secondaryNavItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-civic text-sm font-medium civic-transition ${
                    isActivePath(item.href)
                      ? 'bg-accent text-accent-foreground'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon name={item.icon as any} size={18} />
                  <span>{item.name}</span>
                </Link>
              ))}
              
              <div className="pt-2 mt-2 border-t border-border space-y-2">
                <Link
                  href="/auth/login/admin-login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground px-4 py-3 rounded-civic text-sm font-semibold text-center civic-transition"
                >
                  Admin Access
                </Link>
                
                <Link
                  href="/smart-reporting-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full bg-accent hover:bg-accent/90 text-accent-foreground px-4 py-3 rounded-civic text-sm font-semibold text-center civic-transition"
                >
                  Report Issue
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;