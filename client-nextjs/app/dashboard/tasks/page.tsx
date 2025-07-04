"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search, Calendar, CheckCircle2, Clock, AlertCircle } from "lucide-react"

interface Task {
  id: string
  title: string
  description: string
  status: "pending" | "in-progress" | "completed"
  dueDate: string
  projectId: string
  projectName: string
}

export default function MyTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    // Mock data - in real app, fetch all user's tasks across projects
    const mockTasks: Task[] = [
      {
        id: "1",
        title: "Design Homepage",
        description: "Create wireframes and mockups for the homepage",
        status: "completed",
        dueDate: "2024-01-15",
        projectId: "1",
        projectName: "Website Redesign",
      },
      {
        id: "2",
        title: "Implement Navigation",
        description: "Build responsive navigation component",
        status: "in-progress",
        dueDate: "2024-01-20",
        projectId: "1",
        projectName: "Website Redesign",
      },
      {
        id: "3",
        title: "Setup Database",
        description: "Configure database schema and connections",
        status: "pending",
        dueDate: "2024-01-25",
        projectId: "2",
        projectName: "Mobile App",
      },
      {
        id: "4",
        title: "User Authentication",
        description: "Implement login and registration functionality",
        status: "pending",
        dueDate: "2024-01-10",
        projectId: "2",
        projectName: "Mobile App",
      },
    ]
    setTasks(mockTasks)
  }, [])

  useEffect(() => {
    let filtered = tasks

    if (statusFilter !== "all") {
      filtered = filtered.filter((task) => task.status === statusFilter)
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.projectName.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Sort by due date
    filtered.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())

    setFilteredTasks(filtered)
  }, [tasks, statusFilter, searchTerm])

  const handleStatusChange = (taskId: string, newStatus: "pending" | "in-progress" | "completed") => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const isOverdue = (dueDate: string, status: string) => {
    return new Date(dueDate) < new Date() && status !== "completed"
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Tasks</h1>
        <p className="text-muted-foreground">View and manage all your tasks across projects</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tasks</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredTasks.map((task) => (
          <Card key={task.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{task.title}</CardTitle>
                  <CardDescription>{task.description}</CardDescription>
                  <Badge variant="outline" className="w-fit">
                    {task.projectName}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(task.status)}
                  <Badge className={getStatusColor(task.status)}>{task.status.replace("-", " ")}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span className={isOverdue(task.dueDate, task.status) ? "text-red-500 font-medium" : ""}>
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                    {isOverdue(task.dueDate, task.status) && " (Overdue)"}
                  </span>
                </div>
                <Select
                  value={task.status}
                  onValueChange={(value: "pending" | "in-progress" | "completed") => handleStatusChange(task.id, value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
