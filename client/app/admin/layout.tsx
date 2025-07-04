"use client"

import type React from "react"

import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Navbar } from "@/components/layout/navbar"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  if (loading || !user || user.role !== "admin") {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-64 border-r bg-muted/40 min-h-[calc(100vh-3.5rem)]">
          <div className="space-y-4 py-4">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold">Admin Panel</h2>
              <div className="space-y-1">
                {[
                  { title: "Users", href: "/admin", icon: "Users" },
                  { title: "Projects", href: "/admin/projects", icon: "FolderKanban" },
                  { title: "Analytics", href: "/admin/analytics", icon: "BarChart3" },
                ].map((item) => (
                  <Button key={item.href} variant="ghost" className="w-full justify-start" asChild>
                    <Link href={item.href}>{item.title}</Link>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 max-w-full overflow-hidden">{children}</main>
      </div>
    </div>
  )
}
