'use client';

import React, { useState, useEffect } from 'react';
import HeroSection from './HeroSection';
import CityHealthDashboard from './CityHealthDashboard';
import TrendingIssuesMap from './TrendingIssuesMap';
import SuccessStoriesCarousel from './SuccessStoriesCarousel';
import InstantReportLauncher from './InstantReportLauncher';
import SocialProofSection from './SocialProofSection';

interface HomepageInteractiveProps {
  className?: string;
}

const HomepageInteractive = ({ className = '' }: HomepageInteractiveProps) => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className={`min-h-screen bg-background ${className}`}>
        {/* Static content that matches server render */}
        <HeroSection />
        <CityHealthDashboard />
        <div className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4">Loading Interactive Content...</h2>
            </div>
          </div>
        </div>
        <InstantReportLauncher />
        <SocialProofSection />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-background ${className}`}>
      <HeroSection />
      <CityHealthDashboard />
      <TrendingIssuesMap />
      <SuccessStoriesCarousel />
      <InstantReportLauncher />
      <SocialProofSection />
    </div>
  );
};

export default HomepageInteractive;