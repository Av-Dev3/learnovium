"use client";

import { useState } from "react";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  User, 
  Bell, 
  Shield, 
  Trash2, 
  Save,
  Clock,
  Mail,
  Smartphone
} from "lucide-react";
import { useReminders } from "@/app/lib/hooks";
import { success as showSuccess, error as showError } from "@/app/lib/toast";

export default function Settings() {
  const { 
    reminders, 
    isLoading, 
    isError, 
    error, 
    saveReminder, 
    isSaving, 
    saveError 
  } = useReminders();

  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john@example.com",
    level: "intermediate" as "beginner" | "intermediate" | "advanced",
    timezone: "UTC-5"
  });

  const [reminderSettings, setReminderSettings] = useState({
    enabled: reminders?.enabled ?? true,
    windowStart: reminders?.window_start ?? "09:00",
    windowEnd: reminders?.window_end ?? "18:00",
    channel: reminders?.channel ?? "email" as "email" | "push" | "both"
  });

  const handleProfileSave = async () => {
    try {
      // Mock API call for profile update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showSuccess("Profile updated successfully!");
    } catch {
      showError("Failed to save profile");
    }
  };

  const handleReminderSave = async () => {
    try {
      const success = await saveReminder({
        enabled: reminderSettings.enabled,
        window_start: reminderSettings.windowStart,
        window_end: reminderSettings.windowEnd,
        channel: reminderSettings.channel
      });

      if (success) {
        showSuccess("Reminder settings updated successfully!");
      } else {
        showError("Failed to save reminder settings");
      }
    } catch {
      showError("Failed to save reminder settings");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        {/* Header skeleton */}
        <div className="mb-6 sm:mb-8">
          <div className="h-6 sm:h-8 w-24 sm:w-32 bg-muted rounded animate-pulse mb-2" />
          <div className="h-4 sm:h-5 w-64 sm:w-80 bg-muted rounded animate-pulse" />
        </div>

        {/* Profile Settings skeleton */}
        <div className="mb-6 sm:mb-8">
          <div className="h-5 w-28 sm:h-6 sm:w-32 bg-muted rounded animate-pulse mb-3 sm:mb-4" />
          <LoadingState type="form" />
        </div>

        {/* Reminder Settings skeleton */}
        <div className="mb-6 sm:mb-8">
          <div className="h-5 w-32 sm:h-6 sm:w-32 bg-muted rounded animate-pulse mb-3 sm:mb-4" />
          <LoadingState type="form" />
        </div>

        {/* Data & Privacy skeleton */}
        <div>
          <div className="h-5 w-28 sm:h-6 sm:w-32 bg-muted rounded animate-pulse mb-3 sm:mb-4" />
          <div className="space-y-3 sm:space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 sm:p-4 border rounded-lg">
                <div>
                  <div className="h-4 w-24 sm:h-5 sm:w-32 bg-muted rounded animate-pulse mb-1" />
                  <div className="h-3 w-36 sm:h-4 sm:w-48 bg-muted rounded animate-pulse" />
                </div>
                <div className="h-6 w-12 sm:h-8 sm:w-16 bg-muted rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Settings Error"
        message={error?.message || "Failed to load settings"}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <header className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Manage your profile, preferences, and account settings
        </p>
      </header>

      {/* Profile Settings */}
      <section aria-labelledby="profile-heading">
        <div className="mb-6 sm:mb-8">
          <h2 id="profile-heading" className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2">
            <User className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
            Profile Settings
          </h2>
          
          <div className="space-y-3 sm:space-y-4 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                aria-describedby="name-help"
              />
              <p id="name-help" className="text-xs sm:text-sm text-muted-foreground">
                Your display name in the app
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                aria-describedby="email-help"
              />
              <p id="email-help" className="text-xs sm:text-sm text-muted-foreground">
                Used for notifications and account recovery
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="level">Experience Level</Label>
              <select
                id="level"
                value={profile.level}
                onChange={(e) => setProfile(prev => ({ ...prev, level: e.target.value as "beginner" | "intermediate" | "advanced" }))}
                className="w-full px-3 py-2 border rounded-md bg-background"
                aria-describedby="level-help"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              <p id="level-help" className="text-xs sm:text-sm text-muted-foreground">
                Helps personalize your learning experience
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <select
                id="timezone"
                value={profile.timezone}
                onChange={(e) => setProfile(prev => ({ ...prev, timezone: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md bg-background"
                aria-describedby="timezone-help"
              >
                <option value="UTC-8">Pacific Time (UTC-8)</option>
                <option value="UTC-5">Eastern Time (UTC-5)</option>
                <option value="UTC+0">UTC</option>
                <option value="UTC+1">Central European Time (UTC+1)</option>
                <option value="UTC+8">China Standard Time (UTC+8)</option>
              </select>
              <p id="timezone-help" className="text-xs sm:text-sm text-muted-foreground">
                Used for scheduling reminders and lessons
              </p>
            </div>
            
            <Button onClick={handleProfileSave} className="w-full">
              <Save className="h-4 w-4 mr-2" aria-hidden="true" />
              Save Profile
            </Button>
          </div>
        </div>
      </section>

      {/* Reminder Settings */}
      <section aria-labelledby="reminders-heading">
        <div className="mb-6 sm:mb-8">
          <h2 id="reminders-heading" className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2">
            <Bell className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
            Reminder Settings
          </h2>
          
          <div className="space-y-3 sm:space-y-4 max-w-md">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Enable Reminders</Label>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Get notified about your daily learning goals
                </p>
              </div>
                             <Switch
                 checked={reminderSettings.enabled}
                 onCheckedChange={(checked: boolean) => setReminderSettings(prev => ({ ...prev, enabled: checked }))}
                 aria-label="Enable learning reminders"
               />
            </div>
            
            {reminderSettings.enabled && (
              <>
                <div className="space-y-2">
                  <Label>Reminder Window</Label>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <Input
                      type="time"
                      value={reminderSettings.windowStart}
                      onChange={(e) => setReminderSettings(prev => ({ ...prev, windowStart: e.target.value }))}
                      className="w-28 sm:w-32"
                      aria-label="Reminder start time"
                    />
                    <span className="text-muted-foreground text-sm">to</span>
                    <Input
                      type="time"
                      value={reminderSettings.windowEnd}
                      onChange={(e) => setReminderSettings(prev => ({ ...prev, windowEnd: e.target.value }))}
                      className="w-28 sm:w-32"
                      aria-label="Reminder end time"
                    />
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    You&apos;ll only receive reminders during this time window
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>Notification Channel</Label>
                  <div className="space-y-2">
                    {[
                      { value: "email", label: "Email", icon: Mail },
                      { value: "push", label: "Push Notifications", icon: Smartphone },
                      { value: "both", label: "Both", icon: Bell }
                    ].map((option) => {
                      const Icon = option.icon;
                      return (
                        <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="channel"
                            value={option.value}
                            checked={reminderSettings.channel === option.value}
                            onChange={(e) => setReminderSettings(prev => ({ ...prev, channel: e.target.value as "email" | "push" | "both" }))}
                            className="h-4 w-4"
                          />
                          <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                          <span className="text-sm sm:text-base">{option.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
            
            <Button 
              onClick={handleReminderSave} 
              disabled={isSaving}
              className="w-full"
            >
              <Save className="h-4 w-4 mr-2" aria-hidden="true" />
              {isSaving ? "Saving..." : "Save Reminders"}
            </Button>
            
            {saveError && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg" role="alert">
                <p className="text-sm text-destructive">{saveError}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Data & Privacy */}
      <section aria-labelledby="privacy-heading">
        <div>
          <h2 id="privacy-heading" className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2">
            <Shield className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
            Data & Privacy
          </h2>
          
          <div className="space-y-3 sm:space-y-4 max-w-md">
            <div className="flex items-center justify-between p-3 sm:p-4 border rounded-lg">
              <div>
                <h3 className="font-medium text-sm sm:text-base">Export My Data</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Download all your learning data and progress
                </p>
              </div>
              <Button variant="outline" size="sm">
                Export
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-3 sm:p-4 border rounded-lg">
              <div>
                <h3 className="font-medium text-sm sm:text-base">Delete Account</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Permanently remove your account and all data
                </p>
              </div>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" aria-hidden="true" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}