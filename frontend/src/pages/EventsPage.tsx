import React, { useMemo } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import {
  useListEvents,
  useCreateEvent,
  useDeleteEvent,
  useListProfiles,
  useGetCallerUserProfile,
} from '../hooks/useQueries';
import EventCard from '../components/EventCard';
import EventForm from '../components/EventForm';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarDays, AlertCircle } from 'lucide-react';
import type { EventInput } from '../backend';

export default function EventsPage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: events, isLoading, error } = useListEvents();
  const { data: profiles } = useListProfiles();
  const { data: myProfile } = useGetCallerUserProfile();
  const createEvent = useCreateEvent();
  const deleteEvent = useDeleteEvent();

  const profileMap = useMemo(() => {
    const map = new Map<string, import('../backend').UserProfile>();
    if (profiles) {
      for (const [principal, profile] of profiles) {
        map.set(principal.toString(), profile);
      }
    }
    return map;
  }, [profiles]);

  const { upcoming, past } = useMemo(() => {
    if (!events) return { upcoming: [], past: [] };
    const now = BigInt(Date.now()) * BigInt(1_000_000);
    const up = events.filter((e) => e.date >= now).sort((a, b) => Number(a.date - b.date));
    const ps = events.filter((e) => e.date < now).sort((a, b) => Number(b.date - a.date));
    return { upcoming: up, past: ps };
  }, [events]);

  const handleCreate = async (input: EventInput) => {
    await createEvent.mutateAsync(input);
  };

  const handleDelete = async (id: bigint) => {
    await deleteEvent.mutateAsync(id);
  };

  const myPrincipal = identity?.getPrincipal().toString();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CalendarDays className="w-6 h-6 text-teal-700" />
            <h1 className="font-heading text-3xl font-bold text-teal-800">
              <span className="text-blue-500">Campus</span> Events
            </h1>
          </div>
          <p className="text-muted-foreground">
            Discover and join upcoming events on campus.
          </p>
        </div>
        {isAuthenticated && myProfile && (
          <EventForm onSubmit={handleCreate} isSubmitting={createEvent.isPending} />
        )}
      </div>

      {/* Login prompt */}
      {!isAuthenticated && (
        <div className="mb-6 p-4 bg-teal-50 border border-teal-200 rounded-lg text-sm text-teal-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          Sign in to create and manage campus events.
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3 p-5 border border-border rounded-card">
              <Skeleton className="h-1.5 w-full" />
              <Skeleton className="h-5 w-3/4 mt-2" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-center py-12 text-destructive">
          <AlertCircle className="w-8 h-8 mx-auto mb-2" />
          <p>Failed to load events. Please try again.</p>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && events?.length === 0 && (
        <div className="text-center py-20">
          <CalendarDays className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
          <h3 className="font-heading text-xl font-semibold text-teal-800 mb-2">No events yet</h3>
          <p className="text-muted-foreground">Be the first to create a campus event.</p>
        </div>
      )}

      {/* Upcoming Events */}
      {!isLoading && upcoming.length > 0 && (
        <div className="mb-10">
          <h2 className="font-heading text-xl font-bold text-teal-800 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
            Upcoming Events
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {upcoming.map((evt) => (
              <EventCard
                key={evt.id.toString()}
                event={evt}
                organizerProfile={profileMap.get(evt.organizer.toString())}
                canDelete={isAuthenticated && myPrincipal === evt.organizer.toString()}
                onDelete={handleDelete}
                isDeleting={deleteEvent.isPending}
              />
            ))}
          </div>
        </div>
      )}

      {/* Past Events */}
      {!isLoading && past.length > 0 && (
        <div>
          <h2 className="font-heading text-xl font-bold text-teal-700/60 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-muted-foreground inline-block" />
            Past Events
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {past.map((evt) => (
              <EventCard
                key={evt.id.toString()}
                event={evt}
                organizerProfile={profileMap.get(evt.organizer.toString())}
                canDelete={isAuthenticated && myPrincipal === evt.organizer.toString()}
                onDelete={handleDelete}
                isDeleting={deleteEvent.isPending}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
