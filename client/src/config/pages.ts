import { Metadata } from 'next';

export interface PageConfig {
  route: string;
  title: string;
  description: string;
}

export const pagesConfig: Record<string, PageConfig> = {
  homepage: {
    route: '/homepage',
    title: 'Homepage - Civic AI Connect',
    description: 'Transform your community through AI-powered civic engagement. Report issues instantly, track progress transparently, and build stronger neighborhoods together with intelligent automation.',
  },
  'smart-reporting-center': {
    route: '/smart-reporting-center',
    title: 'Smart Reporting Center - Civic AI Connect',
    description: 'AI-powered civic issue reporting with intelligent image recognition, voice-to-text functionality, GPS integration, and automated classification for efficient municipal problem resolution.',
  },
  'community-impact-map': {
    route: '/community-impact-map',
    title: 'Community Impact Map - Civic AI Connect',
    description: 'Interactive visualization of civic issues, resolutions, and neighborhood engagement levels with real-time tracking and community metrics.',
  },
  'progress-tracker': {
    route: '/progress-tracker',
    title: 'Progress Tracker - Civic AI Connect',
    description: 'Track the transparent journey from issue report to resolution with real-time updates, predictive timelines, and municipal accountability metrics.',
  },
  'authority-portal': {
    route: '/authority-portal',
    title: 'Authority Portal - Civic AI Connect',
    description: 'Municipal dashboard for workflow automation and performance insights. Manage civic issues, track department performance, and optimize resource allocation.',
  },
};

export const generatePageMetadata = (pageKey: string): Metadata => {
  const config = pagesConfig[pageKey];
  if (!config) {
    return {
      title: 'Civic AI Connect',
      description: 'AI-powered civic engagement platform',
    };
  }

  return {
    title: config.title,
    description: config.description,
  };
};
