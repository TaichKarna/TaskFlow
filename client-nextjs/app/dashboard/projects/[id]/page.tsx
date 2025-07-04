"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus, Search, Calendar, CheckCircle2, Clock, AlertCircle, Trash2, Edit, Filter } from "lucide-react"
import { TaskDialog } from "@/components/user/task-dialog"
import { useToast } from "@/hooks/use-toast"

interface Task {
  id: string
  title: string
  description: string
  status: "pending" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
  dueDate: string
  projectId: string
}

export default function ProjectTasksPage() {
  const params = useParams()
  const projectId = params.id as string
  const { toast } = useToast()

  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null)

  useEffect(() => {
    // Mock data - in real app, fetch tasks for this project
    const mockTasks: Task[] = [
      {
        id: "1",
        title: "Design Homepage Layout",
        description: "Create wireframes and mockups for the homepage with modern design principles",
        status: "completed",
        priority: "high",
        dueDate: "2024-01-15",
        projectId: projectId,
      },
      {
        id: "2",
        title: "Implement Navigation Component",
        description: "Build responsive navigation component with mobile menu support",
        status: "in-progress",
        priority: "medium",
        dueDate: "2024-01-20",
        projectId: projectId,
      },
      {
        id: "3",
        title: "Setup Database Schema",
        description: "Configure database schema and establish connections with proper indexing",
        status: "pending",
        priority: "high",
        dueDate: "2024-01-25",
        projectId: projectId,
      },
      {
        id: "4",
        title: "User Authentication System",
        description: "Implement secure login and registration functionality with JWT tokens",
        status: "pending",
        priority: "high",
        dueDate: "2024-01-10",
        projectId: projectId,
      },
      {
        id: "5",
        title: "API Documentation",
        description: "Create comprehensive API documentation using Swagger/OpenAPI",
        status: "pending",
        priority: "low",
        dueDate: "2024-02-01",
        projectId: projectId,
      },
    ]
    setTasks(mockTasks)
  }, [projectId])

  useEffect(() => {
    let filtered = tasks

    if (statusFilter !== "all") {
      filtered = filtered.filter((task) => task.status === statusFilter)
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter((task) => task.priority === priorityFilter)
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Sort by due date, then by priority
    filtered.sort((a, b) => {
      const dateA = new Date(a.dueDate).getTime()
      const dateB = new Date(b.dueDate).getTime()
      if (dateA !== dateB) return dateA - dateB

      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })

    setFilteredTasks(filtered)
  }, [tasks, statusFilter, priorityFilter, searchTerm])

  const handleAddTask = () => {
    setEditingTask(null)
    setIsDialogOpen(true)
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setIsDialogOpen(true)
  }

  const handleDeleteTask = (taskId: string) => {
    setDeleteTaskId(taskId)
  }

  const confirmDelete = () => {
    if (deleteTaskId) {
      setTasks(tasks.filter((task) => task.id !== deleteTaskId))
      toast({
        title: "Task deleted",
        description: "The task has been successfully removed.",
      })
      setDeleteTaskId(null)
    }
  }

  const handleSaveTask = (taskData: Omit<Task, "id" | "projectId">) => {
    if (editingTask) {
      setTasks(tasks.map((task) => (task.id === editingTask.id ? { ...task, ...taskData } : task)))
      toast({
        title: "Task updated",
        description: "Task has been successfully updated.",
      })
    } else {
      const newTask: Task = {
        id: Date.now().toString(),
        ...taskData,
        projectId: projectId,
      }
      setTasks([...tasks, newTask])
      toast({
        title: "Task created",
        description: "New task has been successfully added.",
      })
    }
    setIsDialogOpen(false)
  }

  const handleStatusChange = (taskId: string, newStatus: "pending" | "in-progress" | "completed") => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)))
    toast({
      title: "Status updated",
      description: `Task status changed to ${newStatus.replace("-", " ")}.`,
    })
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
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "in-progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      default:
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    }
  }

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && tasks.find((t) => t.dueDate === dueDate)?.status !== "completed"
  }

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === "completed").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    pending: tasks.filter((t) => t.status === "pending").length,
    overdue: tasks.filter((t) => isOverdue(t.dueDate)).length,
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight">Project Tasks</h1>
          <p className="text-lg text-muted-foreground">Manage and track tasks for this project</p>
        </div>
        <Button onClick={handleAddTask} size="lg" className="shadow-lg">
          <Plus className="mr-2 h-5 w-5" />
          Add Task
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <div className="h-4 w-4 rounded-full bg-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskStats.total}</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{taskStats.completed}</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{taskStats.inProgress}</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <AlertCircle className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{taskStats.pending}</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{taskStats.overdue}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filters</span>
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
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tasks List */}
      <div className="grid gap-4">
        {filteredTasks.map((task) => (
          <Card key={task.id} className="border-0 shadow-md hover:shadow-lg transition-all duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center space-x-2">
                    <CardTitle className="text-lg">{task.title}</CardTitle>
                    <Badge className={getPriorityColor(task.priority)} variant="secondary">
                      {task.priority}
                    </Badge>
                  </div>
                  <CardDescription className="text-base">{task.description}</CardDescription>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  {getStatusIcon(task.status)}
                  <Badge className={getStatusColor(task.status)} variant="secondary">
                    {task.status.replace("-", " ")}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span className={isOverdue(task.dueDate) ? "text-red-500 font-medium" : ""}>
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                    {isOverdue(task.dueDate) && " (Overdue)"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Select
                    value={task.status}
                    onValueChange={(value: "pending" | "in-progress" | "completed") =>
                      handleStatusChange(task.id, value)
                    }
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
                  <Button variant="outline" size="sm" onClick={() => handleEditTask(task)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteTask(task.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredTasks.length === 0 && (
          <Card className="border-0 shadow-md">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No tasks found</h3>
              <p className="text-muted-foreground text-center mb-4">
                {searchTerm || statusFilter !== "all" || priorityFilter !== "all"
                  ? "Try adjusting your filters or search terms"
                  : "Get started by creating your first task"}
              </p>
              {!searchTerm && statusFilter === "all" && priorityFilter === "all" && (
                <Button onClick={handleAddTask}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Task
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <TaskDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} task={editingTask} onSave={handleSaveTask} />

      <AlertDialog open={!!deleteTaskId} onOpenChange={() => setDeleteTaskId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Task
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
