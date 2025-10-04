"use client";

import { useState, useEffect } from "react";
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
  Save,
  Clock,
  Mail,
  Smartphone,
  Camera,
  X,
  Check
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useReminders } from "@/app/lib/hooks";
import { useProfile } from "@/app/lib/hooks/useProfile";
import { success as showSuccess, error as showError } from "@/app/lib/toast";
import { ImageCropper } from "@/components/ui/image-cropper";
import { DragDropUpload } from "@/components/ui/drag-drop-upload";
import { SecuritySettings } from "@/components/SecuritySettings";

export default function Settings() {
  const { 
    reminders, 
    isLoading: remindersLoading, 
    isError: remindersError, 
    error: remindersErrorMsg, 
    saveReminder, 
    isSaving, 
    saveError 
  } = useReminders();

  const {
    profile,
    isLoading: profileLoading,
    isError: profileError,
    error: profileErrorMsg,
    updateProfile,
    uploadAvatar,
    removeAvatar
  } = useProfile();

  const [profilePicture, setProfilePicture] = useState({
    preview: null as string | null,
    file: null as File | null,
    isUploading: false,
    showUploadModal: false,
    showCropper: false,
    originalFile: null as File | null
  });

  const [reminderSettings, setReminderSettings] = useState({
    enabled: reminders?.enabled ?? true,
    windowStart: reminders?.window_start ?? "09:00",
    windowEnd: reminders?.window_end ?? "18:00",
    channel: reminders?.channel ?? "email" as "email" | "push" | "both"
  });

  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    level: "beginner" as "beginner" | "intermediate" | "advanced",
    timezone: "UTC-5"
  });

  // Update form when profile data loads
  useEffect(() => {
    if (profile) {
      setProfileForm({
        name: profile.name || "",
        email: profile.email || "",
        level: profile.level || "beginner",
        timezone: profile.timezone || "UTC-5"
      });
    }
  }, [profile]);

  const handleProfileSave = async () => {
    try {
      const success = await updateProfile({
        level: profileForm.level,
        timezone: profileForm.timezone,
        minutesPerDay: 30 // Default value, could be made configurable later
      });
      
      if (success) {
        showSuccess("Profile updated successfully!");
      } else {
        showError("Failed to save profile");
      }
    } catch {
      showError("Failed to save profile");
    }
  };

  const handleImageUpload = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      showError("Please select an image file");
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showError("Image size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setProfilePicture(prev => ({
        ...prev,
        originalFile: file,
        preview: e.target?.result as string,
        showCropper: true
      }));
    };
    reader.readAsDataURL(file);
  };


  const handleCropComplete = async (croppedImageBlob: Blob) => {
    setProfilePicture(prev => ({ ...prev, isUploading: true, showCropper: false }));

    try {
      // Convert Blob to File
      const croppedFile = new File([croppedImageBlob], 'cropped-avatar.jpg', {
        type: 'image/jpeg',
        lastModified: Date.now(),
      });
      
      const success = await uploadAvatar(croppedFile);
      if (success) {
        showSuccess("Profile picture updated successfully!");
        setProfilePicture(prev => ({ 
          ...prev, 
          isUploading: false, 
          showUploadModal: false,
          file: null,
          preview: null,
          originalFile: null
        }));
      } else {
        showError("Failed to update profile picture");
        setProfilePicture(prev => ({ ...prev, isUploading: false }));
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      showError("Error uploading profile picture");
      setProfilePicture(prev => ({ ...prev, isUploading: false }));
    }
  };

  const handleCropCancel = () => {
    setProfilePicture(prev => ({ 
      ...prev, 
      showCropper: false,
      originalFile: null,
      preview: null
    }));
  };

  const handleSaveProfilePicture = async () => {
    if (!profilePicture.file) return;

    setProfilePicture(prev => ({ ...prev, isUploading: true }));
    
    try {
      const success = await uploadAvatar(profilePicture.file);
      
      if (success) {
        setProfilePicture({
          preview: null,
          file: null,
          isUploading: false,
          showUploadModal: false,
          showCropper: false,
          originalFile: null
        });
        
        showSuccess("Profile picture updated successfully!");
      } else {
        showError("Failed to upload profile picture");
      }
    } catch {
      showError("Failed to upload profile picture");
    } finally {
      setProfilePicture(prev => ({ ...prev, isUploading: false }));
    }
  };

  const handleCancelProfilePicture = () => {
    setProfilePicture({
      preview: null,
      file: null,
      isUploading: false,
      showUploadModal: false,
      showCropper: false,
      originalFile: null
    });
  };

  const handleRemoveProfilePicture = async () => {
    try {
      const success = await removeAvatar();
      
      if (success) {
        showSuccess("Profile picture removed successfully!");
      } else {
        showError("Failed to remove profile picture");
      }
    } catch {
      showError("Failed to remove profile picture");
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

  if (profileLoading || remindersLoading) {
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

  if (profileError || remindersError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-cyan-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-800 flex items-center justify-center">
        <ErrorState
          title="Settings Error"
          message={profileErrorMsg || remindersErrorMsg || "Failed to load settings"}
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
          
          <div className="space-y-8 max-w-2xl">
            {/* Profile Picture Section */}
            <div className="space-y-6">
              <Label className="text-lg font-semibold text-slate-700 dark:text-slate-300">Profile Picture</Label>
              
              <div className="flex items-start gap-6">
                {/* Current Avatar */}
                <div className="relative group">
                  <Avatar className="h-24 w-24 ring-4 ring-slate-200 dark:ring-slate-600 shadow-lg">
                    <AvatarImage src={profile?.avatarUrl || ""} alt={profile?.name || "User"} />
                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white text-2xl font-bold">
                      {(profile?.name || "U").charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  {/* Upload Overlay */}
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                    <Camera className="h-6 w-6 text-white" />
                  </div>
                </div>
                
                {/* Upload Controls */}
                <div className="flex-1 space-y-4">
                  {/* Drag and Drop Upload */}
                  <DragDropUpload
                    onFileSelect={handleImageUpload}
                    accept="image/*"
                    maxSize={5}
                    className="max-w-md"
                  />
                  
                  {/* Remove Button */}
                  {profile?.avatarUrl && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleRemoveProfilePicture}
                      className="h-10 px-4 text-sm font-semibold border-2 border-red-200 dark:border-red-800 hover:border-red-400 hover:ring-4 hover:ring-red-400/20 rounded-xl transition-all duration-300 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm hover:scale-105 text-red-600 dark:text-red-400"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Remove Current Photo
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <Label htmlFor="name" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name</Label>
              <Input
                id="name"
                value={profileForm.name}
                onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
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
                value={profileForm.email}
                onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                aria-describedby="email-help"
                className="h-12 text-lg border-2 border-slate-200 dark:border-slate-600 focus:border-brand focus:ring-4 focus:ring-brand/20 rounded-2xl transition-all duration-300 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm"
              />
              <p id="email-help" className="text-sm text-slate-500 dark:text-slate-400">
                Used for notifications and account recovery
              </p>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="level" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Experience Level</Label>
              <Select value={profileForm.level} onValueChange={(value) => setProfileForm(prev => ({ ...prev, level: value as "beginner" | "intermediate" | "advanced" }))}>
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
              <Select value={profileForm.timezone} onValueChange={(value) => setProfileForm(prev => ({ ...prev, timezone: value }))}>
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

      {/* Security & Privacy Settings */}
      <section aria-labelledby="security-heading">
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-6 border border-white/20 dark:border-slate-700/50">
          <h2 id="security-heading" className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-3">
            <Shield className="h-6 w-6 text-brand" aria-hidden="true" />
            Security & Privacy
          </h2>
          
          <SecuritySettings userEmail={profile?.email} />
        </div>
      </section>
        </div>
      </div>

      {/* Profile Picture Upload Modal */}
      {profilePicture.showUploadModal && (
        <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-indigo-900/20 to-cyan-900/20 backdrop-blur-md flex items-center justify-center z-50 p-4">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-full blur-3xl animate-pulse" />
          </div>
          
          <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 max-w-md w-full shadow-2xl border border-white/20 dark:border-slate-700/50">
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 backdrop-blur-sm border border-purple-200/30 dark:border-purple-700/30 mb-4">
                  <Camera className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">Profile Picture</span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                  Confirm New Profile Picture
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Preview your new profile picture before saving
                </p>
              </div>
              
              {/* Preview */}
              <div className="flex justify-center">
                <Avatar className="h-32 w-32 ring-4 ring-slate-200 dark:ring-slate-600 shadow-lg">
                  <AvatarImage src={profilePicture.preview || ""} alt="Preview" />
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white text-3xl font-bold">
                    {(profile?.name || "U").charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              {/* File Info */}
              {profilePicture.file && (
                <div className="bg-gradient-to-r from-slate-50/80 to-slate-100/80 dark:from-slate-700/80 dark:to-slate-600/80 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50 dark:border-slate-600/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-brand/20 to-purple-500/20 rounded-lg flex items-center justify-center shadow-sm">
                      <Camera className="h-5 w-5 text-brand" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                        {profilePicture.file.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {(profilePicture.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleCancelProfilePicture}
                  disabled={profilePicture.isUploading}
                  className="flex-1 h-11 text-sm font-semibold border-2 border-slate-200 dark:border-slate-600 hover:border-slate-300 hover:ring-4 hover:ring-slate-300/20 rounded-xl transition-all duration-300"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveProfilePicture}
                  disabled={profilePicture.isUploading}
                  className="flex-1 h-11 text-sm font-semibold bg-gradient-to-r from-brand to-purple-600 hover:from-brand/90 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:transform-none rounded-xl"
                >
                  {profilePicture.isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Save Picture
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Cropper Modal */}
      {profilePicture.showCropper && profilePicture.preview && (
        <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-indigo-900/20 to-cyan-900/20 backdrop-blur-md flex items-center justify-center z-50 p-4">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse" />
          </div>
          
          <div className="relative bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/50 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="relative p-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <Camera className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Crop Your Photo</h3>
                    <p className="text-indigo-100 text-sm">Position and resize your image</p>
                  </div>
                </div>
                <button
                  onClick={handleCropCancel}
                  className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            {/* Cropper Content */}
            <div className="p-6">
              <ImageCropper
                src={profilePicture.preview}
                onCropComplete={handleCropComplete}
                onCancel={handleCropCancel}
                aspectRatio={1}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}