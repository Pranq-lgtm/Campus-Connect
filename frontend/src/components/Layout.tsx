import React from 'react';
import { Outlet } from '@tanstack/react-router';
import Navigation from './Navigation';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-teal-900 text-teal-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-heading text-lg font-semibold text-white">
                <span className="text-blue-400">Campus</span><span className="text-green-400">Connect</span>
              </span>
              <span className="text-teal-400 text-sm">·</span>
              <span className="text-teal-400 text-sm">© {new Date().getFullYear()}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
