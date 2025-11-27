'use client';

import React, { useState, useEffect } from 'react';
import ProgressOverview from './ProgressOverview';
import IssueTimeline from './IssueTimeline';
import ActiveIssuesList from './ActiveIssuesList';
import PerformanceMetrics from './PerformanceMetrics';
import NotificationCenter from './NotificationCenter';
import Icon from '@/components/ui/AppIcon';
import { getIssuesDataService } from '@/services/issuesData';

interface ProgressTrackerInteractiveProps {}

const ProgressTrackerInteractive = ({}: ProgressTrackerInteractiveProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
  const [progressStats, setProgressStats] = useState<any>(null);
  const [allIssues, setAllIssues] = useState<any[]>([]);
  const [activeIssue, setActiveIssue] = useState<any>(null);
  const [timelineEvents, setTimelineEvents] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [departmentData, setDepartmentData] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [satisfactionTrend, setSatisfactionTrend] = useState<any[]>([]);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Load data when component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        const issuesService = getIssuesDataService();
        const stats = await issuesService.getStatistics();
        const issues = await issuesService.getAllIssues();
        const monthly = await issuesService.getMonthlyData();
        const deptData = await issuesService.getDepartmentData();
        const notifs = issuesService.getNotifications();
        
        setProgressStats(stats);
        setAllIssues(issues);
        setActiveIssue(issues[0]);
        setTimelineEvents(issues[0]?.timeline || []);
        setMonthlyData(monthly);
        setDepartmentData(deptData);
        setNotifications(notifs);
        
        // Generate satisfaction trend data
        const trend = monthly.map((data: any, index: number) => ({
          month: data.month,
          score: 85 + Math.floor(Math.random() * 15) // This would come from user ratings
        }));
        setSatisfactionTrend(trend);
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };
    
    loadData();
  }, []);

  // Helper function to format relative time
  const formatTimeAgo = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  // Helper function to format date
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };


  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background">
        <div className="animate-pulse space-y-6 p-6">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-64 bg-muted rounded-lg"></div>
              <div className="h-96 bg-muted rounded-lg"></div>
            </div>
            <div className="space-y-6">
              <div className="h-48 bg-muted rounded-lg"></div>
              <div className="h-64 bg-muted rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>);

  }

  const tabs = [
  { key: 'overview', label: 'Overview', icon: 'ChartBarIcon' },
  { key: 'issues', label: 'Active Issues', icon: 'ListBulletIcon' },
  { key: 'metrics', label: 'Performance', icon: 'ChartPieIcon' },
  { key: 'notifications', label: 'Notifications', icon: 'BellIcon' }];


  return (
    <div className="space-y-6">
      {/* Header with Tabs */}
      <div className="bg-card rounded-lg border border-border p-6 civic-shadow">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Progress Tracker</h1>
            <p className="text-text-secondary">Monitor issue resolution and municipal performance</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 px-4 py-2 bg-accent text-accent-foreground rounded-civic hover:bg-accent/90 civic-transition">
              <Icon name="PlusIcon" size={16} />
              <span>Report New Issue</span>
            </button>
            <button className="p-2 rounded-civic text-text-secondary hover:text-foreground hover:bg-muted civic-transition">
              <Icon name="ArrowPathIcon" size={20} />
            </button>
          </div>
        </div>

        <div className="flex space-x-1 bg-muted rounded-civic p-1">
          {tabs.map((tab) =>
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-civic civic-transition ${
            activeTab === tab.key ?
            'bg-card text-foreground civic-shadow' :
            'text-text-secondary hover:text-foreground'}`
            }>

              <Icon name={tab.icon as any} size={16} />
              <span>{tab.label}</span>
            </button>
          )}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' &&
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {progressStats && <ProgressOverview stats={progressStats} />}
            {activeIssue && (
              <IssueTimeline
                events={timelineEvents.map(e => ({
                  ...e,
                  timestamp: formatTimeAgo(e.timestamp)
                }))}
                issueTitle={activeIssue.title}
                issueId={activeIssue.id} />
            )}
          </div>
          <div className="space-y-6">
            <NotificationCenter notifications={notifications.slice(0, 3).map(n => ({
              ...n,
              timestamp: formatTimeAgo(n.timestamp)
            }))} />
          </div>
        </div>
      }

      {activeTab === 'issues' &&
      <ActiveIssuesList issues={allIssues.map(issue => ({
        id: issue.id,
        title: issue.title,
        category: issue.category,
        status: issue.status,
        priority: issue.priority,
        submittedDate: formatDate(issue.submittedDate),
        estimatedCompletion: issue.estimatedCompletion ? formatDate(issue.estimatedCompletion) : 'TBD',
        department: issue.department,
        location: issue.location.address,
        image: issue.images?.[0] || 'https://images.unsplash.com/photo-1627722483796-c88ecd3e3b36',
        alt: issue.description,
        progress: issue.progress
      }))} />
      }

      {activeTab === 'metrics' &&
      <PerformanceMetrics
        monthlyData={monthlyData}
        departmentData={departmentData}
        satisfactionTrend={satisfactionTrend} />

      }

      {activeTab === 'notifications' &&
      <NotificationCenter notifications={notifications.map(n => ({
        ...n,
        timestamp: formatTimeAgo(n.timestamp)
      }))} />
      }
    </div>);

};

export default ProgressTrackerInteractive;