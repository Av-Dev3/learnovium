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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-cyan-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12 pt-8">
          {/* Header skeleton */}
          <section className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-6 border border-white/20 dark:border-slate-700/50">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-fresh p-8 text-white shadow-lg">
              <div className="h-6 sm:h-8 w-24 sm:w-32 bg-white/30 rounded animate-pulse mb-2" />
              <div className="h-4 sm:h-5 w-64 sm:w-80 bg-white/30 rounded animate-pulse" />
            </div>
          </section>

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
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-cyan-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-800 flex items-center justify-center">
        <ErrorState
          title="Settings Error"
          message={error?.message || "Failed to load settings"}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-cyan-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-12 pt-8">
        {/* Clean Header Design */}
        <section className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-6 border border-white/20 dark:border-slate-700/50">
          <header className="relative overflow-hidden rounded-2xl bg-gradient-fresh p-8 text-white shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full px-6 py-3 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 backdrop-blur-sm border border-yellow-300/30 hover:from-yellow-400/30 hover:to-orange-400/30 transition-all duration-300">
                <User className="w-5 h-5 text-yellow-300 animate-pulse" />
                <span className="text-sm font-bold text-yellow-100 drop-shadow-sm">Settings</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
                Settings ⚙️
              </h1>
              <p className="text-xl text-white/90 max-w-2xl leading-relaxed">
                Manage your profile, preferences, and account settings
              </p>
            </div>
          </div>
          </header>
        </section>

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
              <Select value={profile.level} onValueChange={(value) => setProfile(prev => ({ ...prev, level: value as "beginner" | "intermediate" | "advanced" }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
              <p id="level-help" className="text-xs sm:text-sm text-muted-foreground">
                Helps personalize your learning experience
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select value={profile.timezone} onValueChange={(value) => setProfile(prev => ({ ...prev, timezone: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                  <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                  <SelectItem value="UTC+0">UTC</SelectItem>
                  <SelectItem value="UTC+1">Central European Time (UTC+1)</SelectItem>
                  <SelectItem value="UTC+8">China Standard Time (UTC+8)</SelectItem>
                </SelectContent>
              </Select>
              <p id="timezone-help" className="text-xs sm:text-sm text-muted-foreground">
                Used for scheduling reminders and lessons
              </p>
            </div>
            
            <Button onClick={handleProfileSave} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
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
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:transform-none"
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
      </div>
    </div>
  );
}