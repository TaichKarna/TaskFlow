"use client"

import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, User, Settings, Moon, Sun, Menu, Users, FolderKanban, BarChart3, CheckSquare } from "lucide-react"
import { useTheme } from "next-themes"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function Navbar() {
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  if (!user) return null

  // Define navigation items based on user role
  const navigationItems =
    user.role === "admin"
      ? [
          { title: "Users", href: "/admin", icon: Users },
          { title: "Projects", href: "/admin/projects", icon: FolderKanban },
          { title: "Analytics", href: "/admin/analytics", icon: BarChart3 },
        ]
      : [
          { title: "Projects", href: "/dashboard", icon: FolderKanban },
          { title: "My Tasks", href: "/dashboard/tasks", icon: CheckSquare },
          { title: "Progress", href: "/dashboard/progress", icon: BarChart3 },
        ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-4">
        {/* Mobile Menu Button */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="sm" className="mr-2 px-2">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex h-full flex-col">
              <div className="flex h-14 items-center border-b px-4">
                <div className="flex items-center space-x-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <span className="text-sm font-bold">TF</span>
                  </div>
                  <span className="font-bold">TaskFlow</span>
                </div>
              </div>
              <div className="flex-1 overflow-auto py-4">
                <div className="px-3 py-2">
                  <h2 className="mb-2 px-4 text-lg font-semibold">
                    {user.role === "admin" ? "Admin Panel" : "Dashboard"}
                  </h2>
                  <div className="space-y-1">
                    {navigationItems.map((item) => (
                      <Button
                        key={item.href}
                        variant={pathname === item.href ? "secondary" : "ghost"}
                        className={cn("w-full justify-start", pathname === item.href && "bg-secondary")}
                        asChild
                        onClick={() => setIsOpen(false)}
                      >
                        <Link href={item.href}>
                          <item.icon className="mr-2 h-4 w-4" />
                          {item.title}
                        </Link>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              {/* Mobile User Info in Sheet */}
              <div className="border-t p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    <Badge variant={user.role === "admin" ? "default" : "secondary"} className="text-xs mt-1">
                      {user.role}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-1">
                  <Button variant="ghost" className="w-full justify-start text-sm" size="sm">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-sm" size="sm">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sm text-red-600 hover:text-red-600 hover:bg-red-50"
                    size="sm"
                    onClick={() => {
                      setIsOpen(false)
                      logout()
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </Button>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-sm font-bold">TF</span>
          </div>
          <h1 className="hidden sm:block text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            TaskFlow
          </h1>
        </div>

        {/* Mobile Navigation - Show current page */}
        <div className="flex-1 flex justify-center md:hidden">
          <div className="text-sm font-medium text-center">
            {navigationItems.find((item) => item.href === pathname)?.title || "Dashboard"}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* User info - hidden on mobile */}
          <div className="hidden lg:flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Welcome back,</span>
            <span className="text-sm font-medium">{user.name}</span>
            <Badge variant={user.role === "admin" ? "default" : "secondary"} className="text-xs">
              {user.role}
            </Badge>
          </div>

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-8 w-8 px-0"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Desktop User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="hidden md:flex">
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium text-sm">{user.name}</p>
                  <p className="w-[200px] truncate text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}
