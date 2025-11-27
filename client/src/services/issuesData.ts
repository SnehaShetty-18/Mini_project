import { complaintAPI, authAPI } from './api';

/**
 * Issues Data Service
 * Manages civic issues data with API persistence
 */

export interface Issue {
  id: string;
  title: string;
  category: string;
  subcategory?: string;
  status: 'submitted' | 'assigned' | 'in-progress' | 'resolved' | 'verified';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  submittedDate: Date;
  estimatedCompletion?: Date;
  actualCompletion?: Date;
  department: string;
  location: {
    address: string;
    latitude: number;
    longitude: number;
    neighborhood?: string;
    ward?: string;
  };
  description: string;
  images?: string[];
  reporter?: {
    name?: string;
    email?: string;
    phone?: string;
    isAnonymous: boolean;
  };
  progress: number;
  assignee?: string;
  timeline?: TimelineEvent[];
}

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  timestamp: Date;
  status: 'completed' | 'current' | 'pending';
  department?: string;
  assignee?: string;
  image?: string;
}

export interface Notification {
  id: string;
  type: 'completion' | 'update' | 'escalation' | 'reminder';
  title: string;
  message: string;
  timestamp: Date;
  issueId: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
}

class IssuesDataService {
  private readonly STORAGE_KEY = 'civic_issues';
  private readonly NOTIFICATIONS_KEY = 'civic_notifications';
  private issues: Map<string, Issue> = new Map();
  private notifications: Notification[] = [];

  constructor() {
    // Initialize with sample data
    this.initializeSampleData();
  }

  /**
   * Add a new issue
   */
  async addIssue(issue: Omit<Issue, 'id' | 'progress' | 'timeline'>): Promise<Issue> {
    try {
      // Convert issue data to match backend format
      const complaintData = {
        title: issue.title,
        description: issue.description,
        latitude: issue.location.latitude,
        longitude: issue.location.longitude,
        address: issue.location.address,
        // Add other fields as needed
      };

      // Send to backend
      const response = await complaintAPI.create(complaintData);
      
      // Create local issue object from response
      const newIssue: Issue = {
        id: response.data.id,
        title: response.data.title,
        category: response.data.issueType || issue.category,
        status: response.data.status || 'submitted',
        priority: response.data.severity || issue.priority,
        submittedDate: new Date(response.data.createdAt),
        department: response.data.department || issue.department,
        location: {
          address: response.data.address,
          latitude: response.data.latitude,
          longitude: response.data.longitude,
          neighborhood: response.data.neighborhood || issue.location.neighborhood,
          ward: response.data.ward || issue.location.ward
        },
        description: response.data.description,
        images: response.data.imageUrl ? [response.data.imageUrl] : issue.images,
        reporter: issue.reporter,
        progress: 0,
        timeline: [
          {
            id: '1',
            title: 'Issue Submitted',
            description: `${response.data.issueType || issue.category} issue reported at ${response.data.address}`,
            timestamp: new Date(response.data.createdAt),
            status: 'completed',
            department: response.data.department || issue.department
          }
        ]
      };

      this.issues.set(newIssue.id, newIssue);
      
      // Create notification
      this.addNotification({
        type: 'update',
        title: 'New Issue Created',
        message: `Your report "${response.data.title}" has been submitted successfully.`,
        issueId: newIssue.id,
        priority: response.data.severity === 'urgent' || response.data.severity === 'high' ? 'high' : 'medium'
      });

      return newIssue;
    } catch (error) {
      console.error('Failed to submit issue:', error);
      throw error;
    }
  }

  /**
   * Get all issues
   */
  async getAllIssues(): Promise<Issue[]> {
    try {
      const response = await complaintAPI.getAll();
      // Convert backend response to local Issue format
      const issues: Issue[] = response.data.map((item: any) => ({
        id: item.id,
        title: item.title,
        category: item.issueType,
        status: item.status,
        priority: item.severity,
        submittedDate: new Date(item.createdAt),
        department: item.department,
        location: {
          address: item.address,
          latitude: item.latitude,
          longitude: item.longitude
        },
        description: item.description,
        images: item.imageUrl ? [item.imageUrl] : undefined,
        reporter: item.user ? { name: item.user.name, isAnonymous: false } : undefined,
        progress: 0, // This would need to be calculated
        timeline: [] // This would need to be populated from backend
      }));
      return issues;
    } catch (error) {
      console.error('Failed to fetch issues:', error);
      return Array.from(this.issues.values());
    }
  }

