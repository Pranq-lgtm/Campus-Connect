import React, { useState, useMemo } from 'react';
import { useListProfiles } from '../hooks/useQueries';
import ProfileCard from '../components/ProfileCard';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Search, AlertCircle } from 'lucide-react';
import { UserRole } from '../backend';
import { cn } from '../lib/utils';

const ROLE_FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Students', value: UserRole.student },
  { label: 'Faculty', value: UserRole.faculty },
  { label: 'Staff', value: UserRole.staff },
];

export default function CommunityPage() {
  const { data: profiles, isLoading, error } = useListProfiles();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const filtered = useMemo(() => {
    if (!profiles) return [];
    const q = search.toLowerCase().trim();
    return profiles.filter(([, profile]) => {
      const matchesSearch =
        !q ||
        profile.name.toLowerCase().includes(q) ||
        profile.department.toLowerCase().includes(q);
      const matchesRole = roleFilter === 'all' || profile.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [profiles, search, roleFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Users className="w-6 h-6 text-teal-700" />
          <h1 className="font-heading text-3xl font-bold text-teal-800">Community Directory</h1>
        </div>
        <p className="text-muted-foreground">
          Connect with students, faculty, and staff across campus.
        </p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or department…"
            className="pl-9 border-teal-200 focus-visible:ring-teal-500"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {ROLE_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setRoleFilter(f.value)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium border transition-colors',
                roleFilter === f.value
                  ? 'bg-teal-700 text-white border-teal-700'
                  : 'bg-white text-teal-700 border-teal-200 hover:bg-teal-50'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      {profiles && profiles.length > 0 && (
        <p className="text-sm text-muted-foreground mb-5">
          Showing <span className="font-semibold text-teal-700">{filtered.length}</span> of{' '}
          <span className="font-semibold text-teal-700">{profiles.length}</span> members
        </p>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="p-5 border border-border rounded-card space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="w-11 h-11 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
              <Skeleton className="h-3 w-1/3" />
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-center py-12 text-destructive">
          <AlertCircle className="w-8 h-8 mx-auto mb-2" />
          <p>Failed to load community members. Please try again.</p>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && filtered.length === 0 && (
        <div className="text-center py-20">
          <Users className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
          <h3 className="font-heading text-xl font-semibold text-teal-800 mb-2">
            {search || roleFilter !== 'all' ? 'No members found' : 'No members yet'}
          </h3>
          <p className="text-muted-foreground">
            {search || roleFilter !== 'all'
              ? 'Try adjusting your search or filter.'
              : 'Be the first to join the campus community.'}
          </p>
        </div>
      )}

      {/* Profiles Grid */}
      {!isLoading && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(([principal, profile]) => (
            <ProfileCard key={principal.toString()} profile={profile} />
          ))}
        </div>
      )}
    </div>
  );
}
