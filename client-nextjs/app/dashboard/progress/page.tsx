"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, AlertCircle, TrendingUp } from "lucide-react"

interface ProjectProgress {
  id: string
  name: string
  totalTasks: number
  completedTasks: number
  pendingTasks: number
  overdueTasks: number
}

interface TaskStats {
  total: number
  completed: number
  pending: number
  overdue: number
}

export default function ProgressPage() {
  const [projects, setProjects] = useState<ProjectProgress[]>([])
  const [overallStats, setOverallStats] = useState<TaskStats>({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
  })

  useEffect(() => {
    // Mock data
    const mockProjects: ProjectProgress[] = [
      {
        id: "1",
        name: "Website Redesign",
        totalTasks: 15,
        completedTasks: 8,
        pendingTasks: 5,
        overdueTasks: 2,
      },
      {
        id: "2",
        name: "Mobile App",
        totalTasks: 25,
        completedTasks: 12,
        pendingTasks: 10,
        overdueTasks: 3,
      },
    ]

    setProjects(mockProjects)

    // Calculate overall stats
    const stats = mockProjects.reduce(
      (acc, project) => ({
        total: acc.total + project.totalTasks,
        completed: acc.completed + project.completedTasks,
        pending: acc.pending + project.pendingTasks,
        overdue: acc.overdue + project.overdueTasks,
      }),
      { total: 0, completed: 0, pending: 0, overdue: 0 },
    )

    setOverallStats(stats)
  }, [])

  const getProgressPercentage = (completed: number, total: number) => {
    return total > 0 ? (completed / total) * 100 : 0
  }

  const getCompletionRate = () => {
    return overallStats.total > 0 ? (overallStats.completed / overallStats.total) * 100 : 0
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Progress Overview</h1>
        <p className="text-muted-foreground">Track your task completion and project progress</p>
      </div>

      {/* Overall Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.total}</div>
            <p className="text-xs text-muted-foreground">Across all projects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{overallStats.completed}</div>
            <p className="text-xs text-muted-foreground">{Math.round(getCompletionRate())}% completion rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{overallStats.pending}</div>
            <p className="text-xs text-muted-foreground">In progress or waiting</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overallStats.overdue}</div>
            <p className="text-xs text-muted-foreground">Need immediate attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Progress</CardTitle>
          <CardDescription>Your completion rate across all projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Completion Rate</span>
              <span>{Math.round(getCompletionRate())}%</span>
            </div>
            <Progress value={getCompletionRate()} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{overallStats.completed} completed</span>
              <span>{overallStats.total} total tasks</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Progress */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Project Progress</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {project.name}
                  <Badge variant="outline">{project.totalTasks} tasks</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{Math.round(getProgressPercentage(project.completedTasks, project.totalTasks))}%</span>
                    </div>
                    <Progress value={getProgressPercentage(project.completedTasks, project.totalTasks)} />
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                      <div>
                        <div className="font-medium">{project.completedTasks}</div>
                        <div className="text-muted-foreground">Completed</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-blue-500" />
                      <div>
                        <div className="font-medium">{project.pendingTasks}</div>
                        <div className="text-muted-foreground">Pending</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <AlertCircle className="mr-2 h-4 w-4 text-red-500" />
                      <div>
                        <div className="font-medium">{project.overdueTasks}</div>
                        <div className="text-muted-foreground">Overdue</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
