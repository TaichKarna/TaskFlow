"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "user"
}

interface Project {
  id: string
  name: string
  assignedUsers: string[]
}

interface AssignUsersDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: Project | null
  onAssign: (userIds: string[]) => void
}

export function AssignUsersDialog({ open, onOpenChange, project, onAssign }: AssignUsersDialogProps) {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  useEffect(() => {
    // Mock users data
    setUsers([
      { id: "1", name: "John Doe", email: "john@example.com", role: "user" },
      { id: "2", name: "Jane Smith", email: "jane@example.com", role: "user" },
      { id: "3", name: "Bob Johnson", email: "bob@example.com", role: "user" },
    ])
  }, [])

  useEffect(() => {
    if (project) {
      setSelectedUsers(project.assignedUsers)
    }
  }, [project])

  const handleUserToggle = (userId: string) => {
    setSelectedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  const handleSubmit = () => {
    onAssign(selectedUsers)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign Users to Project</DialogTitle>
          <DialogDescription>Select users to assign to {project?.name}</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex items-center space-x-2">
                <Checkbox
                  id={user.id}
                  checked={selectedUsers.includes(user.id)}
                  onCheckedChange={() => handleUserToggle(user.id)}
                />
                <label
                  htmlFor={user.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {user.name} ({user.email})
                </label>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Assign Users</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
