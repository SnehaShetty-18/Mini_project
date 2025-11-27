'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

interface QuickReportOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  category: string;
}

interface InstantReportLauncherProps {
  className?: string;
}

const InstantReportLauncher = ({ className = '' }: InstantReportLauncherProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const quickReportOptions: QuickReportOption[] = [
    {
      id: 'pothole',
      title: 'Pothole',
      description: 'Road damage affecting traffic',
      icon: 'ExclamationTriangleIcon',
      color: 'bg-warning',
      category: 'roads'
    },
    {
      id: 'streetlight',
      title: 'Broken Streetlight',
      description: 'Non-functioning street lighting',
      icon: 'LightBulbIcon',
      color: 'bg-accent',
      category: 'lighting'
    },
    {
      id: 'water-leak',
      title: 'Water Leak',
      description: 'Water main or pipe issues',
      icon: 'BeakerIcon',
      color: 'bg-primary',
      category: 'utilities'
    },
    {
      id: 'graffiti',
      title: 'Graffiti/Vandalism',
      description: 'Property damage or defacement',
      icon: 'PaintBrushIcon',
      color: 'bg-error',
      category: 'vandalism'
    },
    {
      id: 'traffic',
      title: 'Traffic Signal',
      description: 'Malfunctioning traffic controls',
      icon: 'SignalIcon',
      color: 'bg-warning',
      category: 'traffic'
    },
    {
      id: 'waste',
      title: 'Waste Management',
      description: 'Garbage or recycling issues',
      icon: 'TrashIcon',
      color: 'bg-success',
      category: 'waste'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'roads', label: 'Roads & Infrastructure' },
    { id: 'lighting', label: 'Street Lighting' },
    { id: 'utilities', label: 'Utilities' },
    { id: 'traffic', label: 'Traffic & Transportation' },
    { id: 'vandalism', label: 'Vandalism & Safety' },
    { id: 'waste', label: 'Waste Management' }
  ];

  const filteredOptions = selectedCategory === 'all' 
    ? quickReportOptions 
    : quickReportOptions.filter(option => option.category === selectedCategory);

  return (
    <section className={`py-16 bg-gradient-to-br from-primary/5 to-accent/5 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Report Issues Instantly
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-8">
            AI-powered reporting makes civic engagement effortless. Choose from common issues or create a custom report with intelligent assistance.
          </p>
          
          {/* Primary CTA */}
          <Link
            href="/smart-reporting-center"
            className="inline-flex items-center space-x-3 bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-4 rounded-civic text-lg font-semibold civic-transition civic-hover"
          >
            <Icon name="PlusIcon" size={24} />
            <span>Start New Report</span>
            <Icon name="ArrowRightIcon" size={20} />
          </Link>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-civic text-sm font-medium civic-transition ${
                selectedCategory === category.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card text-foreground hover:bg-muted border border-border'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Quick Report Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredOptions.map((option) => (
            <Link
              key={option.id}
              href={`/smart-reporting-center?type=${option.id}`}
              className="bg-card rounded-civic-lg p-6 civic-shadow border border-border hover:civic-shadow-lg civic-transition group"
            >
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 ${option.color} rounded-civic flex items-center justify-center flex-shrink-0 group-hover:scale-110 civic-transition`}>
                  <Icon name={option.icon as any} size={24} className="text-white" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary civic-transition">
                    {option.title}
                  </h3>
                  <p className="text-sm text-text-secondary mb-3">
                    {option.description}
                  </p>
                  
                  <div className="flex items-center space-x-2 text-sm text-accent">
                    <span>Quick Report</span>
                    <Icon name="ArrowRightIcon" size={16} className="group-hover:translate-x-1 civic-transition" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Features Highlight */}
        <div className="bg-card rounded-civic-xl p-8 civic-shadow border border-border">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              AI-Powered Reporting Features
            </h3>
            <p className="text-text-secondary">
              Experience the future of civic engagement with intelligent automation
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-civic-lg flex items-center justify-center mx-auto mb-4">
                <Icon name="CameraIcon" size={32} className="text-white" />
              </div>
              <h4 className="text-lg font-semibold text-foreground mb-2">Smart Image Analysis</h4>
              <p className="text-sm text-text-secondary">
                AI automatically identifies issue types, severity levels, and suggests optimal reporting categories from your photos.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-civic-lg flex items-center justify-center mx-auto mb-4">
                <Icon name="MapPinIcon" size={32} className="text-white" />
              </div>
              <h4 className="text-lg font-semibold text-foreground mb-2">GPS Integration</h4>
              <p className="text-sm text-text-secondary">
                Precise location detection with address validation ensures reports reach the right municipal departments instantly.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-success rounded-civic-lg flex items-center justify-center mx-auto mb-4">
                <Icon name="BoltIcon" size={32} className="text-white" />
              </div>
              <h4 className="text-lg font-semibold text-foreground mb-2">Instant Prioritization</h4>
              <p className="text-sm text-text-secondary">
                Machine learning algorithms assess urgency and route reports to appropriate authorities for fastest resolution.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Link
              href="/smart-reporting-center"
              className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 font-medium civic-transition"
            >
              <span>Learn more about AI reporting</span>
              <Icon name="ArrowRightIcon" size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InstantReportLauncher;