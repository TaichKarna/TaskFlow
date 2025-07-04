"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Clock, AlertCircle, Eye, FolderKanban } from "lucide-react"
import Link from "next/link"

interface Project {
  id: string
  name: string
  description: string
  totalTasks: number
  completedTasks: number
  pendingTasks: number
  overdueTasks: number
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    // Mock data - in real app, fetch assigned projects from API
    setProjects([
      {
        id: "1",
        name: "Website Redesign",
        description: "Complete redesign of company website with modern UI/UX principles",
        totalTasks: 15,
        completedTasks: 8,
        pendingTasks: 5,
        overdueTasks: 2,
      },
      {
        id: "2",
        name: "Mobile App Development",
        description: "Develop mobile application for iOS and Android platforms",
        totalTasks: 25,
        completedTasks: 12,
        pendingTasks: 10,
        overdueTasks: 3,
      },
      {
        id: "3",
        name: "API Integration",
        description: "Integrate third-party APIs and build internal API endpoints",
        totalTasks: 8,
        completedTasks: 6,
        pendingTasks: 2,
        overdueTasks: 0,
      },
    ])
  }, [])

  const getProgressPercentage = (completed: number, total: number) => {
    return total > 0 ? (completed / total) * 100 : 0
  }

  const totalStats = projects.reduce(
    (acc, project) => ({
      total: acc.total + project.totalTasks,
      completed: acc.completed + project.completedTasks,
      pending: acc.pending + project.pendingTasks,
      overdue: acc.overdue + project.overdueTasks,
    }),
    { total: 0, completed: 0, pending: 0, overdue: 0 },
  )

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">My Dashboard</h1>
        <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">Overview of your projects and tasks</p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Tasks</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{totalStats.total}</div>
            <p className="text-xs text-muted-foreground">Across {projects.length} projects</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-green-600">{totalStats.completed}</div>
            <p className="text-xs text-muted-foreground">
              {totalStats.total > 0 ? Math.round((totalStats.completed / totalStats.total) * 100) : 0}% completion
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-blue-600">{totalStats.pending}</div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-red-600">{totalStats.overdue}</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Projects Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-semibold">My Projects</h2>
          <Badge variant="outline" className="text-xs">
            {projects.length} active
          </Badge>
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id} className="border-0 shadow-md hover:shadow-lg transition-all duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1 min-w-0">
                    <CardTitle className="text-lg sm:text-xl truncate">{project.name}</CardTitle>
                    <Badge variant="outline" className="text-xs">
                      {project.totalTasks} tasks
                    </Badge>
                  </div>
                </div>
                <CardDescription className="text-sm line-clamp-2">{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span className="font-medium">
                      {Math.round(getProgressPercentage(project.completedTasks, project.totalTasks))}%
                    </span>
                  </div>
                  <Progress value={getProgressPercentage(project.completedTasks, project.totalTasks)} className="h-2" />
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs sm:text-sm">
                  <div className="flex items-center justify-center p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
                    <div className="text-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mx-auto mb-1" />
                      <div className="font-medium text-green-700 dark:text-green-400">{project.completedTasks}</div>
                      <div className="text-green-600 dark:text-green-500">Done</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <div className="text-center">
                      <Clock className="h-4 w-4 text-blue-500 mx-auto mb-1" />
                      <div className="font-medium text-blue-700 dark:text-blue-400">{project.pendingTasks}</div>
                      <div className="text-blue-600 dark:text-blue-500">Pending</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center p-2 rounded-lg bg-red-50 dark:bg-red-900/20">
                    <div className="text-center">
                      <AlertCircle className="h-4 w-4 text-red-500 mx-auto mb-1" />
                      <div className="font-medium text-red-700 dark:text-red-400">{project.overdueTasks}</div>
                      <div className="text-red-600 dark:text-red-500">Overdue</div>
                    </div>
                  </div>
                </div>

                <Button asChild className="w-full" size="sm">
                  <Link href={`/dashboard/projects/${project.id}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Tasks
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {projects.length === 0 && (
          <Card className="border-0 shadow-md">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FolderKanban className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No projects assigned</h3>
              <p className="text-muted-foreground text-center">
                Contact your administrator to get assigned to projects
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
