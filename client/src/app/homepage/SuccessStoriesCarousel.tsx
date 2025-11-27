'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface SuccessStory {
  id: string;
  title: string;
  description: string;
  beforeImage: string;
  afterImage: string;
  beforeAlt: string;
  afterAlt: string;
  location: string;
  reportDate: string;
  resolvedDate: string;
  impact: {
    citizensHelped: number;
    costSaved: string;
    timeToResolve: string;
  };
  category: string;
}

interface SuccessStoriesCarouselProps {
  className?: string;
}

const SuccessStoriesCarousel = ({ className = '' }: SuccessStoriesCarouselProps) => {
  const [currentStory, setCurrentStory] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const successStories: SuccessStory[] = [
  {
    id: '1',
    title: 'Major Pothole Repair Transforms Downtown',
    description: 'Community reported dangerous pothole cluster that was causing vehicle damage and safety concerns. AI prioritization led to rapid response and comprehensive road resurfacing.',
    beforeImage: "https://images.unsplash.com/photo-1728340964368-59c3192e44e6",
    afterImage: "https://images.unsplash.com/photo-1728340964368-59c3192e44e6",
    beforeAlt: 'Large dangerous pothole on busy downtown street with visible damage to asphalt',
    afterAlt: 'Smooth newly paved road surface with fresh yellow lane markings in downtown area',
    location: 'Main Street & 5th Avenue',
    reportDate: '2024-10-15',
    resolvedDate: '2024-10-22',
    impact: {
      citizensHelped: 2400,
      costSaved: '$15,000',
      timeToResolve: '7 days'
    },
    category: 'Infrastructure'
  },
  {
    id: '2',
    title: 'Broken Streetlight Creates Safer Neighborhood',
    description: 'Residents reported multiple broken streetlights creating safety concerns. Smart routing connected the issue to nearby crime reports, prioritizing immediate repair.',
    beforeImage: "https://images.unsplash.com/photo-1707746449107-cfe5e6d833fe",
    afterImage: "https://images.unsplash.com/photo-1707746449107-cfe5e6d833fe",
    beforeAlt: 'Dark residential street at night with broken streetlight and poor visibility',
    afterAlt: 'Well-lit residential street at night with bright LED streetlight illuminating sidewalk',
    location: 'Oak Street Residential Area',
    reportDate: '2024-10-20',
    resolvedDate: '2024-10-23',
    impact: {
      citizensHelped: 850,
      costSaved: '$3,200',
      timeToResolve: '3 days'
    },
    category: 'Safety'
  },
  {
    id: '3',
    title: 'Park Restoration Brings Community Together',
    description: 'Citizens reported vandalism and neglect at local park. Community engagement tools mobilized volunteers while city provided resources for comprehensive restoration.',
    beforeImage: "https://images.unsplash.com/photo-1728934272418-dc3f286b2afa",
    afterImage: "https://images.unsplash.com/photo-1728934272418-dc3f286b2afa",
    beforeAlt: 'Neglected park with graffiti on benches, overgrown grass and scattered litter',
    afterAlt: 'Beautiful restored park with clean benches, manicured lawn and families enjoying the space',
    location: 'Riverside Community Park',
    reportDate: '2024-09-28',
    resolvedDate: '2024-10-25',
    impact: {
      citizensHelped: 1200,
      costSaved: '$8,500',
      timeToResolve: '27 days'
    },
    category: 'Recreation'
  }];


  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentStory((prev) => (prev + 1) % successStories.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, successStories.length]);

  const nextStory = () => {
    setCurrentStory((prev) => (prev + 1) % successStories.length);
    setIsAutoPlaying(false);
  };

  const prevStory = () => {
    setCurrentStory((prev) => (prev - 1 + successStories.length) % successStories.length);
    setIsAutoPlaying(false);
  };

  const goToStory = (index: number) => {
    setCurrentStory(index);
    setIsAutoPlaying(false);
  };

  const story = successStories[currentStory];

  return (
    <section className={`py-16 bg-card ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Success Stories
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Real transformations happening in our community through AI-powered civic engagement and collaborative problem-solving.
          </p>
        </div>

        <div className="relative">
          {/* Main Story Display */}
          <div className="bg-surface rounded-civic-xl overflow-hidden civic-shadow-lg">
            <div className="grid lg:grid-cols-2 gap-8 p-8">
              {/* Content */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <span className="bg-success text-success-foreground px-3 py-1 rounded-civic text-sm font-medium">
                    {story.category}
                  </span>
                  <span className="text-sm text-text-secondary">
                    Resolved in {story.impact.timeToResolve}
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold text-foreground">
                  {story.title}
                </h3>
                
                <p className="text-text-secondary leading-relaxed">
                  {story.description}
                </p>
                
                <div className="flex items-center space-x-2 text-sm text-text-secondary">
                  <Icon name="MapPinIcon" size={16} />
                  <span>{story.location}</span>
                </div>
                
                {/* Impact Metrics */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">{story.impact.citizensHelped.toLocaleString()}</div>
                    <div className="text-xs text-text-secondary">Citizens Helped</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success">{story.impact.costSaved}</div>
                    <div className="text-xs text-text-secondary">Cost Saved</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{story.impact.timeToResolve}</div>
                    <div className="text-xs text-text-secondary">Resolution Time</div>
                  </div>
                </div>
              </div>
              
              {/* Before/After Images */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-foreground">Before</div>
                    <div className="relative h-40 rounded-civic overflow-hidden">
                      <AppImage
                        src={story.beforeImage}
                        alt={story.beforeAlt}
                        className="w-full h-full object-cover" />

                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-foreground">After</div>
                    <div className="relative h-40 rounded-civic overflow-hidden">
                      <AppImage
                        src={story.afterImage}
                        alt={story.afterAlt}
                        className="w-full h-full object-cover" />

                    </div>
                  </div>
                </div>
                
                <div className="bg-accent/10 rounded-civic p-4 border border-accent/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="CalendarIcon" size={16} className="text-accent" />
                    <span className="text-sm font-medium text-foreground">Timeline</span>
                  </div>
                  <div className="text-sm text-text-secondary">
                    Reported: {new Date(story.reportDate).toLocaleDateString()}<br />
                    Resolved: {new Date(story.resolvedDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={prevStory}
              className="flex items-center space-x-2 px-4 py-2 bg-card hover:bg-muted border border-border rounded-civic civic-transition">

              <Icon name="ChevronLeftIcon" size={20} />
              <span>Previous</span>
            </button>
            
            {/* Dots Indicator */}
            <div className="flex space-x-2">
              {successStories.map((_, index) =>
              <button
                key={index}
                onClick={() => goToStory(index)}
                className={`w-3 h-3 rounded-full civic-transition ${
                index === currentStory ? 'bg-primary' : 'bg-border hover:bg-muted'}`
                } />

              )}
            </div>
            
            <button
              onClick={nextStory}
              className="flex items-center space-x-2 px-4 py-2 bg-card hover:bg-muted border border-border rounded-civic civic-transition">

              <span>Next</span>
              <Icon name="ChevronRightIcon" size={20} />
            </button>
          </div>

          {/* Auto-play Control */}
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="flex items-center space-x-2 px-3 py-1 text-sm text-text-secondary hover:text-foreground civic-transition">

              <Icon name={isAutoPlaying ? 'PauseIcon' : 'PlayIcon'} size={16} />
              <span>{isAutoPlaying ? 'Pause' : 'Play'} Auto-advance</span>
            </button>
          </div>
        </div>
      </div>
    </section>);

};

export default SuccessStoriesCarousel;