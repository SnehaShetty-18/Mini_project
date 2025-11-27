import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-brand-primary to-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-civic-xl shadow-xl p-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-foreground mb-4">Choose Your Account Type</h1>
            <p className="text-text-secondary">
              Select the appropriate login option for your role in our civic engagement platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Citizen Login Card */}
            <div className="border border-border rounded-civic-xl p-6 hover:shadow-lg transition-shadow">
              <div className="text-center mb-6">
                <div className="mx-auto bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Icon name="UserIcon" size={24} className="text-primary" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">Citizen Account</h2>
                <p className="text-text-secondary text-sm">
                  Report issues, track progress, and engage with your community
                </p>
              </div>

              <Link 
                href="/auth/user-login"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-civic font-semibold civic-transition civic-hover inline-flex items-center justify-center"
              >
                Citizen Login
                <Icon name="ArrowRightIcon" size={16} className="ml-2" />
              </Link>

              <div className="mt-4 text-center">
                <Link href="/auth/register" className="text-primary hover:text-primary/80 text-sm font-medium">
                  Create Citizen Account
                </Link>
              </div>
            </div>

            {/* Admin Login Card */}
            <div className="border border-border rounded-civic-xl p-6 hover:shadow-lg transition-shadow">
              <div className="text-center mb-6">
                <div className="mx-auto bg-secondary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Icon name="ShieldCheckIcon" size={24} className="text-secondary" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">Authority Account</h2>
                <p className="text-text-secondary text-sm">
                  Manage reports, assign tasks, and oversee civic operations
                </p>
              </div>

              <Link 
                href="/auth/login"
                className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground py-3 rounded-civic font-semibold civic-transition civic-hover inline-flex items-center justify-center"
              >
                Authority Login
                <Icon name="ArrowRightIcon" size={16} className="ml-2" />
              </Link>

              <div className="mt-4 text-center">
                <Link href="/auth/register" className="text-secondary hover:text-secondary/80 text-sm font-medium">
                  Create Authority Account
                </Link>
              </div>
            </div>
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