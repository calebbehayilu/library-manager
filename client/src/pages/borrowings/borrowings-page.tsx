import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeftRight, Plus, Search, Eye, RefreshCw, AlertCircle } from "lucide-react";

interface Borrowing {
  id: string;
  memberName: string;
  memberEmail: string;
  memberAvatar?: string;
  bookTitle: string;
  bookAuthor: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  status: "issued" | "overdue" | "returned";
  renewalCount: number;
  maxRenewals: number;
}

const mockBorrowings: Borrowing[] = [
  {
    id: "1",
    memberName: "John Doe",
    memberEmail: "john.doe@email.com",
    memberAvatar: "/api/placeholder/40/40",
    bookTitle: "To Kill a Mockingbird",
    bookAuthor: "Harper Lee",
    issueDate: "2024-07-01",
    dueDate: "2024-07-15",
    status: "issued",
    renewalCount: 0,
    maxRenewals: 2
  },
  {
    id: "2",
    memberName: "Jane Smith",
    memberEmail: "jane.smith@email.com",
    memberAvatar: "/api/placeholder/40/40",
    bookTitle: "1984",
    bookAuthor: "George Orwell",
    issueDate: "2024-06-20",
    dueDate: "2024-07-04",
    status: "overdue",
    renewalCount: 1,
    maxRenewals: 2
  },
  {
    id: "3",
    memberName: "Bob Johnson",
    memberEmail: "bob.johnson@email.com",
    memberAvatar: "/api/placeholder/40/40",
    bookTitle: "Pride and Prejudice",
    bookAuthor: "Jane Austen",
    issueDate: "2024-06-15",
    dueDate: "2024-06-29",
    returnDate: "2024-06-28",
    status: "returned",
    renewalCount: 0,
    maxRenewals: 2
  },
];

export default function BorrowingsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [borrowings] = useState<Borrowing[]>(mockBorrowings);

  const filteredBorrowings = borrowings.filter(borrowing =>
    borrowing.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    borrowing.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    borrowing.bookAuthor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: Borrowing['status']) => {
    switch (status) {
      case "issued":
        return "bg-blue-100 text-blue-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      case "returned":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getOverdueDays = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = today.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ArrowLeftRight className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold">Borrowings Management</h1>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Issue New Book
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium">Currently Issued</span>
            </div>
            <div className="text-2xl font-bold mt-2">
              {borrowings.filter(b => b.status === "issued").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm font-medium">Overdue</span>
            </div>
            <div className="text-2xl font-bold mt-2">
              {borrowings.filter(b => b.status === "overdue").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">Returned</span>
            </div>
            <div className="text-2xl font-bold mt-2">
              {borrowings.filter(b => b.status === "returned").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search Borrowings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by member name, book title, or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Borrowings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Book Borrowings ({filteredBorrowings.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Book</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Renewals</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBorrowings.map((borrowing) => (
                  <TableRow key={borrowing.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={borrowing.memberAvatar} alt={borrowing.memberName} />
                          <AvatarFallback>
                            {borrowing.memberName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{borrowing.memberName}</div>
                          <div className="text-sm text-gray-500">{borrowing.memberEmail}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{borrowing.bookTitle}</div>
                        <div className="text-sm text-gray-500">by {borrowing.bookAuthor}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(borrowing.issueDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div>{new Date(borrowing.dueDate).toLocaleDateString()}</div>
                        {borrowing.status === "issued" && (
                          <div className="text-sm">
                            {getDaysUntilDue(borrowing.dueDate) > 0 ? (
                              <span className="text-gray-500">
                                {getDaysUntilDue(borrowing.dueDate)} days left
                              </span>
                            ) : (
                              <span className="text-red-500 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                Due today
                              </span>
                            )}
                          </div>
                        )}
                        {borrowing.status === "overdue" && (
                          <div className="text-sm text-red-500 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {getOverdueDays(borrowing.dueDate)} days overdue
                          </div>
                        )}
                        {borrowing.returnDate && (
                          <div className="text-sm text-gray-500">
                            Returned: {new Date(borrowing.returnDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(borrowing.status)}>
                        {borrowing.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {borrowing.renewalCount}/{borrowing.maxRenewals}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {borrowing.status === "issued" && (
                          <Button variant="outline" size="sm">
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
