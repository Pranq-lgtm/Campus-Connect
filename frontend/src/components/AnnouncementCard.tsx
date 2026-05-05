import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, User, Clock } from 'lucide-react';
import { formatTimestamp } from '../lib/utils';
import type { Announcement, UserProfile } from '../backend';
import { cn } from '../lib/utils';

const CATEGORY_COLORS: Record<string, string> = {
  Academic: 'bg-teal-100 text-teal-800 border-teal-200',
  Social: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  Administrative: 'bg-blue-100 text-blue-800 border-blue-200',
  'Campus Life': 'bg-purple-100 text-purple-800 border-purple-200',
};

interface AnnouncementCardProps {
  announcement: Announcement;
  authorProfile?: UserProfile | null;
  canDelete?: boolean;
  onDelete?: (id: bigint) => void;
  isDeleting?: boolean;
}

export default function AnnouncementCard({
  announcement,
  authorProfile,
  canDelete,
  onDelete,
  isDeleting,
}: AnnouncementCardProps) {
  const categoryClass = CATEGORY_COLORS[announcement.category] ?? 'bg-muted text-muted-foreground border-border';

  return (
    <Card className="shadow-card hover:shadow-card-hover transition-shadow duration-200 border border-border rounded-card animate-fade-in">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-heading text-lg font-semibold text-teal-800 leading-snug line-clamp-2">
              {announcement.title}
            </h3>
          </div>
          {canDelete && onDelete && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(announcement.id)}
              disabled={isDeleting}
              className="shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap mt-1">
          <span className={cn('text-xs font-medium px-2.5 py-0.5 rounded-full border', categoryClass)}>
            {announcement.category}
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-foreground/80 text-sm leading-relaxed line-clamp-4 mb-3">
          {announcement.body}
        </p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <User className="w-3.5 h-3.5" />
            {authorProfile?.name ?? 'Campus Member'}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {formatTimestamp(announcement.timestamp)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
