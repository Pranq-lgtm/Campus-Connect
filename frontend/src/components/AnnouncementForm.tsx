import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { AnnouncementInput } from '../backend';
import { PlusCircle } from 'lucide-react';

const CATEGORIES = ['Academic', 'Social', 'Administrative', 'Campus Life'];

interface AnnouncementFormProps {
  onSubmit: (input: AnnouncementInput) => Promise<void>;
  isSubmitting: boolean;
}

export default function AnnouncementForm({ onSubmit, isSubmitting }: AnnouncementFormProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Academic');
  const [body, setBody] = useState('');
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    await onSubmit({ title: title.trim(), category, body: body.trim() });
    setTitle('');
    setBody('');
    setCategory('Academic');
    setOpen(false);
  };

  if (!open) {
    return (
      <Button
        onClick={() => setOpen(true)}
        className="bg-teal-700 hover:bg-teal-600 text-white gap-2 rounded-lg"
      >
        <PlusCircle className="w-4 h-4" />
        Post Announcement
      </Button>
    );
  }

  return (
    <Card className="border border-teal-200 shadow-card rounded-card">
      <CardHeader className="pb-3">
        <CardTitle className="font-heading text-lg text-teal-800">New Announcement</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="ann-title" className="text-teal-800 font-medium">Title *</Label>
            <Input
              id="ann-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Announcement title"
              required
              className="border-teal-200 focus-visible:ring-teal-500"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ann-category" className="text-teal-800 font-medium">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="border-teal-200 focus:ring-teal-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ann-body" className="text-teal-800 font-medium">Message *</Label>
            <Textarea
              id="ann-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your announcement here…"
              rows={4}
              required
              className="border-teal-200 focus-visible:ring-teal-500 resize-none"
            />
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
              disabled={isSubmitting || !title.trim() || !body.trim()}
              className="bg-teal-700 hover:bg-teal-600 text-white"
            >
              {isSubmitting ? 'Posting…' : 'Post'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
