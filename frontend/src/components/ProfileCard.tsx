import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { UserProfile } from '../backend';
import { UserRole } from '../backend';
import { cn } from '../lib/utils';

const ROLE_STYLES: Record<UserRole, { label: string; className: string }> = {
  [UserRole.student]: {
    label: 'Student',
    className: 'bg-teal-100 text-teal-800 border-teal-200',
  },
  [UserRole.faculty]: {
    label: 'Faculty',
    className: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  },
  [UserRole.staff]: {
    label: 'Staff',
    className: 'bg-blue-100 text-blue-800 border-blue-200',
  },
};

interface ProfileCardProps {
  profile: UserProfile;
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  const roleStyle = ROLE_STYLES[profile.role] ?? {
    label: String(profile.role),
    className: 'bg-muted text-muted-foreground border-border',
  };

  const initials = profile.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <Card className="shadow-card hover:shadow-card-hover transition-shadow duration-200 border border-border rounded-card animate-fade-in">
      <CardContent className="pt-5 pb-4">
        <div className="flex items-start gap-3">
          <Avatar className="w-11 h-11 shrink-0 bg-teal-100 border border-teal-200">
            <AvatarFallback className="bg-teal-700 text-white font-heading font-semibold text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-heading font-semibold text-teal-800 truncate">{profile.name}</h3>
            <p className="text-sm text-muted-foreground truncate">{profile.department}</p>
            <span
              className={cn(
                'inline-block mt-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full border',
                roleStyle.className
              )}
            >
              {roleStyle.label}
            </span>
          </div>
        </div>
        {profile.bio && (
          <p className="mt-3 text-sm text-foreground/70 leading-relaxed line-clamp-2 border-t border-border pt-3">
            {profile.bio}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
