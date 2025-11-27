'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [admin, setAdmin] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Check authentication status on mount
  useEffect(() => {
    const userToken = localStorage.getItem('user_token');
    const adminToken = localStorage.getItem('admin_token');
    
    if (userToken) {
      try {
        // In a real app, you would decode the JWT token to get user info
        setUser({ id: 1, name: 'User' });
      } catch (e) {
        localStorage.removeItem('user_token');
      }
    }
    
    if (adminToken) {
      try {
        // In a real app, you would decode the JWT token to get admin info
        setAdmin({ id: 1, name: 'Admin', region: 'City Center' });
      } catch (e) {
        localStorage.removeItem('admin_token');
      }
    }
  }, []);

  const isActivePath = (href: string) => pathname === href;

  const handleLogout = () => {
    localStorage.removeItem('user_token');
    localStorage.removeItem('admin_token');
    setUser(null);
    setAdmin(null);
    router.push('/');
  };

  // Auto logout when user closes or navigates away from the website
  const handleAutoLogout = () => {
    localStorage.removeItem('user_token');
    localStorage.removeItem('admin_token');
    setUser(null);
    setAdmin(null);
  };

  useEffect(() => {
    // Add event listener for beforeunload
    const handleBeforeUnload = () => {
      handleAutoLogout();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="w-full">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-3 civic-transition hover:opacity-80">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-brand-primary rounded-lg flex items-center justify-center">
                  <Icon name="BuildingLibraryIcon" size={20} className="text-white" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold text-foreground">Civic Connect</h1>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {user && (
                <Link
                  href="/report"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-civic text-sm font-medium civic-transition ${
                    isActivePath('/report')
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon name="ExclamationTriangleIcon" size={16} />
                  <span>Report Issue</span>
                </Link>
              )}
              
              {user && (
                <Link
                  href="/community"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-civic text-sm font-medium civic-transition ${
                    isActivePath('/community')
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon name="UserGroupIcon" size={16} />
                  <span>Community</span>
                </Link>
              )}
              
              {user && (
                <Link
                  href="/my-complaints"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-civic text-sm font-medium civic-transition ${
                    isActivePath('/my-complaints')
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon name="DocumentTextIcon" size={16} />
                  <span>My Complaints</span>
                </Link>
              )}
              
              {admin && (
                <Link
                  href="/admin/dashboard"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-civic text-sm font-medium civic-transition ${
                    isActivePath('/admin/dashboard')
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon name="BuildingOfficeIcon" size={16} />
                  <span>Admin Dashboard</span>
                </Link>
              )}
            </nav>

            {/* Auth Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              {!user && !admin ? (
                <>
                  <Link
                    href="/login"
                    className="text-foreground hover:text-foreground/80 px-3 py-2 rounded-civic text-sm font-medium civic-transition"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-civic text-sm font-semibold civic-transition civic-hover"
                  >
                    Register
                  </Link>
                </>
              ) : (
                <div className="relative group">
                  <button className="flex items-center space-x-2 px-3 py-2 rounded-civic text-sm font-medium text-foreground hover:bg-muted civic-transition">
                    <Icon name="UserIcon" size={16} />
                    <span>{user ? user.name : admin ? admin.name : 'Account'}</span>
                  </button>
                  
                  <div className="absolute right-0 top-full mt-1 w-48 bg-popover border border-border rounded-civic-lg civic-shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible civic-transition">
                    <Link
                      href="/profile"
                      className="flex items-center space-x-2 px-4 py-3 text-sm text-popover-foreground hover:bg-muted civic-transition first:rounded-t-civic-lg"
                    >
                      <Icon name="UserIcon" size={16} />
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 px-4 py-3 text-sm text-popover-foreground hover:bg-muted civic-transition last:rounded-b-civic-lg w-full text-left"
                    >
                      <Icon name="ArrowLeftOnRectangleIcon" size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-civic text-foreground hover:bg-muted civic-transition"
              aria-label="Toggle mobile menu"
            >
              <Icon name={isMobileMenuOpen ? 'XMarkIcon' : 'Bars3Icon'} size={24} />
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-border bg-card">
              <div className="px-4 py-2 space-y-1">
                {user && (
                  <Link
                    href="/report"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-3 rounded-civic text-sm font-medium civic-transition ${
                      isActivePath('/report')
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon name="ExclamationTriangleIcon" size={18} />
                    <span>Report Issue</span>
                  </Link>
                )}
                
                {user && (
                  <Link
                    href="/community"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-3 rounded-civic text-sm font-medium civic-transition ${
                      isActivePath('/community')
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon name="UserGroupIcon" size={18} />
                    <span>Community</span>
                  </Link>
                )}
                
                {user && (
                  <Link
                    href="/my-complaints"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-3 rounded-civic text-sm font-medium civic-transition ${
                      isActivePath('/my-complaints')
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon name="DocumentTextIcon" size={18} />
                    <span>My Complaints</span>
                  </Link>
                )}
                
                {admin && (
                  <Link
                    href="/admin/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-3 rounded-civic text-sm font-medium civic-transition ${
                      isActivePath('/admin/dashboard')
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon name="BuildingOfficeIcon" size={18} />
                    <span>Admin Dashboard</span>
                  </Link>
                )}
                
                <div className="pt-2 mt-2 border-t border-border space-y-2">
                  {!user && !admin ? (
                    <>
                      <Link
                        href="/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block w-full text-foreground hover:text-foreground/80 px-4 py-3 rounded-civic text-sm font-medium text-center civic-transition"
                      >
                        Login
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block w-full bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-3 rounded-civic text-sm font-semibold text-center civic-transition"
                      >
                        Register
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/profile"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block w-full text-foreground hover:text-foreground/80 px-4 py-3 rounded-civic text-sm font-medium text-center civic-transition"
                      >
                        Profile
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="block w-full bg-muted hover:bg-muted/90 text-foreground px-4 py-3 rounded-civic text-sm font-medium text-center civic-transition"
                      >
                        Logout
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Civic Connect</h3>
              <p className="text-text-secondary text-sm">
                Connecting citizens with their community to build better neighborhoods together.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/report" className="text-text-secondary hover:text-foreground text-sm">Report Issue</Link></li>
                <li><Link href="/community" className="text-text-secondary hover:text-foreground text-sm">Community</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-text-secondary text-sm">
                For support, contact our team at support@civicconnect.com
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-text-secondary text-sm">
            <p>© {new Date().getFullYear()} Civic Connect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;