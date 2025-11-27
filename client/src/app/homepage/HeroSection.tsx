import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

interface HeroSectionProps {
  className?: string;
}

const HeroSection = ({ className = '' }: HeroSectionProps) => {
  return (
    <section className={`relative bg-gradient-to-br from-primary via-brand-primary to-secondary overflow-hidden ${className}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-48 -translate-y-48"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-white rounded-full translate-x-40 translate-y-40"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Your Voice,{' '}
              <span className="text-accent">Amplified</span>{' '}
              by Intelligence
            </h1>
            
            <p className="mt-6 text-xl text-blue-100 max-w-2xl">
              Transform your community through AI-powered civic engagement. Report issues instantly, track progress transparently, and build stronger neighborhoods together.
            </p>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/smart-reporting-center"
                className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-4 rounded-civic text-lg font-semibold civic-transition civic-hover inline-flex items-center justify-center space-x-2"
              >
                <Icon name="PlusIcon" size={20} />
                <span>Report Issue Now</span>
              </Link>
              
              <Link
                href="/community-impact-map"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-civic text-lg font-semibold civic-transition inline-flex items-center justify-center space-x-2"
              >
                <Icon name="MapIcon" size={20} />
                <span>Explore Community</span>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-6 text-center lg:text-left">
              <div>
                <div className="text-3xl font-bold text-white">2,847</div>
                <div className="text-blue-100 text-sm">Issues Resolved</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">94%</div>
                <div className="text-blue-100 text-sm">Satisfaction Rate</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">12k+</div>
                <div className="text-blue-100 text-sm">Active Citizens</div>
              </div>
            </div>
          </div>
          
          {/* Visual */}
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-civic-xl p-8 border border-white/20">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-accent rounded-full"></div>
                  <div className="text-white text-sm">AI analyzing community reports...</div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-warning rounded-full"></div>
                  <div className="text-white text-sm">Prioritizing urgent infrastructure needs</div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-success rounded-full"></div>
                  <div className="text-white text-sm">Connecting citizens with authorities</div>
                </div>
              </div>
              
              <div className="mt-6 bg-white/5 rounded-civic p-4">
                <div className="text-white text-xs font-medium mb-2">Real-time Impact</div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-100 text-sm">Response Time</span>
                  <span className="text-accent font-semibold">2.3 hrs avg</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;