"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { FolderKanban, CheckSquare, BarChart3 } from "lucide-react"

const sidebarItems = [
  {
    title: "Projects",
    href: "/dashboard",
    icon: FolderKanban,
  },
  {
    title: "My Tasks",
    href: "/dashboard/tasks",
    icon: CheckSquare,
  },
  {
    title: "Progress",
    href: "/dashboard/progress",
    icon: BarChart3,
  },
]

export function UserSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 border-r bg-muted/40 min-h-[calc(100vh-3.5rem)]">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">Dashboard</h2>
          <div className="space-y-1">
            {sidebarItems.map((item) => (
              <Button
                key={item.href}
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={cn("w-full justify-start", pathname === item.href && "bg-secondary")}
                asChild
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
    </div>
  )
}
