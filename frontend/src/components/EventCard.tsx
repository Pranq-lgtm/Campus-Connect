import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, MapPin, Calendar, User, Clock } from 'lucide-react';
import { formatEventDate, formatEventTime, isUpcoming } from '../lib/utils';
import type { Event, UserProfile } from '../backend';
import { cn } from '../lib/utils';

interface EventCardProps {
  event: Event;
  organizerProfile?: UserProfile | null;
  canDelete?: boolean;
  onDelete?: (id: bigint) => void;
  isDeleting?: boolean;
}

export default function EventCard({
  event,
  organizerProfile,
  canDelete,
  onDelete,
  isDeleting,
}: EventCardProps) {
  const upcoming = isUpcoming(event.date);

  return (
    <Card className={cn(
      'shadow-card hover:shadow-card-hover transition-shadow duration-200 border rounded-card animate-fade-in overflow-hidden',
      upcoming ? 'border-teal-200' : 'border-border opacity-80'
    )}>
      {/* Date accent bar */}
      <div className={cn('h-1.5', upcoming ? 'bg-cyan-400' : 'bg-muted')} />
      <CardHeader className="pb-2 pt-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-heading text-lg font-semibold text-teal-800 leading-snug line-clamp-2 flex-1">
            {event.title}
          </h3>
          {canDelete && onDelete && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(event.id)}
              disabled={isDeleting}
              className="shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
        {!upcoming && (
          <span className="text-xs text-muted-foreground font-medium">Past Event</span>
        )}
      </CardHeader>
      <CardContent className="pt-0 space-y-2">
        {event.description && (
          <p className="text-foreground/80 text-sm leading-relaxed line-clamp-3">
            {event.description}
          </p>
        )}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center gap-2 text-sm text-teal-700">
            <Calendar className="w-4 h-4 text-cyan-600 shrink-0" />
            <span className="font-medium">{formatEventDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4 shrink-0" />
            <span>{formatEventTime(event.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 shrink-0" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="w-4 h-4 shrink-0" />
            <span>{organizerProfile?.name ?? 'Campus Organizer'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