  /**
   * Get issue by ID
   */
  async getIssue(id: string): Promise<Issue | undefined> {
    try {
      const response = await complaintAPI.getById(id);
      // Convert backend response to local Issue format
      const item = response.data;
      const issue: Issue = {
        id: item.id,
        title: item.title,
        category: item.issueType,
        status: item.status,
        priority: item.severity,
        submittedDate: new Date(item.createdAt),
        department: item.department,
        location: {
          address: item.address,
          latitude: item.latitude,
          longitude: item.longitude
        },
        description: item.description,
        images: item.imageUrl ? [item.imageUrl] : undefined,
        reporter: item.user ? { name: item.user.name, isAnonymous: false } : undefined,
        progress: 0, // This would need to be calculated
        timeline: [] // This would need to be populated from backend
      };
      return issue;
    } catch (error) {
      console.error('Failed to fetch issue:', error);
      return this.issues.get(id);
    }
  }

  /**
   * Update issue status
   */
  async updateIssueStatus(id: string, status: Issue['status'], progress?: number): Promise<void> {
    try {
      // Update on backend
      await complaintAPI.updateStatus(id, { status });
      
      // Update local cache
      const issue = this.issues.get(id);
      if (issue) {
        issue.status = status;
        if (progress !== undefined) {
          issue.progress = progress;
        }

        // Add timeline event
        const timelineEvent: TimelineEvent = {
          id: Date.now().toString(),
          title: this.getStatusTitle(status),
          description: this.getStatusDescription(status),
          timestamp: new Date(),
          status: 'current',
          department: issue.department
        };

        issue.timeline = issue.timeline || [];
        // Mark previous events as completed
        issue.timeline.forEach(event => {
          if (event.status === 'current') event.status = 'completed';
        });
        issue.timeline.push(timelineEvent);

        this.issues.set(id, issue);
      }
    } catch (error) {
      console.error('Failed to update issue status:', error);
      throw error;
    }
  }

  /**
   * Get statistics
   */
  async getStatistics() {
    try {
      const allIssues = await this.getAllIssues();
      const now = new Date();
      
      const totalReports = allIssues.length;
      const inProgress = allIssues.filter(i => i.status === 'in-progress' || i.status === 'assigned').length;
      const resolved = allIssues.filter(i => i.status === 'resolved' || i.status === 'verified').length;
      
      // Calculate average resolution time
      const resolvedIssues = allIssues.filter(i => i.actualCompletion);
      const avgResolutionTime = resolvedIssues.length > 0
        ? Math.round(resolvedIssues.reduce((sum, issue) => {
            const days = Math.ceil(
              (issue.actualCompletion!.getTime() - issue.submittedDate.getTime()) / (1000 * 60 * 60 * 24)
            );
            return sum + days;
          }, 0) / resolvedIssues.length)
        : 0;

      return {
        totalReports,
        inProgress,
        resolved,
        avgResolutionTime,
        satisfactionRate: 94 // This would come from user ratings in a real system
      };
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
      // Return default values
      return {
        totalReports: 0,
        inProgress: 0,
        resolved: 0,
        avgResolutionTime: 0,
        satisfactionRate: 94
      };
    }
  }

