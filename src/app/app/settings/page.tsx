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
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-6 border border-white/20 dark:border-slate-700/50 mb-8">
          <h2 id="profile-heading" className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-3">
            <User className="h-6 w-6 text-brand" aria-hidden="true" />
            Profile Settings
          </h2>
          
          <div className="space-y-6 max-w-2xl">
            <div className="space-y-3">
              <Label htmlFor="name" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                aria-describedby="name-help"
                className="h-12 text-lg border-2 border-slate-200 dark:border-slate-600 focus:border-brand focus:ring-4 focus:ring-brand/20 rounded-2xl transition-all duration-300 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm"
              />
              <p id="name-help" className="text-sm text-slate-500 dark:text-slate-400">
                Your display name in the app
              </p>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                aria-describedby="email-help"
                className="h-12 text-lg border-2 border-slate-200 dark:border-slate-600 focus:border-brand focus:ring-4 focus:ring-brand/20 rounded-2xl transition-all duration-300 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm"
              />
              <p id="email-help" className="text-sm text-slate-500 dark:text-slate-400">
                Used for notifications and account recovery
              </p>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="level" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Experience Level</Label>
              <Select value={profile.level} onValueChange={(value) => setProfile(prev => ({ ...prev, level: value as "beginner" | "intermediate" | "advanced" }))}>
                <SelectTrigger className="h-12 text-lg border-2 border-slate-200 dark:border-slate-600 focus:border-brand focus:ring-4 focus:ring-brand/20 rounded-2xl transition-all duration-300 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm">
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-2 border-slate-200 dark:border-slate-600 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm z-50">
                  <SelectItem value="beginner" className="text-lg py-3">Beginner</SelectItem>
                  <SelectItem value="intermediate" className="text-lg py-3">Intermediate</SelectItem>
                  <SelectItem value="advanced" className="text-lg py-3">Advanced</SelectItem>
                </SelectContent>
              </Select>
              <p id="level-help" className="text-sm text-slate-500 dark:text-slate-400">
                Helps personalize your learning experience
              </p>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="timezone" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Timezone</Label>
              <Select value={profile.timezone} onValueChange={(value) => setProfile(prev => ({ ...prev, timezone: value }))}>
                <SelectTrigger className="h-12 text-lg border-2 border-slate-200 dark:border-slate-600 focus:border-brand focus:ring-4 focus:ring-brand/20 rounded-2xl transition-all duration-300 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-2 border-slate-200 dark:border-slate-600 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm z-50">
                  <SelectItem value="UTC-8" className="text-lg py-3">Pacific Time (UTC-8)</SelectItem>
                  <SelectItem value="UTC-5" className="text-lg py-3">Eastern Time (UTC-5)</SelectItem>
                  <SelectItem value="UTC+0" className="text-lg py-3">UTC</SelectItem>
                  <SelectItem value="UTC+1" className="text-lg py-3">Central European Time (UTC+1)</SelectItem>
                  <SelectItem value="UTC+8" className="text-lg py-3">China Standard Time (UTC+8)</SelectItem>
                </SelectContent>
              </Select>
              <p id="timezone-help" className="text-sm text-slate-500 dark:text-slate-400">
                Used for scheduling reminders and lessons
              </p>
            </div>
            
            <Button 
              onClick={handleProfileSave} 
              className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-brand to-purple-600 hover:from-brand/90 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl"
            >
              <Save className="h-5 w-5 mr-2" aria-hidden="true" />
              Save Profile
            </Button>
          </div>
        </div>
      </section>

      {/* Reminder Settings */}
      <section aria-labelledby="reminders-heading">
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-6 border border-white/20 dark:border-slate-700/50 mb-8">
          <h2 id="reminders-heading" className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-3">
            <Bell className="h-6 w-6 text-brand" aria-hidden="true" />
            Reminder Settings
          </h2>
          
          <div className="space-y-6 max-w-2xl">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border border-slate-200 dark:border-slate-600">
              <div className="space-y-1">
                <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Enable Reminders</Label>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Get notified about your daily learning goals
                </p>
              </div>
              <Switch
                checked={reminderSettings.enabled}
                onCheckedChange={(checked: boolean) => setReminderSettings(prev => ({ ...prev, enabled: checked }))}
                aria-label="Enable learning reminders"
                className="data-[state=checked]:bg-brand"
              />
            </div>
            
            {reminderSettings.enabled && (
              <>
                <div className="space-y-3 p-4 rounded-2xl bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border border-slate-200 dark:border-slate-600">
                  <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Reminder Window</Label>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-slate-500 dark:text-slate-400" aria-hidden="true" />
                    <Input
                      type="time"
                      value={reminderSettings.windowStart}
                      onChange={(e) => setReminderSettings(prev => ({ ...prev, windowStart: e.target.value }))}
                      className="h-12 text-lg border-2 border-slate-200 dark:border-slate-600 focus:border-brand focus:ring-4 focus:ring-brand/20 rounded-2xl transition-all duration-300 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm w-32"
                      aria-label="Reminder start time"
                    />
                    <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">to</span>
                    <Input
                      type="time"
                      value={reminderSettings.windowEnd}
                      onChange={(e) => setReminderSettings(prev => ({ ...prev, windowEnd: e.target.value }))}
                      className="h-12 text-lg border-2 border-slate-200 dark:border-slate-600 focus:border-brand focus:ring-4 focus:ring-brand/20 rounded-2xl transition-all duration-300 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm w-32"
                      aria-label="Reminder end time"
                    />
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    You&apos;ll only receive reminders during this time window
                  </p>
                </div>
                
                <div className="space-y-3 p-4 rounded-2xl bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border border-slate-200 dark:border-slate-600">
                  <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Notification Channel</Label>
                  <div className="space-y-3">
                    {[
                      { value: "email", label: "Email", icon: Mail },
                      { value: "push", label: "Push Notifications", icon: Smartphone },
                      { value: "both", label: "Both", icon: Bell }
                    ].map((option) => {
                      const Icon = option.icon;
                      return (
                        <label key={option.value} className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-600/50 transition-colors duration-200">
                          <input
                            type="radio"
                            name="channel"
                            value={option.value}
                            checked={reminderSettings.channel === option.value}
                            onChange={(e) => setReminderSettings(prev => ({ ...prev, channel: e.target.value as "email" | "push" | "both" }))}
                            className="h-5 w-5 text-brand focus:ring-brand focus:ring-2"
                          />
                          <Icon className="h-5 w-5 text-slate-500 dark:text-slate-400" aria-hidden="true" />
                          <span className="text-base font-medium text-slate-700 dark:text-slate-300">{option.label}</span>
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
              className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-brand to-purple-600 hover:from-brand/90 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:transform-none rounded-2xl"
            >
              <Save className="h-5 w-5 mr-2" aria-hidden="true" />
              {isSaving ? "Saving..." : "Save Reminders"}
            </Button>
            
            {saveError && (
              <div className="p-4 bg-red-50/80 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl backdrop-blur-sm" role="alert">
                <p className="text-sm text-red-800 dark:text-red-200 font-medium">{saveError}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Data & Privacy */}
      <section aria-labelledby="privacy-heading">
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-6 border border-white/20 dark:border-slate-700/50">
          <h2 id="privacy-heading" className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-3">
            <Shield className="h-6 w-6 text-brand" aria-hidden="true" />
            Data & Privacy
          </h2>
          
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center justify-between p-6 rounded-2xl bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border border-slate-200 dark:border-slate-600 hover:shadow-lg transition-all duration-300">
              <div className="space-y-1">
                <h3 className="font-semibold text-base text-slate-800 dark:text-slate-200">Export My Data</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Download all your learning data and progress
                </p>
              </div>
              <Button 
                variant="outline" 
                className="h-10 px-6 text-sm font-semibold border-2 border-slate-200 dark:border-slate-600 hover:border-brand hover:ring-4 hover:ring-brand/20 rounded-xl transition-all duration-300 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm hover:scale-105"
              >
                Export
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-6 rounded-2xl bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border border-red-200 dark:border-red-800 hover:shadow-lg transition-all duration-300">
              <div className="space-y-1">
                <h3 className="font-semibold text-base text-slate-800 dark:text-slate-200">Delete Account</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Permanently remove your account and all data
                </p>
              </div>
              <Button 
                variant="destructive" 
                className="h-10 px-6 text-sm font-semibold bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-xl"
              >
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