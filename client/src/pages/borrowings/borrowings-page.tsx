import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Loader2, Calendar, User, Book, RotateCcw } from "lucide-react";
import { apiService } from '@/services/api';

interface Borrowing {
  id: string;
  member: {
    id: string;
    firstName: string;
    lastName: string;
    membershipNumber: string;
  };
  book: {
    id: string;
    title: string;
    author: string;
    isbn: string;
  };
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  isReturned: boolean;
}

export function BorrowingsPage() {
  const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('active');

  useEffect(() => {
    loadBorrowings();
  }, []);

  const loadBorrowings = async () => {
    try {
      setLoading(true);
      const borrowingsData = await apiService.getBorrowings();
      setBorrowings(borrowingsData);
    } catch (error) {
      console.error('Failed to load borrowings:', error);
      // Set mock data for testing
      setBorrowings([
        {
          id: '1',
          member: {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            membershipNumber: 'LIB001'
          },
          book: {
            id: '1',
            title: 'The Great Gatsby',
            author: 'F. Scott Fitzgerald',
            isbn: '978-0-7432-7356-5'
          },
          borrowDate: '2024-01-15',
          dueDate: '2024-01-29',
          isReturned: false
        },
        {
          id: '2',
          member: {
            id: '2',
            firstName: 'Jane',
            lastName: 'Smith',
            membershipNumber: 'LIB002'
          },
          book: {
            id: '2',
            title: 'To Kill a Mockingbird',
            author: 'Harper Lee',
            isbn: '978-0-06-112008-4'
          },
          borrowDate: '2024-01-10',
          dueDate: '2024-01-24',
          returnDate: '2024-01-22',
          isReturned: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (id: string) => {
    try {
      // In a real implementation, this would call the API
      // await apiService.returnBook(id);
      setBorrowings(prev => prev.map(borrowing => 
        borrowing.id === id 
          ? { ...borrowing, isReturned: true, returnDate: new Date().toISOString().split('T')[0] }
          : borrowing
      ));
    } catch (error) {
      console.error('Failed to return book:', error);
    }
  };

  const filteredBorrowings = borrowings.filter(borrowing => {
    const matchesSearch = 
      borrowing.member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      borrowing.member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      borrowing.book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      borrowing.member.membershipNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedTab === 'active') {
      return matchesSearch && !borrowing.isReturned;
    } else if (selectedTab === 'returned') {
      return matchesSearch && borrowing.isReturned;
    } else if (selectedTab === 'overdue') {
      return matchesSearch && !borrowing.isReturned && new Date(borrowing.dueDate) < new Date();
    }
    return matchesSearch;
  });

  const isOverdue = (dueDate: string, isReturned: boolean) => {
    return !isReturned && new Date(dueDate) < new Date();
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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Borrowings</h1>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Borrowings</TabsTrigger>
          <TabsTrigger value="returned">Returned</TabsTrigger>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search borrowings..."
            className="max-w-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <TabsContent value={selectedTab} className="space-y-4">
          {filteredBorrowings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No borrowings found.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredBorrowings.map((borrowing) => (
                <Card key={borrowing.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Book className="h-5 w-5" />
                        <span>{borrowing.book.title}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {isOverdue(borrowing.dueDate, borrowing.isReturned) && (
                          <Badge variant="destructive">Overdue</Badge>
                        )}
                        <Badge variant={borrowing.isReturned ? "secondary" : "default"}>
                          {borrowing.isReturned ? "Returned" : "Active"}
                        </Badge>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">
                            {borrowing.member.firstName} {borrowing.member.lastName}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Member #: {borrowing.member.membershipNumber}
                        </p>
                        <p className="text-sm text-gray-600">
                          By {borrowing.book.author}
                        </p>
                        <p className="text-sm text-gray-600">
                          ISBN: {borrowing.book.isbn}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">
                            Borrowed: {new Date(borrowing.borrowDate).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Due: {new Date(borrowing.dueDate).toLocaleDateString()}
                        </p>
                        {borrowing.returnDate && (
                          <p className="text-sm text-gray-600">
                            Returned: {new Date(borrowing.returnDate).toLocaleDateString()}
                          </p>
                        )}
                        {!borrowing.isReturned && (
                          <Button 
                            size="sm" 
                            onClick={() => handleReturn(borrowing.id)}
                            className="mt-2"
                          >
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Mark as Returned
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