  /**
   * Get monthly data
   */
  async getMonthlyData() {
    try {
      const allIssues = await this.getAllIssues();
      const monthlyMap: Record<string, { resolved: number; submitted: number; totalDays: number; count: number }> = {};

      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      // Get last 5 months
      const now = new Date();
      for (let i = 4; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthKey = months[date.getMonth()];
        monthlyMap[monthKey] = { resolved: 0, submitted: 0, totalDays: 0, count: 0 };
      }

      allIssues.forEach(issue => {
        const monthKey = months[issue.submittedDate.getMonth()];
        if (monthlyMap[monthKey]) {
          monthlyMap[monthKey].submitted++;
          if (issue.status === 'resolved' || issue.status === 'verified') {
            monthlyMap[monthKey].resolved++;
            if (issue.actualCompletion) {
              const days = Math.ceil(
                (issue.actualCompletion.getTime() - issue.submittedDate.getTime()) / (1000 * 60 * 60 * 24)
              );
              monthlyMap[monthKey].totalDays += days;
              monthlyMap[monthKey].count++;
            }
          }
        }
      });

      return Object.entries(monthlyMap).map(([month, data]) => ({
        month,
        resolved: data.resolved,
        submitted: data.submitted,
        avgDays: data.count > 0 ? Math.round(data.totalDays / data.count) : 0
      }));
    } catch (error) {
      console.error('Failed to fetch monthly data:', error);
      // Return empty data
      return [];
    }
  }

  /**
   * Get department breakdown
   */
  async getDepartmentData() {
    try {
      const allIssues = await this.getAllIssues();
      const deptMap: Record<string, number> = {};

      allIssues.forEach(issue => {
        const deptName = issue.department.split(' - ')[0]; // Get main department name
        deptMap[deptName] = (deptMap[deptName] || 0) + 1;
      });

      const colors = ['#2563EB', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#EC4899'];
      return Object.entries(deptMap).map(([name, value], index) => ({
        name,
        value,
        color: colors[index % colors.length]
      }));
    } catch (error) {
      console.error('Failed to fetch department data:', error);
      // Return empty data
      return [];
    }
  }

  /**
   * Add notification
   */
  addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>): void {
    this.notifications.push({
      ...notification,
      id: `not-${Date.now()}`,
      timestamp: new Date(),
      isRead: false
    });
    this.saveToStorage();
  }

  /**
   * Get notifications
   */
  getNotifications(limit?: number): Notification[] {
    const sorted = [...this.notifications].sort((a, b) => 
      b.timestamp.getTime() - a.timestamp.getTime()
    );
    return limit ? sorted.slice(0, limit) : sorted;
  }

  /**
   * Mark notification as read
   */
  markNotificationRead(id: string): void {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.isRead = true;
      this.saveToStorage();
    }
  }

  /**
   * Get status title for timeline
   */
  private getStatusTitle(status: Issue['status']): string {
    const titles = {
      submitted: 'Issue Submitted',
      assigned: 'Issue Assigned',
      'in-progress': 'Work In Progress',
      resolved: 'Issue Resolved',
      verified: 'Resolution Verified'
    };
    return titles[status];
  }

  /**
   * Get status description for timeline
   */
  private getStatusDescription(status: Issue['status']): string {
    const descriptions = {
      submitted: 'Issue has been submitted and is awaiting review.',
      assigned: 'Issue has been assigned to the appropriate department.',
      'in-progress': 'Work is currently in progress to resolve this issue.',
      resolved: 'Issue has been resolved and is awaiting verification.',
      verified: 'Resolution has been verified and issue is closed.'
    };
    return descriptions[status];
  }

  /**
   * Initialize with sample data if empty
   */
  private initializeSampleData(): void {
    // Sample data will be loaded from backend
  }

  /**
   * Save to localStorage (for notifications only)
   */
  private saveToStorage(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(this.NOTIFICATIONS_KEY, JSON.stringify(this.notifications));
      } catch (error) {
        console.error('Failed to save to storage:', error);
      }
    }
  }

  /**
   * Load from localStorage (for notifications only)
   */
  private loadFromStorage(): void {
    if (typeof window !== 'undefined') {
      try {
        const notificationsData = localStorage.getItem(this.NOTIFICATIONS_KEY);
        
        if (notificationsData) {
          this.notifications = JSON.parse(notificationsData).map((n: any) => ({
            ...n,
            timestamp: new Date(n.timestamp)
          }));
        }
      } catch (error) {
        console.error('Failed to load from storage:', error);
      }
    }
  }
}

// Singleton instance
let issuesServiceInstance: IssuesDataService | null = null;

export const getIssuesDataService = (): IssuesDataService => {
  if (!issuesServiceInstance) {
    issuesServiceInstance = new IssuesDataService();
  }
  return issuesServiceInstance;
};

export default IssuesDataService;