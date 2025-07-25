import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/auth/auth-context';
import { User, Bell, Shield, Database, Palette } from "lucide-react";

export function SettingsPage() {
  const { logout } = useAuth();
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    overdueReminders: true,
    newMemberAlerts: true
  });
  
  const [appearance, setAppearance] = useState({
    darkMode: false,
    compactView: false,
    showSidebar: true
  });

  const [library, setLibrary] = useState({
    maxBorrowDays: '14',
    maxBooksPerMember: '5',
    finePerDay: '0.50'
  });

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your application preferences and system configuration
          </p>
        </div>
      </div>

      <Tabs defaultValue="account" className="space-y-4">
        <TabsList>
          <TabsTrigger value="account" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Account</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center space-x-2">
            <Palette className="h-4 w-4" />
            <span>Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="library" className="flex items-center space-x-2">
            <Database className="h-4 w-4" />
            <span>Library</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Current User</Label>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">Logged In</Badge>
                  <span className="text-sm text-gray-600">Admin User</span>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Change Password</Label>
                <Input id="password" type="password" placeholder="New password" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" type="password" placeholder="Confirm new password" />
              </div>
              <div className="flex space-x-2">
                <Button>Update Password</Button>
                <Button variant="destructive" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-gray-600">Receive notifications via email</p>
                </div>
                <Switch 
                  checked={notifications.emailNotifications} 
                  onCheckedChange={(checked) => setNotifications(prev => ({...prev, emailNotifications: checked}))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-gray-600">Receive browser push notifications</p>
                </div>
                <Switch 
                  checked={notifications.pushNotifications} 
                  onCheckedChange={(checked) => setNotifications(prev => ({...prev, pushNotifications: checked}))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Overdue Reminders</Label>
                  <p className="text-sm text-gray-600">Get notified about overdue books</p>
                </div>
                <Switch 
                  checked={notifications.overdueReminders} 
                  onCheckedChange={(checked) => setNotifications(prev => ({...prev, overdueReminders: checked}))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>New Member Alerts</Label>
                  <p className="text-sm text-gray-600">Get notified when new members register</p>
                </div>
                <Switch 
                  checked={notifications.newMemberAlerts} 
                  onCheckedChange={(checked) => setNotifications(prev => ({...prev, newMemberAlerts: checked}))}
                />
              </div>
              <Button>Save Notification Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Dark Mode</Label>
                  <p className="text-sm text-gray-600">Switch to dark theme</p>
                </div>
                <Switch 
                  checked={appearance.darkMode} 
                  onCheckedChange={(checked) => setAppearance(prev => ({...prev, darkMode: checked}))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Compact View</Label>
                  <p className="text-sm text-gray-600">Use a more compact layout</p>
                </div>
                <Switch 
                  checked={appearance.compactView} 
                  onCheckedChange={(checked) => setAppearance(prev => ({...prev, compactView: checked}))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Sidebar</Label>
                  <p className="text-sm text-gray-600">Display the navigation sidebar</p>
                </div>
                <Switch 
                  checked={appearance.showSidebar} 
                  onCheckedChange={(checked) => setAppearance(prev => ({...prev, showSidebar: checked}))}
                />
              </div>
              <Button>Save Appearance Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="library" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Library Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="maxBorrowDays">Maximum Borrow Days</Label>
                <Input 
                  id="maxBorrowDays" 
                  type="number" 
                  value={library.maxBorrowDays}
                  onChange={(e) => setLibrary(prev => ({...prev, maxBorrowDays: e.target.value}))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="maxBooksPerMember">Maximum Books per Member</Label>
                <Input 
                  id="maxBooksPerMember" 
                  type="number" 
                  value={library.maxBooksPerMember}
                  onChange={(e) => setLibrary(prev => ({...prev, maxBooksPerMember: e.target.value}))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="finePerDay">Fine per Day ($)</Label>
                <Input 
                  id="finePerDay" 
                  type="number" 
                  step="0.01"
                  value={library.finePerDay}
                  onChange={(e) => setLibrary(prev => ({...prev, finePerDay: e.target.value}))}
                />
              </div>
              <Button>Save Library Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Session Management</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Manage your active sessions and logout from all devices
                  </p>
                  <Button variant="outline">View Active Sessions</Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Database Backup</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Create a backup of your library database
                  </p>
                  <Button variant="outline">Create Backup</Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">System Logs</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    View system activity and error logs
                  </p>
                  <Button variant="outline">View Logs</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
