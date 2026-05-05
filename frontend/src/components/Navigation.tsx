import React, { useState } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Menu, X, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '../lib/utils';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Announcements', path: '/announcements' },
  { label: 'Events', path: '/events' },
  { label: 'Community', path: '/community' },
];

export default function Navigation() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: userProfile } = useGetCallerUserProfile();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: unknown) {
        const err = error as Error;
        if (err?.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-teal-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-full bg-cyan-400 flex items-center justify-center shadow-sm group-hover:bg-cyan-300 transition-colors">
              <GraduationCap className="w-5 h-5 text-teal-900" />
            </div>
            <span className="font-heading text-xl font-bold text-white tracking-wide hidden sm:block">
              <span className="text-blue-400">Campus</span><span className="text-green-400">Connect</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                  location.pathname === link.path
                    ? 'bg-teal-700 text-cyan-300'
                    : 'text-teal-100 hover:bg-teal-700 hover:text-white'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth + User */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && userProfile && (
              <span className="text-sm text-teal-200 font-medium">
                {userProfile.name}
              </span>
            )}
            <Button
              onClick={handleAuth}
              disabled={isLoggingIn}
              size="sm"
              className={cn(
                'rounded-full font-medium transition-all',
                isAuthenticated
                  ? 'bg-teal-700 hover:bg-teal-600 text-white border border-teal-600'
                  : 'bg-cyan-400 hover:bg-cyan-300 text-teal-900'
              )}
            >
              {isLoggingIn ? 'Signing in…' : isAuthenticated ? 'Sign Out' : 'Sign In'}
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-white p-2 rounded-md hover:bg-teal-700 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-teal-900 border-t border-teal-700 px-4 py-3 space-y-1 animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'block px-4 py-2.5 rounded-md text-sm font-medium transition-colors',
                location.pathname === link.path
                  ? 'bg-teal-700 text-cyan-300'
                  : 'text-teal-100 hover:bg-teal-700 hover:text-white'
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-teal-700 flex items-center justify-between">
            {isAuthenticated && userProfile && (
              <span className="text-sm text-teal-300">{userProfile.name}</span>
            )}
            <Button
              onClick={() => { handleAuth(); setMobileOpen(false); }}
              disabled={isLoggingIn}
              size="sm"
              className={cn(
                'rounded-full font-medium ml-auto',
                isAuthenticated
                  ? 'bg-teal-700 hover:bg-teal-600 text-white'
                  : 'bg-cyan-400 hover:bg-cyan-300 text-teal-900'
              )}
            >
              {isLoggingIn ? 'Signing in…' : isAuthenticated ? 'Sign Out' : 'Sign In'}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
