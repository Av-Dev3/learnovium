"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  Database, 
  Bell, 
  User,
  Settings
} from "lucide-react";
import { success as showSuccess, error as showError } from "@/app/lib/toast";

interface PrivacySettingsProps {
  userEmail?: string;
}

export function PrivacySettings({}: PrivacySettingsProps) {
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "private", // private, public, friends
    dataSharing: false,
    analytics: true,
    marketing: false,
    emailNotifications: true,
    pushNotifications: true,
    showEmail: false,
    showProgress: true,
    showStreaks: true
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSettingChange = (key: string, value: boolean | string) => {
    setPrivacySettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // In a real app, you'd save these to the database
      // For now, we'll just show a success message
      await new Promise(resolve => setTimeout(resolve, 1000));
      showSuccess("Privacy settings saved successfully!");
    } catch (error) {
      showError("Failed to save privacy settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Profile Visibility */}
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-6 border border-white/20 dark:border-slate-700/50">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-3">
          <User className="h-6 w-6 text-brand" />
          Profile Visibility
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border border-slate-200 dark:border-slate-600">
            <div className="space-y-1">
              <h4 className="font-semibold text-slate-800 dark:text-slate-200">Show Email Address</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Allow other users to see your email address
              </p>
            </div>
            <Switch
              checked={privacySettings.showEmail}
              onCheckedChange={(checked) => handleSettingChange("showEmail", checked)}
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border border-slate-200 dark:border-slate-600">
            <div className="space-y-1">
              <h4 className="font-semibold text-slate-800 dark:text-slate-200">Show Learning Progress</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Display your learning progress on your profile
              </p>
            </div>
            <Switch
              checked={privacySettings.showProgress}
              onCheckedChange={(checked) => handleSettingChange("showProgress", checked)}
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border border-slate-200 dark:border-slate-600">
            <div className="space-y-1">
              <h4 className="font-semibold text-slate-800 dark:text-slate-200">Show Streaks</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Display your learning streaks and achievements
              </p>
            </div>
            <Switch
              checked={privacySettings.showStreaks}
              onCheckedChange={(checked) => handleSettingChange("showStreaks", checked)}
            />
          </div>
        </div>
      </div>

      {/* Data & Analytics */}
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-6 border border-white/20 dark:border-slate-700/50">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-3">
          <Database className="h-6 w-6 text-brand" />
          Data & Analytics
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border border-slate-200 dark:border-slate-600">
            <div className="space-y-1">
              <h4 className="font-semibold text-slate-800 dark:text-slate-200">Usage Analytics</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Help us improve the app by sharing anonymous usage data
              </p>
            </div>
            <Switch
              checked={privacySettings.analytics}
              onCheckedChange={(checked) => handleSettingChange("analytics", checked)}
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border border-slate-200 dark:border-slate-600">
            <div className="space-y-1">
              <h4 className="font-semibold text-slate-800 dark:text-slate-200">Data Sharing</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Allow sharing of anonymized data for research purposes
              </p>
            </div>
            <Switch
              checked={privacySettings.dataSharing}
              onCheckedChange={(checked) => handleSettingChange("dataSharing", checked)}
            />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-6 border border-white/20 dark:border-slate-700/50">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-3">
          <Bell className="h-6 w-6 text-brand" />
          Notification Preferences
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border border-slate-200 dark:border-slate-600">
            <div className="space-y-1">
              <h4 className="font-semibold text-slate-800 dark:text-slate-200">Email Notifications</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Receive important updates via email
              </p>
            </div>
            <Switch
              checked={privacySettings.emailNotifications}
              onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border border-slate-200 dark:border-slate-600">
            <div className="space-y-1">
              <h4 className="font-semibold text-slate-800 dark:text-slate-200">Push Notifications</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Receive push notifications on your device
              </p>
            </div>
            <Switch
              checked={privacySettings.pushNotifications}
              onCheckedChange={(checked) => handleSettingChange("pushNotifications", checked)}
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border border-slate-200 dark:border-slate-600">
            <div className="space-y-1">
              <h4 className="font-semibold text-slate-800 dark:text-slate-200">Marketing Emails</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Receive promotional emails and product updates
              </p>
            </div>
            <Switch
              checked={privacySettings.marketing}
              onCheckedChange={(checked) => handleSettingChange("marketing", checked)}
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="h-12 px-8 text-lg font-semibold bg-gradient-to-r from-brand to-purple-600 hover:from-brand/90 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:transform-none rounded-2xl"
        >
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
              Saving...
            </>
          ) : (
            <>
              <Settings className="h-5 w-5 mr-2" />
              Save Privacy Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
