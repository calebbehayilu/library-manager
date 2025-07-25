import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Book, Users, BookOpen, Calendar, Loader2 } from "lucide-react";
import { apiService } from '@/services/api';

interface DashboardStats {
  totalBooks: number;
  availableBooks: number;
  borrowedBooks: number;
  totalMembers: number;
  activeMembers: number;
  overdueBorrowings: number;
}

interface RecentActivity {
  id: string;
  type: 'borrow' | 'return' | 'new_member' | 'new_book';
  description: string;
  timestamp: string;
}

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalBooks: 0,
    availableBooks: 0,
    borrowedBooks: 0,
    totalMembers: 0,
    activeMembers: 0,
    overdueBorrowings: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Load data for dashboard statistics
      const [books, members] = await Promise.all([
        apiService.getBooks().catch(() => []),
        apiService.getMembers().catch(() => [])
      ]);

      // Calculate statistics
      const availableBooks = books.filter(book => book.isAvailable).length;
      const borrowedBooks = books.length - availableBooks;
      const activeMembers = members.filter(member => member.isActive).length;
      
      setStats({
        totalBooks: books.length,
        availableBooks,
        borrowedBooks,
        totalMembers: members.length,
        activeMembers,
        overdueBorrowings: 0 // TODO: Calculate overdue borrowings
      });

      // Mock recent activity for now
      setRecentActivity([
        {
          id: '1',
          type: 'borrow',
          description: 'John Doe borrowed "The Great Gatsby"',
          timestamp: new Date().toISOString()
        },
        {
          id: '2',
          type: 'return',
          description: 'Jane Smith returned "To Kill a Mockingbird"',
          timestamp: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: '3',
          type: 'new_member',
          description: 'New member Alice Johnson registered',
          timestamp: new Date(Date.now() - 7200000).toISOString()
        }
      ]);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to the Library Management System
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Books</CardTitle>
            <Book className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBooks}</div>
            <p className="text-xs text-muted-foreground">
              {stats.availableBooks} available, {stats.borrowedBooks} borrowed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Books</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.availableBooks}</div>
            <p className="text-xs text-muted-foreground">
              Ready for borrowing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMembers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeMembers} active members
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Items</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overdueBorrowings}</div>
            <p className="text-xs text-muted-foreground">
              Items past due date
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-2">
                  <div className="flex-shrink-0">
                    {activity.type === 'borrow' && <BookOpen className="h-4 w-4 text-blue-500" />}
                    {activity.type === 'return' && <Book className="h-4 w-4 text-green-500" />}
                    {activity.type === 'new_member' && <Users className="h-4 w-4 text-purple-500" />}
                    {activity.type === 'new_book' && <Book className="h-4 w-4 text-orange-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.timestamp).toLocaleDateString()} at{' '}
                      {new Date(activity.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Badge variant="outline" className="cursor-pointer hover:bg-gray-100 w-full justify-start p-2">
                Add New Book
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-gray-100 w-full justify-start p-2">
                Register New Member
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-gray-100 w-full justify-start p-2">
                Process Book Return
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-gray-100 w-full justify-start p-2">
                View Overdue Items
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
