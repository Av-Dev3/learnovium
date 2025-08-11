import { Container } from "@/components/layout/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  return (
    <Container>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Settings
          </h1>
          <p className="text-lg text-[var(--muted)]">
            Manage your account and preferences
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Enter your full name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter your email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Input id="bio" placeholder="Tell us about yourself" />
              </div>
              <Button className="w-full bg-[var(--brand)] hover:opacity-90">Save Changes</Button>
            </CardContent>
          </Card>
          
          {/* Reminder Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Reminder Preferences</CardTitle>
              <CardDescription>Choose how you want to be notified</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="email-notifications" className="w-4 h-4" />
                <Label htmlFor="email-notifications">Email notifications</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="push-notifications" className="w-4 h-4" />
                <Label htmlFor="push-notifications">Push notifications</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="daily-reminders" className="w-4 h-4" />
                <Label htmlFor="daily-reminders">Daily learning reminders</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reminder-time">Reminder Time</Label>
                <Input id="reminder-time" type="time" defaultValue="09:00" />
              </div>
              <Button className="w-full bg-[var(--brand)] hover:opacity-90">Save Preferences</Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Manage your account security and data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Change Password</h3>
                <p className="text-sm text-[var(--muted)]">Update your account password</p>
              </div>
              <Button variant="outline">Change</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Export Data</h3>
                <p className="text-sm text-[var(--muted)]">Download your learning data</p>
              </div>
              <Button variant="outline">Export</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Delete Account</h3>
                <p className="text-sm text-[var(--muted)]">Permanently delete your account and data</p>
              </div>
              <Button variant="destructive">Delete</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}