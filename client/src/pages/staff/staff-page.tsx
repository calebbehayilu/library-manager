import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User, Plus, Edit, Trash2, Eye } from "lucide-react";

interface Staff {
  id: string;
  name: string;
  role: string;
  email: string;
  status: "active" | "inactive";
  hireDate: string;
  avatar?: string;
}

const mockStaff: Staff[] = [
  {
    id: "1",
    name: "Alice Johnson",
    role: "Librarian",
    email: "alice.johnson@email.com",
    status: "active",
    hireDate: "2022-04-10",
    avatar: "/api/placeholder/40/40"
  },
  {
    id: "2",
    name: "Samuel Lee",
    role: "Assistant Librarian",
    email: "samuel.lee@email.com",
    status: "active",
    hireDate: "2023-01-25",
    avatar: "/api/placeholder/40/40"
  },
  {
    id: "3",
    name: "Emma Brown",
    role: "Archivist",
    email: "emma.brown@email.com",
    status: "inactive",
    hireDate: "2021-08-19",
    avatar: "/api/placeholder/40/40"
  },
];

export default function StaffPage() {
  const [staff] = useState<Staff[]>(mockStaff);

  const getStatusColor = (status: Staff['status']) => {
    return status === "active"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold">Staff Management</h1>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Staff
        </Button>
      </div>

      {/* Staff Table */}
      <Card>
        <CardHeader>
          <CardTitle>Staff Members ({staff.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Staff</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Hire Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staff.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">{member.name}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{member.role}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(member.status)}>
                        {member.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(member.hireDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
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

