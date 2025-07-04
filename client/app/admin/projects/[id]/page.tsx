'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  MoreHorizontal,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import api from '@/api';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  createdBy: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  assignedTo: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  createdAt: string;
  dueDate: string;
  completedAt?: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  assignedUsers: Array<{
    id: string;
    name: string;
    email: string;
    avatar?: string;
  }>;
  tasks: Task[];
  createdAt: string;
}

export default function AdminProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    if (!params.id) return;

    const fetchProject = async () => {
      setLoading(true);
      try {
        const res = await api.get<Project>(`/projects/${params.id}/detailed`);
        setProject(res);
      } catch (err) {
        setError('Failed to fetch project details');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [params.id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-8 w-8 bg-muted animate-pulse rounded" />
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <h2 className="text-2xl font-semibold">Project not found</h2>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  const completedTasks = project.tasks.filter(
    (task) => task.status === 'completed'
  ).length;
  const inProgressTasks = project.tasks.filter(
    (task) => task.status === 'in_progress'
  ).length;
  const pendingTasks = project.tasks.filter(
    (task) => task.status === 'pending'
  ).length;
  const overdueTasks = project.tasks.filter(
    (task) => task.status === 'overdue'
  ).length;
  const totalTasks = project.tasks.length;
  const progressPercentage =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in_progress':
        return 'bg-blue-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'overdue':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const TaskCard = ({ task }: { task: Task }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base">{task.title}</CardTitle>
            <CardDescription className="text-sm">
              {task.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge
            variant={getPriorityColor(task.priority)}
            className="capitalize"
          >
            {task.priority}
          </Badge>
          <Badge variant="outline" className="capitalize">
            <div
              className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(
                task.status
              )}`}
            />
            {task.status.replace('-', ' ')}
          </Badge>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Created by:</span>
            <div className="flex items-center gap-2">
              <span>{task.createdBy.name}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Due date:</span>
            <span
              className={
                task.status === 'overdue' ? 'text-red-600 font-medium' : ''
              }
            >
              {formatDate(task.dueDate)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Created:</span>
            <span>{formatDate(task.createdAt)}</span>
          </div>

          {task.completedAt && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Completed:</span>
              <span className="text-green-600">
                {formatDate(task.completedAt)}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const groupTasksByCreator = (tasks: Task[]) => {
    const grouped = tasks.reduce((acc, task) => {
      const creatorId = task.createdBy.id;
      if (!acc[creatorId]) {
        acc[creatorId] = {
          creator: task.createdBy,
          tasks: [],
        };
      }
      acc[creatorId].tasks.push(task);
      return acc;
    }, {} as Record<string, { creator: Task['createdBy']; tasks: Task[] }>);

    return Object.values(grouped);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Projects
        </Button>
      </div>

      {/* Project Overview */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <p className="text-muted-foreground mt-1">{project.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <div className="flex -space-x-2">
              {project.assignedUsers.slice(0, 3).map((user) => (
                <Avatar
                  key={user.id}
                  className="h-8 w-8 border-2 border-background"
                >
                  <AvatarImage src={user.avatar || '/placeholder.svg'} />
                  <AvatarFallback className="text-xs">
                    {user.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
              ))}
              {project.assignedUsers.length > 3 && (
                <div className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium">
                  +{project.assignedUsers.length - 3}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Project Progress</span>
            <span className="font-medium">
              {Math.round(progressPercentage)}% Complete
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {completedTasks}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {inProgressTasks}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {overdueTasks}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Tasks ({totalTasks})</TabsTrigger>
          <TabsTrigger value="status">By Status</TabsTrigger>
          <TabsTrigger value="creator">By Creator</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {project.tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="status" className="space-y-6">
          {['completed', 'in_progress', 'pending', 'overdue'].map((status) => {
            const statusTasks = project.tasks.filter(
              (task) => task.status === status
            );
            if (statusTasks.length === 0) return null;

            return (
              <div key={status} className="space-y-4">
                <h3 className="text-lg font-semibold capitalize flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${getStatusColor(
                      status as Task['status']
                    )}`}
                  />
                  {status.replace('-', ' ')} ({statusTasks.length})
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {statusTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </div>
            );
          })}
        </TabsContent>

        <TabsContent value="creator" className="space-y-6">
          {groupTasksByCreator(project.tasks).map(({ creator, tasks }) => (
            <div key={creator.id} className="space-y-4">
              <div className="flex items-center gap-3">
                <div>
                  <h3 className="text-lg font-semibold">{creator.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {tasks.length} tasks created
                  </p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {tasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <div className="space-y-4">
            {project.tasks
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              )
              .map((task) => (
                <Card key={task.id} className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-3 h-3 rounded-full ${getStatusColor(
                          task.status
                        )}`}
                      />
                      <div className="w-px h-8 bg-border mt-2" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{task.title}</h4>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(task.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {task.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-5 w-5">
                            <AvatarImage
                              src={task.createdBy.avatar || '/placeholder.svg'}
                            />
                            <AvatarFallback className="text-xs">
                              {task.createdBy.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span>Created by {task.createdBy.name}</span>
                        </div>
                        <Badge
                          variant={getPriorityColor(task.priority)}
                          className="capitalize"
                        >
                          {task.priority}
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                          {task.status.replace('-', ' ')}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
