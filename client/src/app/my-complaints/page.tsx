'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import UserGuard from '@/components/common/UserGuard';
import MainLayout from '@/components/common/MainLayout';
import { complaintService, getStatusColor, getSeverityColor } from '@/services/complaintService';
import Icon from '@/components/ui/AppIcon';

interface Complaint {
  complaint_id: number;
  title: string;
  issue_type: string;
  severity_level: string;
  status: string;
  image_url: string;
  location_text: string;
  gemini_report: string;
  upvote_count: number;
  filed_at: string;
}

export default function MyComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMyComplaints();
  }, []);

  const fetchMyComplaints = async () => {
    try {
      const data = await complaintService.getMyComplaints();
      setComplaints(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load your complaints');
    } finally {
      setLoading(false);
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
                <h1 className="text-3xl font-bold text-foreground mb-2">My Complaints</h1>
                <p className="text-text-secondary">
                  Track the status of issues you've reported
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
          </div>

          {complaints.length === 0 ? (
            <div className="bg-card border border-border rounded-civic-xl p-12 text-center">
              <Icon name="DocumentTextIcon" size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No complaints yet</h3>
              <p className="text-text-secondary mb-6">
                You haven't reported any issues yet. Help improve your community by reporting civic concerns.
              </p>
              <Link 
                href="/report" 
                className="inline-flex items-center px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-civic font-medium civic-transition"
              >
                <Icon name="PlusIcon" size={16} className="mr-2" />
                Report Your First Issue
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {complaints.map((complaint) => (
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
                        <Icon name="MapPinIcon" size={14} className="inline mr-1" />
                        {complaint.location_text}
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center text-text-secondary text-sm">
                          <Icon name="ArrowUpIcon" size={14} className="mr-1" />
                          {complaint.upvote_count}
                        </span>
                        
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