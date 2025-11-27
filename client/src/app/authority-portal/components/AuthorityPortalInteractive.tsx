'use client';

import React, { useState, useEffect } from 'react';
import DashboardStats from './DashboardStats';
import PriorityQueue from './PriorityQueue';
import DepartmentOverview from './DepartmentOverview';
import PerformanceMetrics from './PerformanceMetrics';
import QuickActions from './QuickActions';
import RecentActivity from './RecentActivity';
import AuthGuard from '@/components/common/AuthGuard';
import { complaintAPI } from '@/services/api';

const AuthorityPortalInteractive = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [cityComplaints, setCityComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState('New York');

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Fetch complaints by city when the component mounts or city changes
  useEffect(() => {
    const fetchCityComplaints = async () => {
      if (!isHydrated) return;
      
      setLoading(true);
      try {
        const response = await complaintAPI.getByCity(selectedCity);
        setCityComplaints(response.data);
      } catch (error) {
        console.error('Failed to fetch city complaints:', error);
        setCityComplaints([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCityComplaints();
  }, [isHydrated, selectedCity]);

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background">
        <div className="animate-pulse space-y-6 p-6">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) =>
            <div key={i} className="h-32 bg-muted rounded-lg"></div>
            )}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-96 bg-muted rounded-lg"></div>
            <div className="h-96 bg-muted rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  const dashboardStats = [
  {
    id: '1',
    title: 'Active Issues',
    value: '247',
    change: '+12 from yesterday',
    changeType: 'increase' as const,
    icon: 'ExclamationTriangleIcon',
    color: 'bg-error'
  },
  {
    id: '2',
    title: 'Resolved Today',
    value: '89',
    change: '+23% from yesterday',
    changeType: 'increase' as const,
    icon: 'CheckCircleIcon',
    color: 'bg-success'
  },
  {
    id: '3',
    title: 'Avg Response Time',
    value: '4.2h',
    change: '-0.8h from last week',
    changeType: 'decrease' as const,
    icon: 'ClockIcon',
    color: 'bg-primary'
  },
  {
    id: '4',
    title: 'Satisfaction Score',
    value: '4.2/5',
    change: '+0.3 from last month',
    changeType: 'increase' as const,
    icon: 'StarIcon',
    color: 'bg-accent'
  }];


  const priorityIssues = [
  {
    id: '1',
    title: 'Water Main Break on Oak Street',
    description: 'Major water line rupture causing street flooding and service disruption to 200+ residents',
    priority: 'critical' as const,
    category: 'Water & Sewer',
    location: 'Oak Street & 5th Ave',
    reportedAt: '2 hours ago',
    estimatedCost: '$15,000',
    department: 'Public Works',
    image: "https://images.unsplash.com/photo-1566687952848-e2cf82d3144c",
    alt: 'Flooded street with water gushing from broken underground pipe',
    reporterName: 'Sarah Johnson'
  },
  {
    id: '2',
    title: 'Traffic Light Malfunction at Main Intersection',
    description: 'Traffic signal system failure causing dangerous intersection conditions during rush hour',
    priority: 'high' as const,
    category: 'Traffic & Transportation',
    location: 'Main St & Broadway',
    reportedAt: '4 hours ago',
    estimatedCost: '$3,500',
    department: 'Transportation',
    image: "https://images.unsplash.com/photo-1716740279432-15e669ff01e1",
    alt: 'Busy intersection with malfunctioning traffic lights and cars waiting',
    reporterName: 'Mike Chen'
  },
  {
    id: '3',
    title: 'Pothole Cluster on Residential Street',
    description: 'Multiple large potholes creating hazardous driving conditions on heavily used residential road',
    priority: 'medium' as const,
    category: 'Road Maintenance',
    location: 'Elm Street (200-300 block)',
    reportedAt: '1 day ago',
    estimatedCost: '$2,800',
    department: 'Public Works',
    image: "https://images.unsplash.com/photo-1728340964368-59c3192e44e6",
    alt: 'Large pothole in asphalt road with damaged pavement around edges',
    reporterName: 'Lisa Rodriguez'
  }];


  const departments = [
  {
    id: '1',
    name: 'Public Works',
    activeIssues: 89,
    resolvedToday: 23,
    avgResponseTime: '3.2h',
    satisfaction: 87,
    budget: '$2.4M',
    utilization: 78,
    icon: 'WrenchScrewdriverIcon',
    color: 'bg-primary'
  },
  {
    id: '2',
    name: 'Transportation',
    activeIssues: 45,
    resolvedToday: 12,
    avgResponseTime: '2.8h',
    satisfaction: 92,
    budget: '$1.8M',
    utilization: 65,
    icon: 'TruckIcon',
    color: 'bg-accent'
  },
  {
    id: '3',
    name: 'Parks & Recreation',
    activeIssues: 67,
    resolvedToday: 18,
    avgResponseTime: '5.1h',
    satisfaction: 85,
    budget: '$1.2M',
    utilization: 82,
    icon: 'BuildingLibraryIcon',
    color: 'bg-success'
  },
  {
    id: '4',
    name: 'Environmental Services',
    activeIssues: 34,
    resolvedToday: 9,
    avgResponseTime: '4.5h',
    satisfaction: 89,
    budget: '$900K',
    utilization: 71,
    icon: 'GlobeAmericasIcon',
    color: 'bg-warning'
  }];


  const performanceData = {
    responseTimeData: [
    { month: 'Jan', avgTime: 6.2, target: 4.0 },
    { month: 'Feb', avgTime: 5.8, target: 4.0 },
    { month: 'Mar', avgTime: 5.1, target: 4.0 },
    { month: 'Apr', avgTime: 4.7, target: 4.0 },
    { month: 'May', avgTime: 4.2, target: 4.0 },
    { month: 'Jun', avgTime: 3.9, target: 4.0 }],

    resolutionRateData: [
    { department: 'Public Works', resolved: 156, pending: 23 },
    { department: 'Transportation', resolved: 89, pending: 12 },
    { department: 'Parks & Rec', resolved: 134, pending: 18 },
    { department: 'Environmental', resolved: 67, pending: 9 }],

    satisfactionData: [
    { name: 'Excellent', value: 42, color: '#10B981' },
    { name: 'Good', value: 35, color: '#3B82F6' },
    { name: 'Fair', value: 18, color: '#F59E0B' },
    { name: 'Poor', value: 5, color: '#EF4444' }]

  };

  const quickActions = [
  {
    id: '1',
    title: 'Assign Issue',
    description: 'Quickly assign reported issues to appropriate departments',
    icon: 'UserPlusIcon',
    color: 'bg-primary',
    action: 'assign_issue'
  },
  {
    id: '2',
    title: 'Generate Report',
    description: 'Create performance reports for city council meetings',
    icon: 'DocumentTextIcon',
    color: 'bg-accent',
    action: 'generate_report'
  },
  {
    id: '3',
    title: 'Budget Approval',
    description: 'Review and approve budget requests for civic improvements',
    icon: 'CurrencyDollarIcon',
    color: 'bg-success',
    action: 'budget_approval'
  },
  {
    id: '4',
    title: 'Schedule Inspection',
    description: 'Coordinate field inspections and quality assessments',
    icon: 'ClipboardDocumentCheckIcon',
    color: 'bg-warning',
    action: 'schedule_inspection'
  },
  {
    id: '5',
    title: 'Contractor Management',
    description: 'Manage vendor assignments and performance tracking',
    icon: 'BuildingOfficeIcon',
    color: 'bg-secondary',
    action: 'contractor_management'
  },
  {
    id: '6',
    title: 'Public Communication',
    description: 'Send updates and notifications to affected citizens',
    icon: 'SpeakerWaveIcon',
    color: 'bg-brand-primary',
    action: 'public_communication'
  }];


  const recentActivities = [
  {
    id: '1',
    type: 'issue_resolved' as const,
    title: 'Streetlight Repair Completed',
    description: 'LED streetlight replacement on Pine Street has been completed by contractor team',
    timestamp: '15 minutes ago',
    user: 'John Martinez',
    department: 'Public Works',
    priority: 'medium' as const
  },
  {
    id: '2',
    type: 'budget_approved' as const,
    title: 'Road Resurfacing Budget Approved',
    description: '$45,000 budget approved for Main Street resurfacing project scheduled for next month',
    timestamp: '1 hour ago',
    user: 'City Manager',
    department: 'Administration'
  },
  {
    id: '3',
    type: 'issue_assigned' as const,
    title: 'Playground Equipment Issue Assigned',
    description: 'Broken swing set at Central Park assigned to Parks & Recreation maintenance team',
    timestamp: '2 hours ago',
    user: 'Sarah Wilson',
    department: 'Parks & Recreation',
    priority: 'low' as const
  },
  {
    id: '4',
    type: 'inspection_completed' as const,
    title: 'Bridge Safety Inspection Completed',
    description: 'Annual structural inspection of Oak Street Bridge completed with satisfactory results',
    timestamp: '4 hours ago',
    user: 'Engineering Team',
    department: 'Public Works'
  },
  {
    id: '5',
    type: 'contractor_assigned' as const,
    title: 'Snow Removal Contractor Assigned',
    description: 'ABC Landscaping assigned to emergency snow removal for downtown district',
    timestamp: '6 hours ago',
    user: 'Operations Manager',
    department: 'Public Works',
    priority: 'high' as const
  }];


  const tabs = [
  { id: 'overview', name: 'Overview', icon: 'HomeIcon' },
  { id: 'performance', name: 'Performance', icon: 'ChartBarIcon' },
  { id: 'departments', name: 'Departments', icon: 'BuildingOfficeIcon' },
  { id: 'actions', name: 'Quick Actions', icon: 'BoltIcon' },
  { id: 'city-complaints', name: 'City Complaints', icon: 'MapPinIcon' }
  ];

  // Format complaints for display
  const formattedCityComplaints = cityComplaints.map(complaint => ({
    id: complaint.id,
    title: complaint.title,
    description: complaint.description,
    priority: complaint.severity,
    category: complaint.issueType,
    location: complaint.address || `${complaint.latitude}, ${complaint.longitude}`,
    reportedAt: new Date(complaint.createdAt).toLocaleString(),
    image: complaint.imageUrl ? `http://localhost:5000${complaint.imageUrl}` : "https://images.unsplash.com/photo-1566687952848-e2cf82d3144c",
    alt: complaint.title,
    reporterName: complaint.user?.name || 'Anonymous'
  }));

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Authority Portal</h1>
                <p className="text-text-secondary">
                  Municipal dashboard for workflow automation and performance insights
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <label htmlFor="city-select" className="text-sm font-medium text-foreground">
                  City:
                </label>
                <select
                  id="city-select"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="border border-border rounded-civic px-3 py-1 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="New York">New York</option>
                  <option value="Los Angeles">Los Angeles</option>
                  <option value="Chicago">Chicago</option>
                  <option value="Houston">Houston</option>
                  <option value="Phoenix">Phoenix</option>
                </select>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="mb-8">
            <DashboardStats stats={dashboardStats} />
          </div>

          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="border-b border-border">
              <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) =>
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm civic-transition ${
                  activeTab === tab.id ?
                  'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-foreground hover:border-border'}`
                  }>

                  {tab.name}
                </button>
                )}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' &&
          <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <PriorityQueue issues={priorityIssues} />
                <RecentActivity activities={recentActivities} />
              </div>
            </div>
          }

          {activeTab === 'performance' &&
          <div className="space-y-8">
              <PerformanceMetrics data={performanceData} />
            </div>
          }

          {activeTab === 'departments' &&
          <div className="space-y-8">
              <DepartmentOverview departments={departments} />
            </div>
          }

          {activeTab === 'actions' &&
          <div className="space-y-8">
              <QuickActions actions={quickActions} />
            </div>
          }

          {activeTab === 'city-complaints' &&
          <div className="space-y-8">
            <div className="bg-card border border-border rounded-civic-lg p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Complaints in {selectedCity}</h2>
              
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : formattedCityComplaints.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {formattedCityComplaints.map((complaint) => (
                    <div key={complaint.id} className="border border-border rounded-civic-lg overflow-hidden">
                      <img 
                        src={complaint.image} 
                        alt={complaint.alt} 
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-semibold text-foreground">{complaint.title}</h3>
                        <p className="text-sm text-text-secondary mt-1">{complaint.description}</p>
                        <div className="mt-3 flex justify-between items-center">
                          <span className="text-xs px-2 py-1 bg-muted rounded-full">
                            {complaint.category}
                          </span>
                          <span className="text-xs text-text-secondary">
                            {complaint.reportedAt}
                          </span>
                        </div>
                        <div className="mt-2 text-xs text-text-secondary">
                          Reported by: {complaint.reporterName}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-text-secondary">No complaints found for {selectedCity}</p>
                </div>
              )}
            </div>
          </div>
          }
        </div>
      </div>
    </AuthGuard>
  );
};

export default AuthorityPortalInteractive;