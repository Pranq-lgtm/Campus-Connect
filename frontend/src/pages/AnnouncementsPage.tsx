import React, { useMemo } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import {
  useListAnnouncements,
  useCreateAnnouncement,
  useDeleteAnnouncement,
  useListProfiles,
  useGetCallerUserProfile,
} from '../hooks/useQueries';
import AnnouncementCard from '../components/AnnouncementCard';
import AnnouncementForm from '../components/AnnouncementForm';
import { Skeleton } from '@/components/ui/skeleton';
import { Megaphone, AlertCircle } from 'lucide-react';
import type { AnnouncementInput } from '../backend';
import { Principal } from '@dfinity/principal';

export default function AnnouncementsPage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: announcements, isLoading, error } = useListAnnouncements();
  const { data: profiles } = useListProfiles();
  const { data: myProfile } = useGetCallerUserProfile();
  const createAnnouncement = useCreateAnnouncement();
  const deleteAnnouncement = useDeleteAnnouncement();

  const profileMap = useMemo(() => {
    const map = new Map<string, import('../backend').UserProfile>();
    if (profiles) {
      for (const [principal, profile] of profiles) {
        map.set(principal.toString(), profile);
      }
    }
    return map;
  }, [profiles]);

  const sorted = useMemo(() => {
    if (!announcements) return [];
    return [...announcements].sort((a, b) => Number(b.timestamp - a.timestamp));
  }, [announcements]);

  const handleCreate = async (input: AnnouncementInput) => {
    await createAnnouncement.mutateAsync(input);
  };

  const handleDelete = async (id: bigint) => {
    await deleteAnnouncement.mutateAsync(id);
  };

  const myPrincipal = identity?.getPrincipal().toString();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Megaphone className="w-6 h-6 text-teal-700" />
            <h1 className="font-heading text-3xl font-bold text-teal-800">Announcements</h1>
          </div>
          <p className="text-muted-foreground">
            Stay up to date with the latest campus news and updates.
          </p>
        </div>
        {isAuthenticated && myProfile && (
          <AnnouncementForm
            onSubmit={handleCreate}
            isSubmitting={createAnnouncement.isPending}
          />
        )}
      </div>

      {/* Login prompt */}
      {!isAuthenticated && (
        <div className="mb-6 p-4 bg-teal-50 border border-teal-200 rounded-lg text-sm text-teal-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          Sign in to post announcements to the campus community.
        </div>
      )}

      {/* Form for authenticated users without profile */}
      {isAuthenticated && !myProfile && (
        <div className="mb-6 p-4 bg-cyan-50 border border-cyan-200 rounded-lg text-sm text-cyan-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          Complete your profile setup to post announcements.
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3 p-5 border border-border rounded-card">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-center py-12 text-destructive">
          <AlertCircle className="w-8 h-8 mx-auto mb-2" />
          <p>Failed to load announcements. Please try again.</p>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && sorted.length === 0 && (
        <div className="text-center py-20">
          <Megaphone className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
          <h3 className="font-heading text-xl font-semibold text-teal-800 mb-2">No announcements yet</h3>
          <p className="text-muted-foreground">Be the first to post an announcement to the campus community.</p>
        </div>
      )}

      {/* Announcements Grid */}
      {!isLoading && sorted.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sorted.map((ann) => (
            <AnnouncementCard
              key={ann.id.toString()}
              announcement={ann}
              authorProfile={profileMap.get(ann.author.toString())}
              canDelete={isAuthenticated && myPrincipal === ann.author.toString()}
              onDelete={handleDelete}
              isDeleting={deleteAnnouncement.isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
}
