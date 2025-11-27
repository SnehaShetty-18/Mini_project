'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { adminAuth } from '@/services/authService';
import Icon from '@/components/ui/AppIcon';

export default function AdminRegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    municipal_office: '',
    region: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

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
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.municipal_office.trim()) {
      newErrors.municipal_office = 'Municipal office is required';
    }
    
    if (!formData.region.trim()) {
      newErrors.region = 'Region is required';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const { name, email, password, municipal_office, region } = formData;
      const response = await adminAuth.register({ name, email, password, municipal_office, region });
      
      // Store token in localStorage
      localStorage.setItem('admin_token', response.token);
      
      // Redirect to admin dashboard
      router.push('/admin/dashboard');
    } catch (error: any) {
      setErrors({
        form: error.response?.data?.message || 'Registration failed. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-brand-secondary to-accent flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-civic-xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">Admin Registration</h1>
            <p className="text-text-secondary">
              Create an administrative account for Civic Connect
            </p>
          </div>

          {errors.form && (
            <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-civic text-sm">
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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
                className={`w-full px-4 py-3 border rounded-civic focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition ${
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
                className={`w-full px-4 py-3 border rounded-civic focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition ${
                  errors.email ? 'border-red-500' : 'border-border'
                }`}
                placeholder="Enter your email"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="municipal_office" className="block text-sm font-medium text-foreground mb-1">
                Municipal Office
              </label>
              <input
                id="municipal_office"
                name="municipal_office"
                type="text"
                value={formData.municipal_office}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-civic focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition ${
                  errors.municipal_office ? 'border-red-500' : 'border-border'
                }`}
                placeholder="Enter municipal office name"
              />
              {errors.municipal_office && <p className="mt-1 text-sm text-red-600">{errors.municipal_office}</p>}
            </div>

            <div>
              <label htmlFor="region" className="block text-sm font-medium text-foreground mb-1">
                Region
              </label>
              <input
                id="region"
                name="region"
                type="text"
                value={formData.region}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-civic focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition ${
                  errors.region ? 'border-red-500' : 'border-border'
                }`}
                placeholder="Enter region"
              />
              {errors.region && <p className="mt-1 text-sm text-red-600">{errors.region}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-civic focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition ${
                  errors.password ? 'border-red-500' : 'border-border'
                }`}
                placeholder="Create a password"
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-civic focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition ${
                  errors.confirmPassword ? 'border-red-500' : 'border-border'
                }`}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground py-3 rounded-civic font-semibold civic-transition civic-hover flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Icon name="ArrowPathIcon" size={16} className="animate-spin mr-2" />
                  Creating Account...
                </>
              ) : (
                'Create Admin Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-text-secondary text-sm">
              Already have an account?{' '}
              <Link href="/admin/login" className="text-secondary hover:text-secondary/80 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}