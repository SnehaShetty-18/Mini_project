'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import MainLayout from '@/components/common/MainLayout';
import UserGuard from '@/components/common/UserGuard';
import { complaintService, getStatusColor, getSeverityColor } from '@/services/complaintService';
import Icon from '@/components/ui/AppIcon';

interface Complaint {
  complaint_id: number;
  user_id: number;
  admin_id: number | null;
  title: string;
  description: string;
  issue_type: string;
  severity_level: string;
  status: string;
  image_url: string;
  location_text: string;
  gemini_report: string;
  region: string;
  upvote_count: number;
  filed_at: string;
  updated_at: string;
  user_name: string;
}

export default function CommunityPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState({
    issueType: 'all',
    sortBy: 'recent'
  });

  useEffect(() => {
    fetchComplaints();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [complaints, filter]);

  // Ensure filteredComplaints is initialized
  useEffect(() => {
    if (complaints.length > 0 && filteredComplaints.length === 0) {
      setFilteredComplaints(complaints);
    }
  }, [complaints, filteredComplaints]);

  const fetchComplaints = async () => {
    try {
      const data = await complaintService.getAll();
      setComplaints(data || []);
    } catch (err: any) {
      console.error('Error fetching complaints:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load complaints');
      // Set complaints to empty array to prevent undefined errors
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...complaints];
    
    // Apply issue type filter
    if (filter.issueType !== 'all') {
      result = result.filter(complaint => complaint.issue_type === filter.issueType);
    }
    
    // Apply sorting
    if (filter.sortBy === 'recent') {
      result.sort((a, b) => new Date(b.filed_at).getTime() - new Date(a.filed_at).getTime());
    } else if (filter.sortBy === 'upvotes') {
      result.sort((a, b) => b.upvote_count - a.upvote_count);
    }
    
    setFilteredComplaints(result);
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilter(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpvote = async (complaintId: number) => {
    try {
      await complaintService.upvote(complaintId);
      // Refresh the complaints
      fetchComplaints();
    } catch (error: any) {
      console.error('Failed to upvote:', error);
      // Optionally show an error message to the user
      alert(error.response?.data?.message || error.message || 'Failed to upvote complaint');
    }
  };

  if (loading) {
    return (
      <UserGuard>
        <MainLayout>
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-center items-center h-64">
              <Icon name="ArrowPathIcon" size={24} className="animate-spin text-primary" />
            </div>
          </div>
        </MainLayout>
      </UserGuard>
    );
  }

  if (error) {
    return (
      <UserGuard>
        <MainLayout>
          <div className="container mx-auto px-4 py-8">
            <div className="bg-red-50 border border-red-200 rounded-civic-xl p-6 text-center">
              <Icon name="ExclamationTriangleIcon" size={48} className="mx-auto text-red-500 mb-4" />
              <h3 className="text-xl font-semibold text-red-800 mb-2">Error</h3>
              <p className="text-red-600 mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-civic font-medium civic-transition"
              >
                Retry
              </button>
            </div>
          </div>
        </MainLayout>
      </UserGuard>
    );
  }

  return (
    <UserGuard>
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Community Issues</h1>
                <p className="text-text-secondary">
                  See what issues matter most to your neighbors
                </p>
              </div>
              <Link 
                href="/report" 
                className="inline-flex items-center px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-civic font-medium civic-transition"
              >
                <Icon name="PlusIcon" size={16} className="mr-2" />
                Report New Issue
              </Link>
            </div>
            
            {/* Filters */}
            <div className="flex flex-wrap gap-4 mt-6">
              <div>
                <label htmlFor="issueType" className="block text-sm font-medium text-foreground mb-1">
                  Filter by Issue Type
                </label>
                <select
                  id="issueType"
                  value={filter.issueType}
                  onChange={(e) => handleFilterChange('issueType', e.target.value)}
                  className="px-3 py-2 border border-border rounded-civic focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                >
                  <option value="all">All Issues</option>
                  <option value="pothole">Potholes</option>
                  <option value="garbage">Garbage Overflow</option>
                  <option value="streetlight">Streetlight Issues</option>
                  <option value="water_leak">Water Leaks</option>
                  <option value="other">Other Issues</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="sortBy" className="block text-sm font-medium text-foreground mb-1">
                  Sort By
                </label>
                <select
                  id="sortBy"
                  value={filter.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="px-3 py-2 border border-border rounded-civic focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                >
                  <option value="recent">Most Recent</option>
                  <option value="upvotes">Most Upvoted</option>
                </select>
              </div>
            </div>
          </div>
          
          {filteredComplaints.length === 0 ? (
            <div className="bg-card border border-border rounded-civic-xl p-12 text-center">
              <Icon name="DocumentTextIcon" size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No complaints found</h3>
              <p className="text-text-secondary mb-6">
                There are no complaints matching your filters. Be the first to report an issue!
              </p>
              <Link 
                href="/report" 
                className="inline-flex items-center px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-civic font-medium civic-transition"
              >
                <Icon name="PlusIcon" size={16} className="mr-2" />
                Report Issue
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredComplaints.map((complaint) => (
                <div key={complaint.complaint_id} className="bg-card border border-border rounded-civic-xl overflow-hidden hover:shadow-lg transition-shadow">
                  {complaint.image_url && (
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={complaint.image_url} 
                        alt={complaint.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-lg text-foreground line-clamp-2">
                        {complaint.title}
                      </h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(complaint.status)}`}>
                        {complaint.status}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${getSeverityColor(complaint.severity_level)}`}>
                        {complaint.severity_level}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-muted text-foreground">
                        {complaint.issue_type}
                      </span>
                    </div>
                    
                    <p className="text-text-secondary text-sm mb-4 line-clamp-3">
                      {complaint.gemini_report || complaint.description || 'No description available'}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-text-secondary">
                        <Icon name="UserIcon" size={14} className="inline mr-1" />
                        {complaint.user_name}
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <button 
                          onClick={() => handleUpvote(complaint.complaint_id)}
                          className="flex items-center text-text-secondary hover:text-foreground text-sm civic-transition"
                        >
                          <Icon name="ArrowUpIcon" size={14} className="mr-1" />
                          {complaint.upvote_count}
                        </button>
                        
                        <Link 
                          href={`/complaints/${complaint.complaint_id}`}
                          className="text-primary hover:text-primary/80 text-sm font-medium civic-transition"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </MainLayout>
    </UserGuard>
  );
}