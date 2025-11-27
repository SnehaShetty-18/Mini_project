'use client';

import React from 'react';
import Link from 'next/link';
import MainLayout from '@/components/common/MainLayout';
import Icon from '@/components/ui/AppIcon';

export default function HomePage() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-primary via-brand-primary to-secondary">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-20 sm:py-28">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
              Civic Connect
            </h1>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Empowering communities to report, track, and resolve civic issues together. 
              Make your neighborhood better, one report at a time.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/report" 
                className="bg-white text-primary hover:bg-gray-100 px-8 py-4 rounded-civic font-semibold text-lg civic-transition civic-hover inline-flex items-center justify-center"
              >
                Report Issue Now
                <Icon name="ArrowRightIcon" size={20} className="ml-2" />
              </Link>
              
              <Link 
                href="/admin/login" 
                className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-4 rounded-civic font-semibold text-lg civic-transition civic-hover inline-flex items-center justify-center"
              >
                Admin Login
              </Link>
            </div>
          </div>
        </div>
        
        {/* Features Section */}
        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground mb-4">How Civic Connect Works</h2>
              <p className="text-text-secondary max-w-2xl mx-auto">
                A simple, transparent process to make your community better
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card border border-border rounded-civic-xl p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Icon name="PlusCircleIcon" size={32} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Report Issues</h3>
                <p className="text-text-secondary">
                  Easily report potholes, garbage overflow, streetlight issues, and other civic concerns with photos and location.
                </p>
              </div>
              
              <div className="bg-card border border-border rounded-civic-xl p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Icon name="ChartBarIcon" size={32} className="text-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Track Progress</h3>
                <p className="text-text-secondary">
                  Follow your reports through the resolution process with real-time status updates and transparency.
                </p>
              </div>
              
              <div className="bg-card border border-border rounded-civic-xl p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Icon name="UserGroupIcon" size={32} className="text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Community Impact</h3>
                <p className="text-text-secondary">
                  See what issues matter most to your neighbors and upvote concerns that affect you too.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Community Highlights */}
        <div className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground mb-4">Why Join Civic Connect?</h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white border border-border rounded-civic p-6">
                <div className="text-primary mb-3">
                  <Icon name="ArrowTrendingUpIcon" size={24} />
                </div>
                <h3 className="font-semibold mb-2">Live Status Tracking</h3>
                <p className="text-text-secondary text-sm">
                  Real-time updates on the progress of your reported issues
                </p>
              </div>
              
              <div className="bg-white border border-border rounded-civic p-6">
                <div className="text-primary mb-3">
                  <Icon name="HeartIcon" size={24} />
                </div>
                <h3 className="font-semibold mb-2">Community Upvotes</h3>
                <p className="text-text-secondary text-sm">
                  See which issues are most important to your neighbors
                </p>
              </div>
              
              <div className="bg-white border border-border rounded-civic p-6">
                <div className="text-primary mb-3">
                  <Icon name="LightBulbIcon" size={24} />
                </div>
                <h3 className="font-semibold mb-2">Transparency</h3>
                <p className="text-text-secondary text-sm">
                  Open communication between citizens and municipal authorities
                </p>
              </div>
              
              <div className="bg-white border border-border rounded-civic p-6">
                <div className="text-primary mb-3">
                  <Icon name="ShieldCheckIcon" size={24} />
                </div>
                <h3 className="font-semibold mb-2">Verified Reports</h3>
                <p className="text-text-secondary text-sm">
                  AI-powered classification ensures accurate issue categorization
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}