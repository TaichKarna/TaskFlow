"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, FolderKanban, CheckSquare, TrendingUp, AlertTriangle } from "lucide-react"

interface AnalyticsData {
  totalUsers: number
  totalProjects: number
  totalTasks: number
  completedTasks: number
  overdueTasks: number
  projectStats: {
    id: string
    name: string
    assignedUsers: number
    totalTasks: number
    completedTasks: number
    completionRate: number
  }[]
  userProductivity: {
    id: string
    name: string
    assignedTasks: number
    completedTasks: number
    completionRate: number
  }[]
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)

  useEffect(() => {
    // Mock analytics data
    const mockAnalytics: AnalyticsData = {
      totalUsers: 15,
      totalProjects: 8,
      totalTasks: 120,
      completedTasks: 75,
      overdueTasks: 12,
      projectStats: [
        {
          id: "1",
          name: "Website Redesign",
          assignedUsers: 4,
          totalTasks: 25,
          completedTasks: 18,
          completionRate: 72,
        },
        {
          id: "2",
          name: "Mobile App",
          assignedUsers: 6,
          totalTasks: 35,
          completedTasks: 20,
          completionRate: 57,
        },
        {
          id: "3",
          name: "API Development",
          assignedUsers: 3,
          totalTasks: 20,
          completedTasks: 15,
          completionRate: 75,
        },
      ],
      userProductivity: [
        {
          id: "1",
          name: "John Doe",
          assignedTasks: 12,
          completedTasks: 10,
          completionRate: 83,
        },
        {
          id: "2",
          name: "Jane Smith",
          assignedTasks: 15,
          completedTasks: 12,
          completionRate: 80,
        },
        {
          id: "3",
          name: "Bob Johnson",
          assignedTasks: 8,
          completedTasks: 5,
          completionRate: 63,
        },
      ],
    }

    setAnalytics(mockAnalytics)
  }, [])

  if (!analytics) {
    return <div>Loading...</div>
  }

  const overallCompletionRate = (analytics.completedTasks / analytics.totalTasks) * 100

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Overview of system performance and user productivity</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalProjects}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalTasks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{Math.round(overallCompletionRate)}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Tasks</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{analytics.overdueTasks}</div>
          </CardContent>
        </Card>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle>System-wide Progress</CardTitle>
          <CardDescription>Overall task completion across all projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Completion</span>
              <span>{Math.round(overallCompletionRate)}%</span>
            </div>
            <Progress value={overallCompletionRate} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{analytics.completedTasks} completed</span>
              <span>{analytics.totalTasks} total tasks</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Project Performance</CardTitle>
          <CardDescription>Completion rates and statistics by project</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.projectStats.map((project) => (
              <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium">{project.name}</h3>
                    <Badge variant="outline">
                      <Users className="mr-1 h-3 w-3" />
                      {project.assignedUsers} users
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {project.completedTasks} of {project.totalTasks} tasks completed
                  </p>
                </div>
                <div className="text-right space-y-1">
                  <div className="text-lg font-semibold">{project.completionRate}%</div>
                  <Progress value={project.completionRate} className="w-24 h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Productivity */}
      <Card>
        <CardHeader>
          <CardTitle>User Productivity</CardTitle>
          <CardDescription>Task completion rates by user</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.userProductivity.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <h3 className="font-medium">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {user.completedTasks} of {user.assignedTasks} tasks completed
                  </p>
                </div>
                <div className="text-right space-y-1">
                  <div className="text-lg font-semibold">{user.completionRate}%</div>
                  <Progress value={user.completionRate} className="w-24 h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
