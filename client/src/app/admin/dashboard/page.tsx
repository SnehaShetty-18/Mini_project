'use client';

import React, { useState, useEffect } from 'react';
import AdminGuard from '@/components/common/AdminGuard';
import MainLayout from '@/components/common/MainLayout';
import { complaintService, getStatusColor, getSeverityColor } from '@/services/complaintService';
import Icon from '@/components/ui/AppIcon';

interface Complaint {
  complaint_id: number;
  user_id: number;
  admin_id: number | null;
  title: string;
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

export default function AdminDashboardPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    pending: 0,
    inProgress: 0,
    completed: 0,
    total: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const data: Complaint[] = await complaintService.getAll();
      setComplaints(data);
      
      // Calculate stats
      const pending = data.filter((c: Complaint) => c.status === 'Pending').length;
      const inProgress = data.filter((c: Complaint) => c.status === 'In Progress').length;
      const completed = data.filter((c: Complaint) => c.status === 'Completed').length;
      
      setStats({
        pending,
        inProgress,
        completed,
        total: data.length
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (complaintId: number, newStatus: string) => {
    try {
      await complaintService.updateStatus(complaintId, { new_status: newStatus });
      // Refresh the dashboard data
      fetchDashboardData();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  if (loading) {
    return (
      <AdminGuard>
        <MainLayout>
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-center items-center h-64">
              <Icon name="ArrowPathIcon" size={24} className="animate-spin text-primary" />
            </div>
          </div>
        </MainLayout>
      </AdminGuard>
    );
  }

  if (error) {
    return (
      <AdminGuard>
        <MainLayout>
          <div className="container mx-auto px-4 py-8">
            <div className="bg-red-50 border border-red-200 rounded-civic-xl p-6 text-center">
              <Icon name="ExclamationTriangleIcon" size={48} className="mx-auto text-red-500 mb-4" />
              <h3 className="text-xl font-semibold text-red-800 mb-2">Error</h3>
              <p className="text-red-600 mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-civic font-medium civic-transition"
              >
                Retry
              </button>
            </div>
          </div>
        </MainLayout>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-text-secondary">
              Manage and track civic issues in your region
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-card border border-border rounded-civic-xl p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-civic mr-4">
                  <Icon name="DocumentTextIcon" size={24} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Total Complaints</p>
                  <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-card border border-border rounded-civic-xl p-6">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-civic mr-4">
                  <Icon name="ClockIcon" size={24} className="text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Pending</p>
                  <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-card border border-border rounded-civic-xl p-6">
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 rounded-civic mr-4">
                  <Icon name="WrenchIcon" size={24} className="text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-text-secondary">In Progress</p>
                  <p className="text-2xl font-bold text-foreground">{stats.inProgress}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-card border border-border rounded-civic-xl p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-civic mr-4">
                  <Icon name="CheckCircleIcon" size={24} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Completed</p>
                  <p className="text-2xl font-bold text-foreground">{stats.completed}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Complaints Table */}
          <div className="bg-card border border-border rounded-civic-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">Recent Complaints</h2>
            </div>
            
            {complaints.length === 0 ? (
              <div className="p-12 text-center">
                <Icon name="DocumentTextIcon" size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No complaints found</h3>
                <p className="text-text-secondary">
                  There are no complaints in your region yet.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Issue</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Severity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Upvotes</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {complaints.map((complaint) => (
                      <tr key={complaint.complaint_id} className="hover:bg-muted/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {complaint.image_url && (
                              <div className="flex-shrink-0 h-10 w-10 mr-3">
                                <img 
                                  className="h-10 w-10 rounded-civic object-cover" 
                                  src={complaint.image_url} 
                                  alt={complaint.title} 
                                />
                              </div>
                            )}
                            <div>
                              <div className="text-sm font-medium text-foreground">{complaint.title}</div>
                              <div className="text-sm text-text-secondary line-clamp-1">{complaint.location_text}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-foreground capitalize">{complaint.issue_type}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(complaint.severity_level)}`}>
                            {complaint.severity_level}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(complaint.status)}`}>
                            {complaint.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                          <div className="flex items-center">
                            <Icon name="ArrowUpIcon" size={14} className="mr-1" />
                            {complaint.upvote_count}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                          {complaint.user_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <select
                            value={complaint.status}
                            onChange={(e) => handleStatusChange(complaint.complaint_id, e.target.value)}
                            className="px-3 py-1 border border-border rounded-civic text-sm focus:ring-2 focus:ring-secondary focus:border-secondary outline-none"
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </MainLayout>
    </AdminGuard>
  );
}