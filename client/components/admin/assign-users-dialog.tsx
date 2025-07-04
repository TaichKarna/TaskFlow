'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import api from '@/api';

interface MinifiedUser {
  id: string;
  name: string;
  email: string;
}

interface Project {
  id: string;
  name: string;
  assignedUsers: string[];
}

interface AssignUsersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project | null;
  onAssign: (members: { id: string; name: string; email: string }[]) => void;
}

export interface ProjectMember {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface ProjectWithMembers {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  members: ProjectMember[];
  createdAt: string;
  updatedAt: string;
}

export function AssignUsersDialog({
  open,
  onOpenChange,
  project,
  onAssign,
}: AssignUsersDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [availableUsers, setAvailableUsers] = useState<MinifiedUser[]>([]);
  const [assignedUsers, setAssignedUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    if (project) {
      setAssignedUsers(project.assignedUsers || []);
    }
  }, [project]);

  useEffect(() => {
    const fetchUsers = async (query: string) => {
      if (!query.trim()) return setAvailableUsers([]);
      try {
        const res = await api.get<MinifiedUser[]>(
          `/users/minified?search=${encodeURIComponent(query)}`
        );
        setAvailableUsers(res || []);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      }
    };

    const timeout = setTimeout(() => fetchUsers(searchQuery), 300);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  useEffect(() => {
    if (!open) {
      setSearchQuery('');
      setAvailableUsers([]);
    }
  }, [open]);

  const handleAssign = async (userId: string) => {
    if (!project) return;
    setLoading(userId);

    try {
      const res = await api.patch<ProjectWithMembers>(
        `/projects/${project.id}/assign/${userId}`
      );
      setAssignedUsers(res.members.map((m) => m.id));
      onAssign(res.members);
    } catch (err) {
      console.error('Failed to update user assignment:', err);
    } finally {
      setLoading(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Assign a User to Project</DialogTitle>
          <DialogDescription>
            Select one user to assign to{' '}
            <span className="font-medium">{project?.name}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <Input
            placeholder="Search users by name or email"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="space-y-2 max-h-[200px] overflow-auto">
            {availableUsers.length === 0 && searchQuery.trim() ? (
              <p className="text-sm text-muted-foreground">No users found.</p>
            ) : (
              availableUsers.map((user) => (
                <div key={user.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={user.id}
                    checked={assignedUsers.includes(user.id)}
                    onCheckedChange={() => handleAssign(user.id)}
                    disabled={loading === user.id}
                  />
                  <label
                    htmlFor={user.id}
                    className="text-sm font-medium leading-none"
                  >
                    {user.name} ({user.email})
                  </label>
                </div>
              ))
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
