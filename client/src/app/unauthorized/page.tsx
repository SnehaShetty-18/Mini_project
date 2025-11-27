import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-brand-primary to-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-civic-xl shadow-xl p-8 text-center">
          <div className="mx-auto bg-error/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
            <Icon name="ExclamationTriangleIcon" size={32} className="text-error" />
          </div>
          
          <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
          <p className="text-text-secondary mb-8">
            You don't have permission to access this page. Only administrators and officers can access the authority portal.
          </p>
          
          <div className="space-y-4">
            <Link 
              href="/" 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-civic font-semibold civic-transition civic-hover inline-flex items-center justify-center"
            >
              <Icon name="HomeIcon" size={20} className="mr-2" />
              Return to Homepage
            </Link>
            
            <Link 
              href="/auth/login" 
              className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground py-3 rounded-civic font-semibold civic-transition civic-hover inline-flex items-center justify-center"
            >
              <Icon name="ArrowRightOnRectangleIcon" size={20} className="mr-2" />
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}