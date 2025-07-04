'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Users,
  UserCheck,
  UserX,
  MoreVertical,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserDialog } from '@/components/admin/user-dialog';
import { useToast } from '@/hooks/use-toast';
import { UserWithCount } from '@/types/user';
import { getUsersWithCount } from '@/api/users/user';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserWithCount[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserWithCount | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const itemsPerPage = 10;
  const { toast } = useToast();

  // Fetch users from API
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await getUsersWithCount({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
      });

      setUsers(response.data);
      setTotalPages(response.totalPages);
      setTotal(response.total);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error fetching users',
        description: 'Something went wrong while fetching users',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch users on component mount and when dependencies change
  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm]);

  // Reset to first page when search term changes
  useEffect(() => {
    if (searchTerm) {
      setCurrentPage(1);
    }
  }, [searchTerm]);

  const handleAddUser = () => {
    setEditingUser(null);
    setIsDialogOpen(true);
  };

  const handleEditUser = (user: UserWithCount) => {
    setEditingUser(user);
    setIsDialogOpen(true);
  };

  const handleDeleteUser = (userId: string) => {
    setDeleteUserId(userId);
  };

  const confirmDelete = async () => {
    if (!deleteUserId) return;

    try {
      // TODO: Implement delete API call
      // await deleteUser(deleteUserId);

      // For now, just remove from local state
      setUsers(users.filter((user) => user.id !== deleteUserId));
      setTotal(total - 1);

      toast({
        title: 'User deleted',
        description: 'The user has been successfully removed.',
      });

      // If we deleted the last user on current page, go to previous page
      if (users.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        // Refresh the current page
        fetchUsers();
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: 'Error deleting user',
        description: 'Something went wrong while deleting the user',
        variant: 'destructive',
      });
    } finally {
      setDeleteUserId(null);
    }
  };

  const handleSaveUser = async (
    userData: Omit<
      UserWithCount,
      'id' | 'projectsCount' | 'tasksCount' | 'createdAt'
    >
  ) => {
    try {
      if (editingUser) {
        // TODO: Implement update API call
        // await updateUser(editingUser.id, userData);

        toast({
          title: 'User updated',
          description: 'User information has been successfully updated.',
        });
      } else {
        // TODO: Implement create API call
        // await createUser(userData);

        toast({
          title: 'User created',
          description: 'New user has been successfully added.',
        });
      }

      // Refresh the users list
      fetchUsers();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving user:', error);
      toast({
        title: 'Error saving user',
        description: 'Something went wrong while saving the user',
        variant: 'destructive',
      });
    }
  };

  const UserTableSkeleton = () => (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-full max-w-[200px]" />
            <Skeleton className="h-4 w-full max-w-[150px]" />
          </div>
        </div>
      ))}
    </div>
  );

  // Calculate stats from current users data
  const activeUsers = users.filter((u) => u.status === 'active').length;
  const inactiveUsers = users.filter((u) => u.status === 'inactive').length;
  const adminUsers = users.filter((u) => u.role === 'admin').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
            User Management
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
            Manage users and their access permissions
          </p>
        </div>
        <Button
          onClick={handleAddUser}
          size="default"
          className="w-full sm:w-auto shadow-lg"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{total}</div>
            <p className="text-xs text-muted-foreground">Across all pages</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Active
            </CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-green-600">
              {activeUsers}
            </div>
            <p className="text-xs text-muted-foreground">On current page</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Inactive
            </CardTitle>
            <UserX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-red-600">
              {inactiveUsers}
            </div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Admins
            </CardTitle>
            <Badge variant="default" className="h-4 px-1 text-xs">
              ADMIN
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{adminUsers}</div>
            <p className="text-xs text-muted-foreground">
              System administrators
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-xl">
        <CardHeader className="pb-4">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div>
              <CardTitle className="text-lg sm:text-xl">All Users</CardTitle>
              <CardDescription className="text-sm">
                Manage user accounts and permissions
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0 sm:px-6">
          {isLoading ? (
            <UserTableSkeleton />
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="block sm:hidden space-y-4 px-4">
                {users.map((user) => (
                  <Card key={user.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                          {user.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">
                            {user.name}
                          </div>
                          <div className="text-sm text-muted-foreground truncate">
                            {user.email}
                          </div>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge
                              variant={
                                user.role === 'admin' ? 'default' : 'secondary'
                              }
                              className="text-xs"
                            >
                              {user.role}
                            </Badge>
                            <Badge
                              variant={
                                user.status === 'active'
                                  ? 'default'
                                  : 'destructive'
                              }
                              className={
                                user.status === 'active'
                                  ? 'bg-green-100 text-green-800 hover:bg-green-100'
                                  : ''
                              }
                            >
                              {user.status}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {user.projectsCount} projects • {user.tasksCount}{' '}
                            tasks
                          </div>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden sm:block rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">User</TableHead>
                      <TableHead className="font-semibold">Role</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold hidden lg:table-cell">
                        Projects
                      </TableHead>
                      <TableHead className="font-semibold hidden lg:table-cell">
                        Tasks
                      </TableHead>
                      <TableHead className="font-semibold hidden xl:table-cell">
                        Joined
                      </TableHead>
                      <TableHead className="font-semibold text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                              {user.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <div className="font-medium truncate">
                                {user.name}
                              </div>
                              <div className="text-sm text-muted-foreground truncate">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.role === 'admin' ? 'default' : 'secondary'
                            }
                          >
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.status === 'active'
                                ? 'default'
                                : 'destructive'
                            }
                            className={
                              user.status === 'active'
                                ? 'bg-green-100 text-green-800 hover:bg-green-100'
                                : ''
                            }
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium hidden lg:table-cell">
                          {user.projectsCount}
                        </TableCell>
                        <TableCell className="font-medium hidden lg:table-cell">
                          {user.tasksCount}
                        </TableCell>
                        <TableCell className="text-muted-foreground hidden xl:table-cell">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditUser(user)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 px-4 sm:px-0">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() =>
                            setCurrentPage(Math.max(1, currentPage - 1))
                          }
                          className={
                            currentPage === 1
                              ? 'pointer-events-none opacity-50'
                              : 'cursor-pointer'
                          }
                        />
                      </PaginationItem>
                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          let page;
                          if (totalPages <= 5) {
                            page = i + 1;
                          } else if (currentPage <= 3) {
                            page = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            page = totalPages - 4 + i;
                          } else {
                            page = currentPage - 2 + i;
                          }
                          return (
                            <PaginationItem key={page}>
                              <PaginationLink
                                onClick={() => setCurrentPage(page)}
                                isActive={currentPage === page}
                                className="cursor-pointer"
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        }
                      )}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            setCurrentPage(
                              Math.min(totalPages, currentPage + 1)
                            )
                          }
                          className={
                            currentPage === totalPages
                              ? 'pointer-events-none opacity-50'
                              : 'cursor-pointer'
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}

              {/* No users message */}
              {users.length === 0 && !isLoading && (
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-sm font-semibold text-muted-foreground">
                    No users found
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {searchTerm
                      ? `No users match "${searchTerm}"`
                      : 'Get started by adding a new user.'}
                  </p>
                  {!searchTerm && (
                    <div className="mt-6">
                      <Button onClick={handleAddUser}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add User
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <UserDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        user={editingUser}
        onSave={handleSaveUser}
      />

      <AlertDialog
        open={!!deleteUserId}
        onOpenChange={() => setDeleteUserId(null)}
      >
        <AlertDialogContent className="mx-4 max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              user account and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="w-full sm:w-auto">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
