import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search, Edit, Trash, Loader2, User } from "lucide-react";
import { apiService } from '@/services/api';

interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  membershipNumber: string;
  phone?: string;
  address?: string;
  membershipExpiry?: string;
  isActive: boolean;
}

export function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newMember, setNewMember] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const membersData = await apiService.getMembers();
      setMembers(membersData);
    } catch (error) {
      console.error('Failed to load members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.createMember(newMember);
      setIsAddDialogOpen(false);
      setNewMember({ firstName: '', lastName: '', email: '', phone: '', address: '' });
      loadMembers();
    } catch (error) {
      console.error('Failed to add member:', error);
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (confirm('Are you sure you want to delete this member?')) {
      try {
        await apiService.deleteMember(id);
        loadMembers();
      } catch (error) {
        console.error('Failed to delete member:', error);
      }
    }
  };

  const filteredMembers = members.filter(member => {
    const searchLower = searchTerm.toLowerCase();
    return (
      member.firstName.toLowerCase().includes(searchLower) ||
      member.lastName.toLowerCase().includes(searchLower) ||
      member.email.toLowerCase().includes(searchLower) ||
      member.membershipNumber.toLowerCase().includes(searchLower)
    );
  });

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
        <h1 className="text-3xl font-bold tracking-tight">Members</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Member</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddMember} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={newMember.firstName}
                  onChange={(e) => setNewMember({...newMember, firstName: e.target.value})}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={newMember.lastName}
                  onChange={(e) => setNewMember({...newMember, lastName: e.target.value})}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newMember.phone}
                  onChange={(e) => setNewMember({...newMember, phone: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={newMember.address}
                  onChange={(e) => setNewMember({...newMember, address: e.target.value})}
                />
              </div>
              <Button type="submit" className="w-full">
                Add Member
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search members..."
          className="max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredMembers.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No members found.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredMembers.map((member) => (
            <Card key={member.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span className="truncate">{member.firstName} {member.lastName}</span>
                  </div>
                  <Badge variant={member.isActive ? "secondary" : "destructive"}>
                    {member.isActive ? "Active" : "Inactive"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">{member.email}</p>
                  <p className="text-sm">Member #: {member.membershipNumber}</p>
                  {member.phone && (
                    <p className="text-sm">Phone: {member.phone}</p>
                  )}
                  {member.address && (
                    <p className="text-sm">Address: {member.address}</p>
                  )}
                  {member.membershipExpiry && (
                    <p className="text-sm">Expires: {new Date(member.membershipExpiry).toLocaleDateString()}</p>
                  )}
                  <div className="flex space-x-2 mt-4">
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDeleteMember(member.id)}
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
