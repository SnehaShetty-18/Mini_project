'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
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
}

interface StatusHistory {
  status_id: number;
  complaint_id: number;
  admin_id: number;
  old_status: string;
  new_status: string;
  changed_at: string;
  admin_name: string;
}

export default function ComplaintDetailPage() {
  const router = useRouter();
  const pathname = usePathname();
  const complaintId = pathname.split('/')[2];
  
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [statusHistory, setStatusHistory] = useState<StatusHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (complaintId) {
      fetchComplaintDetails();
    }
  }, [complaintId]);

  const fetchComplaintDetails = async () => {
    try {
      setLoading(true);
      const [complaintData, historyData] = await Promise.all([
        complaintService.getById(parseInt(complaintId)),
        complaintService.getStatusHistory(parseInt(complaintId))
      ]);
      
      setComplaint(complaintData);
      setStatusHistory(historyData);
      
      // Check if current user is the owner (in a real app, you'd compare with actual user ID)
      // For now, we'll just simulate this
      setIsOwner(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load complaint details');
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async () => {
    if (!complaint) return;
    
    try {
      await complaintService.upvote(complaint.complaint_id);
      // Refresh the complaint details
      fetchComplaintDetails();
    } catch (error) {
      console.error('Failed to upvote:', error);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <Icon name="ArrowPathIcon" size={24} className="animate-spin text-primary" />
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-civic-xl p-6 text-center">
            <Icon name="ExclamationTriangleIcon" size={48} className="mx-auto text-red-500 mb-4" />
            <h3 className="text-xl font-semibold text-red-800 mb-2">Error</h3>
            <p className="text-red-600 mb-6">{error}</p>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-civic font-medium civic-transition"
            >
              Go Back
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!complaint) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-card border border-border rounded-civic-xl p-12 text-center">
            <Icon name="DocumentTextIcon" size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Complaint Not Found</h3>
            <p className="text-text-secondary mb-6">
              The complaint you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-civic font-medium civic-transition"
            >
              Go Back
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center text-primary hover:text-primary/80 mb-4 civic-transition"
            >
              <Icon name="ArrowLeftIcon" size={16} className="mr-2" />
              Back to Community
            </button>
            
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-2">{complaint.title}</h1>
                {isOwner && (
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    Your Complaint
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-4">
                <button 
                  onClick={handleUpvote}
                  className="flex items-center px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-civic font-medium civic-transition"
                >
                  <Icon name="ArrowUpIcon" size={16} className="mr-2" />
                  Upvote ({complaint.upvote_count})
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-card border border-border rounded-civic-xl overflow-hidden mb-8">
                {complaint.image_url && (
                  <div className="h-80 overflow-hidden">
                    <img 
                      src={complaint.image_url} 
                      alt={complaint.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className={`text-sm px-3 py-1 rounded-full ${getStatusColor(complaint.status)}`}>
                      {complaint.status}
                    </span>
                    <span className={`text-sm px-3 py-1 rounded-full ${getSeverityColor(complaint.severity_level)}`}>
                      {complaint.severity_level} Severity
                    </span>
                    <span className="text-sm px-3 py-1 rounded-full bg-muted text-foreground">
                      {complaint.issue_type}
                    </span>
                  </div>
                  
                  <div className="prose max-w-none mb-6">
                    <h3 className="text-lg font-semibold mb-3">Description</h3>
                    <p className="text-foreground">{complaint.description}</p>
                  </div>
                  
                  {complaint.gemini_report && (
                    <div className="prose max-w-none mb-6">
                      <h3 className="text-lg font-semibold mb-3">AI Analysis</h3>
                      <p className="text-foreground">{complaint.gemini_report}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-text-secondary mb-1">Location</h4>
                      <p className="text-foreground flex items-center">
                        <Icon name="MapPinIcon" size={16} className="mr-2" />
                        {complaint.location_text}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-text-secondary mb-1">Region</h4>
                      <p className="text-foreground">{complaint.region}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-text-secondary mb-1">Reported</h4>
                      <p className="text-foreground">
                        {new Date(complaint.filed_at).toLocaleDateString()} at{' '}
                        {new Date(complaint.filed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-text-secondary mb-1">Last Updated</h4>
                      <p className="text-foreground">
                        {new Date(complaint.updated_at).toLocaleDateString()} at{' '}
                        {new Date(complaint.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Status History */}
              <div className="bg-card border border-border rounded-civic-xl p-6">
                <h2 className="text-xl font-bold text-foreground mb-6">Status History</h2>
                
                {statusHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <Icon name="ClockIcon" size={32} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-text-secondary">No status updates yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {statusHistory.map((history) => (
                      <div key={history.status_id} className="flex">
                        <div className="flex flex-col items-center mr-4">
                          <div className="w-3 h-3 bg-primary rounded-full"></div>
                          <div className="w-0.5 h-full bg-border mt-2"></div>
                        </div>
                        <div className="pb-4 flex-1">
                          <div className="flex justify-between">
                            <h3 className="font-medium text-foreground">
                              Status changed to <span className={`px-2 py-1 rounded-full ${getStatusColor(history.new_status)}`}>
                                {history.new_status}
                              </span>
                            </h3>
                            <span className="text-sm text-text-secondary">
                              {new Date(history.changed_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-text-secondary mt-1">
                            Updated by {history.admin_name}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Sidebar */}
            <div>
              <div className="bg-card border border-border rounded-civic-xl p-6 sticky top-24">
                <h2 className="text-lg font-bold text-foreground mb-4">Complaint Details</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-text-secondary mb-1">Issue Type</h3>
                    <p className="text-foreground capitalize">{complaint.issue_type}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-text-secondary mb-1">Severity</h3>
                    <p className={`inline-block px-2 py-1 rounded-full text-sm ${getSeverityColor(complaint.severity_level)}`}>
                      {complaint.severity_level}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-text-secondary mb-1">Status</h3>
                    <p className={`inline-block px-2 py-1 rounded-full text-sm ${getStatusColor(complaint.status)}`}>
                      {complaint.status}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-text-secondary mb-1">Upvotes</h3>
                    <p className="text-foreground">{complaint.upvote_count} upvotes</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-text-secondary mb-1">Region</h3>
                    <p className="text-foreground">{complaint.region}</p>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-border">
                  <h3 className="text-sm font-medium text-text-secondary mb-2">Share this issue</h3>
                  <div className="flex space-x-2">
                    <button className="p-2 bg-muted hover:bg-muted/80 rounded-civic civic-transition">
                      <Icon name="ShareIcon" size={16} />
                    </button>
                    <button className="p-2 bg-muted hover:bg-muted/80 rounded-civic civic-transition">
                      <Icon name="LinkIcon" size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}