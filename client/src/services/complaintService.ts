import api from './api';

export interface Complaint {
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

export interface StatusHistory {
  status_id: number;
  complaint_id: number;
  admin_id: number;
  old_status: string;
  new_status: string;
  changed_at: string;
}

export interface Notification {
  notification_id: number;
  user_id: number | null;
  complaint_id: number | null;
  type: string;
  message: string;
  created_at: string;
}

// Complaint operations
export const complaintService = {
  // Create a new complaint
  create: async (complaintData: FormData) => {
    try {
      console.log('Sending complaint data:', complaintData);
      const response = await api.post('/complaints', complaintData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Complaint creation response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Complaint creation error:', error);
      throw error;
    }
  },

  // Get all complaints (public/community feed)
  getAll: async (filters?: {
    issue_type?: string;
    severity_level?: string;
    status?: string;
    region?: string;
    sort_by?: string;
    page?: number;
    limit?: number;
  }) => {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value.toString());
        });
      }
      
      const response = await api.get(`/complaints?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching complaints:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch complaints');
    }
  },

  // Get user's complaints
  getMyComplaints: async () => {
    try {
      const response = await api.get('/complaints/my-complaints');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get complaint by ID
  getById: async (id: number) => {
    try {
      const response = await api.get(`/complaints/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update complaint status (admin only)
  updateStatus: async (id: number, statusData: { new_status: string }) => {
    try {
      const response = await api.put(`/complaints/${id}/status`, statusData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Upvote a complaint
  upvote: async (id: number) => {
    try {
      const response = await api.post(`/complaints/${id}/upvote`);
      return response.data;
    } catch (error: any) {
      console.error('Error upvoting complaint:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to upvote complaint');
    }
  },

  // Get status history for a complaint
  getStatusHistory: async (id: number) => {
    try {
      const response = await api.get(`/complaints/${id}/status-history`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Notification operations
export const notificationService = {
  // Get user notifications
  getNotifications: async () => {
    try {
      const response = await api.get('/notifications');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Mark notification as read
  markAsRead: async (id: number) => {
    try {
      const response = await api.put(`/notifications/${id}/read`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Helper function to get status color
export const getStatusColor = (status: string) => {
  // Handle undefined or null status
  if (!status) {
    return 'bg-gray-200 text-gray-800';
  }
  
  switch (status.toLowerCase()) {
    case 'pending':
      return 'bg-gray-200 text-gray-800';
    case 'in progress':
      return 'bg-yellow-200 text-yellow-800';
    case 'completed':
      return 'bg-green-200 text-green-800';
    default:
      return 'bg-gray-200 text-gray-800';
  }
};

// Helper function to get severity color
export const getSeverityColor = (severity: string) => {
  // Handle undefined or null severity
  if (!severity) {
    return 'bg-gray-200 text-gray-800';
  }
  
  switch (severity.toLowerCase()) {
    case 'low':
      return 'bg-green-200 text-green-800';
    case 'medium':
      return 'bg-yellow-200 text-yellow-800';
    case 'high':
      return 'bg-red-200 text-red-800';
    default:
      return 'bg-gray-200 text-gray-800';
  }
};