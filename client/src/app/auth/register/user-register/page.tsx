'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/services/api';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

export default function UserRegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // For user registration, role is always 'citizen'
      const userData = { name, email, password, role: 'citizen' };
      
      await authAPI.register(userData);
      setSuccess(true);
      
      // Redirect to login after successful registration
      setTimeout(() => {
        router.push('/auth/user-login');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-brand-primary to-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-civic-xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <Icon name="UserPlusIcon" size={32} className="text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Citizen Registration</h1>
            <p className="text-text-secondary mt-2">
              Join our community to report and track civic issues
            </p>
          </div>

          {error && (
            <div className="bg-error/10 border border-error/20 text-error rounded-civic p-3 mb-6 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-success/10 border border-success/20 text-success rounded-civic p-3 mb-6 text-sm">
              Registration successful! Redirecting to login...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-civic focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-civic focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                placeholder="citizen@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-civic focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-civic focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-civic font-semibold civic-transition civic-hover flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </>
              ) : success ? (
                'Account Created!'
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/auth/user-login" className="text-primary hover:text-primary/80 text-sm font-medium">
              Already have an account? Sign in
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-border text-center">
            <Link href="/" className="text-text-secondary hover:text-foreground text-sm inline-flex items-center">
              <Icon name="ArrowLeftIcon" size={16} className="mr-2" />
              Back to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}