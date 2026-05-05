import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
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
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { UserRole } from '../backend';
import { GraduationCap } from 'lucide-react';

interface ProfileSetupModalProps {
  open: boolean;
}

export default function ProfileSetupModal({ open }: ProfileSetupModalProps) {
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.student);
  const [department, setDepartment] = useState('');
  const [bio, setBio] = useState('');

  const saveProfile = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !department.trim()) return;
    await saveProfile.mutateAsync({
      name: name.trim(),
      role,
      department: department.trim(),
      bio: bio.trim(),
    });
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full bg-teal-700 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-cyan-400" />
            </div>
            <DialogTitle className="font-heading text-xl text-teal-800">
              Welcome to Campus Connect!
            </DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground">
            Set up your profile to join the campus community.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-teal-800 font-medium">Full Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Johnson"
              required
              className="border-teal-200 focus-visible:ring-teal-500"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="role" className="text-teal-800 font-medium">Role *</Label>
            <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
              <SelectTrigger className="border-teal-200 focus:ring-teal-500">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={UserRole.student}>Student</SelectItem>
                <SelectItem value={UserRole.faculty}>Faculty</SelectItem>
                <SelectItem value={UserRole.staff}>Staff</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="department" className="text-teal-800 font-medium">Department *</Label>
            <Input
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g. Computer Science"
              required
              className="border-teal-200 focus-visible:ring-teal-500"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bio" className="text-teal-800 font-medium">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell the campus community a bit about yourself…"
              rows={3}
              className="border-teal-200 focus-visible:ring-teal-500 resize-none"
            />
          </div>

          <Button
            type="submit"
            disabled={saveProfile.isPending || !name.trim() || !department.trim()}
            className="w-full bg-teal-700 hover:bg-teal-600 text-white font-medium rounded-lg"
          >
            {saveProfile.isPending ? 'Saving…' : 'Join Campus Connect'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
