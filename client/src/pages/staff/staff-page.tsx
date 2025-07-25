import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Edit, Trash, Loader2, User, Shield } from "lucide-react";
import { apiService } from '@/services/api';

interface Staff {
  id: string;
  username: string;
  role: 'admin' | 'librarian';
  createdAt: string;
  updatedAt: string;
}

export function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({
    username: '',
    password: '',
    role: 'librarian' as 'admin' | 'librarian'
  });

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      setLoading(true);
      const staffData = await apiService.getUsers();
      setStaff(staffData);
    } catch (error) {
      console.error('Failed to load staff:', error);
      // Set mock data for testing
      setStaff([
        {
          id: '1',
          username: 'admin',
          role: 'admin',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '2',
          username: 'librarian',
          role: 'librarian',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.createUser(newStaff);
      setIsAddDialogOpen(false);
      setNewStaff({ username: '', password: '', role: 'librarian' });
      loadStaff();
    } catch (error) {
      console.error('Failed to add staff member:', error);
    }
  };

  const handleDeleteStaff = async (id: string) => {
    if (confirm('Are you sure you want to delete this staff member?')) {
      try {
        await apiService.deleteUser(id);
        loadStaff();
      } catch (error) {
        console.error('Failed to delete staff member:', error);
      }
    }
  };

  const filteredStaff = staff.filter(member =>
    member.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Staff Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Staff Member</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddStaff} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={newStaff.username}
                  onChange={(e) => setNewStaff({...newStaff, username: e.target.value})}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={newStaff.password}
                  onChange={(e) => setNewStaff({...newStaff, password: e.target.value})}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select value={newStaff.role} onValueChange={(value: 'admin' | 'librarian') => setNewStaff({...newStaff, role: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="librarian">Librarian</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">
                Add Staff Member
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search staff members..."
          className="max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredStaff.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No staff members found.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredStaff.map((member) => (
            <Card key={member.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {member.role === 'admin' ? (
                      <Shield className="h-5 w-5 text-red-500" />
                    ) : (
                      <User className="h-5 w-5 text-blue-500" />
                    )}
                    <span className="truncate">{member.username}</span>
                  </div>
                  <Badge variant={member.role === 'admin' ? "destructive" : "secondary"}>
                    {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Created: {new Date(member.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Updated: {new Date(member.updatedAt).toLocaleDateString()}
                  </p>
                  <div className="flex space-x-2 mt-4">
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDeleteStaff(member.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
