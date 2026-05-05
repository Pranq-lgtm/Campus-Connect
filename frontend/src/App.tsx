import React from 'react';
import {
  createRouter,
  createRoute,
  createRootRoute,
  RouterProvider,
} from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import Layout from './components/Layout';
import ProfileSetupModal from './components/ProfileSetupModal';
import HomePage from './pages/HomePage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import EventsPage from './pages/EventsPage';
import CommunityPage from './pages/CommunityPage';

// Root route with layout
const rootRoute = createRootRoute({
  component: AppShell,
});

function AppShell() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return (
    <>
      <Layout />
      <ProfileSetupModal open={showProfileSetup} />
    </>
  );
}

// Page routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const announcementsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/announcements',
  component: AnnouncementsPage,
});

const eventsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/events',
  component: EventsPage,
});

const communityRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/community',
  component: CommunityPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  announcementsRoute,
  eventsRoute,
  communityRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
