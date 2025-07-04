'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { ProjectDialog } from '@/components/admin/project-dialog';
import { AssignUsersDialog } from '@/components/admin/assign-users-dialog';
import Link from 'next/link';
import {
  createProject,
  fetchProjectStats,
  updateProject,
} from '@/api/project/project';
import { ProjectWithStats as Project } from '@/api/project/project';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [assigningProject, setAssigningProject] = useState<Project | null>(
    null
  );

  const loadProjects = async () => {
    try {
      const data = await fetchProjectStats();
      setProjects(data);
    } catch (error) {
      console.error('Failed to fetch project stats:', error);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleAddProject = () => {
    setEditingProject(null);
    setIsProjectDialogOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsProjectDialogOpen(true);
  };

  const handleAssignUsers = (project: Project) => {
    setAssigningProject(project);
    setIsAssignDialogOpen(true);
  };

  const handleSaveProject = async (
    projectData: Omit<
      Project,
      | 'id'
      | 'assignedUsers'
      | 'totalTasks'
      | 'completedTasks'
      | 'pendingTasks'
      | 'overdueTasks'
    >
  ) => {
    if (editingProject) {
      await updateProject(editingProject.id, { ...projectData });
      setProjects(
        projects.map((project) =>
          project.id === editingProject.id
            ? { ...project, ...projectData }
            : project
        )
      );
    } else {
      await createProject(projectData);
      await loadProjects();
    }
    setIsProjectDialogOpen(false);
  };

  const handleAssignUsersToProject = async (
    members: { id: string; name: string; email: string }[]
  ) => {
    if (assigningProject) {
      setProjects(
        projects.map((project) =>
          project.id === assigningProject.id
            ? { ...project, assignedUsers: members }
            : project
        )
      );
    }
    setIsAssignDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">
            Manage projects and assign users
          </p>
        </div>
        <Button onClick={handleAddProject}>
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {project.name}
                <Badge variant="outline">
                  <Users className="mr-1 h-3 w-3" />
                  {project.assignedUsers.length}
                </Badge>
              </CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span>{project.completedTasks} Completed</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-blue-500" />
                    <span>{project.pendingTasks} Pending</span>
                  </div>
                  <div className="flex items-center">
                    <AlertCircle className="mr-2 h-4 w-4 text-red-500" />
                    <span>{project.overdueTasks} Overdue</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/projects/${project.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditProject(project)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAssignUsers(project)}
                  >
                    Assign Users
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <ProjectDialog
        open={isProjectDialogOpen}
        onOpenChange={setIsProjectDialogOpen}
        project={editingProject}
        onSave={handleSaveProject}
      />

      <AssignUsersDialog
        open={isAssignDialogOpen}
        onOpenChange={setIsAssignDialogOpen}
        project={
          assigningProject
            ? {
                id: assigningProject.id,
                name: assigningProject.name,
                assignedUsers: assigningProject.assignedUsers.map((u) => u.id),
              }
            : null
        }
        onAssign={handleAssignUsersToProject}
      />
    </div>
  );
}
