'use client';

import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  LogOut,
  User,
  Settings,
  Moon,
  Sun,
  Menu,
  Users,
  FolderKanban,
  BarChart3,
  CheckSquare,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function Navbar() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  if (!user) return null;

  const navigationItems =
    user.role === 'admin'
      ? [
          { title: 'Users', href: '/admin', icon: Users },
          { title: 'Projects', href: '/admin/projects', icon: FolderKanban },
          { title: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
        ]
      : [
          { title: 'Projects', href: '/dashboard', icon: FolderKanban },
          { title: 'My Tasks', href: '/dashboard/tasks', icon: CheckSquare },
        ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex justify-between items-center h-14 px-4">
        {/* Logo and Mobile Menu Button */}
        <div className="flex items-center space-x-3">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0 z-[60]">
              <div className="flex flex-col h-full">
                <div className="flex items-center h-14 border-b px-4 space-x-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <span className="text-sm font-bold">TF</span>
                  </div>
                  <span className="font-bold">TaskFlow</span>
                </div>
                <div className="flex-1 overflow-y-auto py-4">
                  <div className="px-4 space-y-2">
                    <h2 className="text-lg font-semibold mb-2">
                      {user.role === 'admin' ? 'Admin Panel' : 'Dashboard'}
                    </h2>
                    <div className="space-y-1">
                      {navigationItems.map((item) => (
                        <Button
                          key={item.href}
                          variant={
                            pathname === item.href ? 'secondary' : 'ghost'
                          }
                          className={cn(
                            'w-full justify-start',
                            pathname === item.href && 'bg-secondary'
                          )}
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
                <div className="border-t p-4 space-y-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {user.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                      <Badge
                        variant={
                          user.role === 'admin' ? 'default' : 'secondary'
                        }
                        className="text-xs mt-1"
                      >
                        {user.role}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-sm"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-sm"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-sm text-red-600 hover:text-red-600 hover:bg-red-50"
                    onClick={() => {
                      setIsOpen(false);
                      logout();
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="text-sm font-bold">TF</span>
            </div>
            <h1 className="hidden sm:block text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              TaskFlow
            </h1>
          </div>
        </div>

        {/* Page Title - Mobile */}
        <div className="flex-1 md:hidden flex justify-center">
          <span className="text-sm font-medium">
            {navigationItems.find((i) => i.href === pathname)?.title || ''}
          </span>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-3">
          {/* Greeting - only on lg+ */}
          <div className="hidden lg:flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Welcome,</span>
            <span className="text-sm font-medium">{user.name}</span>
            <Badge
              variant={user.role === 'admin' ? 'default' : 'secondary'}
              className="text-xs"
            >
              {user.role}
            </Badge>
          </div>

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="h-8 w-8 p-0"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {user.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <div className="px-3 py-2">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
