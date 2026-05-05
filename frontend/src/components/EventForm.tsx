import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { EventInput } from '../backend';
import { dateToNanoseconds } from '../lib/utils';
import { PlusCircle } from 'lucide-react';

interface EventFormProps {
  onSubmit: (input: EventInput) => Promise<void>;
  isSubmitting: boolean;
}

export default function EventForm({ onSubmit, isSubmitting }: EventFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [location, setLocation] = useState('');
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dateStr || !location.trim()) return;
    await onSubmit({
      title: title.trim(),
      description: description.trim(),
      date: dateToNanoseconds(dateStr),
      location: location.trim(),
    });
    setTitle('');
    setDescription('');
    setDateStr('');
    setLocation('');
    setOpen(false);
  };

  if (!open) {
    return (
      <Button
        onClick={() => setOpen(true)}
        className="bg-teal-700 hover:bg-teal-600 text-white gap-2 rounded-lg"
      >
        <PlusCircle className="w-4 h-4" />
        Add Event
      </Button>
    );
  }

  return (
    <Card className="border border-teal-200 shadow-card rounded-card">
      <CardHeader className="pb-3">
        <CardTitle className="font-heading text-lg text-teal-800">New Event</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="evt-title" className="text-teal-800 font-medium">Title *</Label>
            <Input
              id="evt-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Event title"
              required
              className="border-teal-200 focus-visible:ring-teal-500"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="evt-desc" className="text-teal-800 font-medium">Description</Label>
            <Textarea
              id="evt-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the event…"
              rows={3}
              className="border-teal-200 focus-visible:ring-teal-500 resize-none"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="evt-date" className="text-teal-800 font-medium">Date & Time *</Label>
              <Input
                id="evt-date"
                type="datetime-local"
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value)}
                required
                className="border-teal-200 focus-visible:ring-teal-500"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="evt-location" className="text-teal-800 font-medium">Location *</Label>
              <Input
                id="evt-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Main Hall, Room 101"
                required
                className="border-teal-200 focus-visible:ring-teal-500"
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-teal-200 text-teal-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !title.trim() || !dateStr || !location.trim()}
              className="bg-teal-700 hover:bg-teal-600 text-white"
            >
              {isSubmitting ? 'Creating…' : 'Create Event'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
