'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/common/MainLayout';
import UserGuard from '@/components/common/UserGuard';
import { userAuth } from '@/services/authService';
import Icon from '@/components/ui/AppIcon';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const userData = await userAuth.getMe();
      setUser(userData);
      setFormData({
        name: userData.name,
        email: userData.email
      });
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setUpdating(true);
    
    try {
      const updatedUser = await userAuth.updateProfile({
        name: formData.name,
        email: formData.email
      });
      
      // Update local user data
      setUser(updatedUser);
      
      alert('Profile updated successfully!');
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile: ' + (error.response?.data?.message || 'Unknown error'));
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }
    
    setDeleting(true);
    
    try {
      await userAuth.deleteProfile();
      
      // Logout and redirect to home
      userAuth.logout();
      router.push('/');
      alert('Account deleted successfully!');
    } catch (error: any) {
      console.error('Failed to delete account:', error);
      alert('Failed to delete account: ' + (error.response?.data?.message || 'Unknown error'));
    } finally {
      setDeleting(false);
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

  return (
    <UserGuard>
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-card border border-border rounded-civic-xl p-6">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-foreground mb-2">Profile Settings</h1>
                <p className="text-text-secondary">
                  Manage your account information and preferences
                </p>
              </div>
              
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-civic focus:ring-2 focus:ring-primary focus:border-primary outline-none transition ${
                      errors.name ? 'border-red-500' : 'border-border'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-civic focus:ring-2 focus:ring-primary focus:border-primary outline-none transition ${
                      errors.email ? 'border-red-500' : 'border-border'
                    }`}
                    placeholder="Enter your email"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>
                
                <div className="flex justify-end space-x-4">
                  <button
                    type="submit"
                    disabled={updating}
                    className="px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-civic font-medium civic-transition flex items-center"
                  >
                    {updating ? (
                      <>
                        <Icon name="ArrowPathIcon" size={16} className="animate-spin mr-2" />
                        Updating...
                      </>
                    ) : (
                      'Update Profile'
                    )}
                  </button>
                </div>
              </form>
              
              <div className="mt-12 pt-6 border-t border-border">
                <h2 className="text-lg font-semibold text-foreground mb-4">Danger Zone</h2>
                <div className="bg-red-50 border border-red-200 rounded-civic-xl p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-red-800 mb-1">Delete Account</h3>
                      <p className="text-red-600 text-sm">
                        Permanently delete your account and all associated data. This action cannot be undone.
                      </p>
                    </div>
                    <button
                      onClick={handleDeleteAccount}
                      disabled={deleting}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-civic text-sm font-medium civic-transition flex items-center"
                    >
                      {deleting ? (
                        <>
                          <Icon name="ArrowPathIcon" size={14} className="animate-spin mr-2" />
                          Deleting...
                        </>
                      ) : (
                        'Delete Account'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </UserGuard>
  );
}