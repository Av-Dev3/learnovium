"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  Calendar, 
  CheckCircle, 
  AlertCircle, 
  ExternalLink,
  Settings,
  Clock,
  Bell,
  RefreshCw,
  Trash2
} from "lucide-react";
import { success as showSuccess, error as showError } from "@/app/lib/toast";

interface CalendarIntegrationProps {
  userEmail?: string;
}

interface CalendarSettings {
  isConnected: boolean;
  calendarId: string;
  syncLessons: boolean;
  syncReminders: boolean;
  syncDeadlines: boolean;
  syncFrequency: "realtime" | "daily" | "weekly";
  eventColor: string;
  reminderTime: number; // minutes before event
}

export function CalendarIntegration({}: CalendarIntegrationProps) {
  const [calendarSettings, setCalendarSettings] = useState<CalendarSettings>({
    isConnected: false,
    calendarId: "",
    syncLessons: true,
    syncReminders: true,
    syncDeadlines: true,
    syncFrequency: "realtime",
    eventColor: "#8B5CF6", // Purple
    reminderTime: 15
  });

  const [isConnecting, setIsConnecting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  // Load calendar settings on component mount
  useEffect(() => {
    loadCalendarSettings();
  }, []);

  const loadCalendarSettings = async () => {
    try {
      const response = await fetch("/api/calendar/settings");
      if (response.ok) {
        const data = await response.json();
        setCalendarSettings(data);
      }
    } catch (error) {
      console.error("Failed to load calendar settings:", error);
    }
  };

  const handleConnectGoogleCalendar = async () => {
    setIsConnecting(true);
    try {
      // In a real implementation, this would redirect to Google OAuth
      // For now, we'll simulate the connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setCalendarSettings(prev => ({
        ...prev,
        isConnected: true,
        calendarId: "primary"
      }));
      
      showSuccess("Successfully connected to Google Calendar!");
    } catch (error) {
      showError("Failed to connect to Google Calendar");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnectCalendar = async () => {
    setIsDisconnecting(true);
    try {
      const response = await fetch("/api/calendar/disconnect", {
        method: "POST"
      });

      if (response.ok) {
        setCalendarSettings(prev => ({
          ...prev,
          isConnected: false,
          calendarId: ""
        }));
        showSuccess("Disconnected from Google Calendar");
      } else {
        showError("Failed to disconnect from Google Calendar");
      }
    } catch (error) {
      showError("Failed to disconnect from Google Calendar");
    } finally {
      setIsDisconnecting(false);
    }
  };

  const handleSettingChange = (key: keyof CalendarSettings, value: boolean | string | number) => {
    setCalendarSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/calendar/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(calendarSettings)
      });

      if (response.ok) {
        showSuccess("Calendar settings saved successfully!");
      } else {
        showError("Failed to save calendar settings");
      }
    } catch (error) {
      showError("Failed to save calendar settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSyncNow = async () => {
    try {
      const response = await fetch("/api/calendar/sync", {
        method: "POST"
      });

      if (response.ok) {
        showSuccess("Calendar synced successfully!");
      } else {
        showError("Failed to sync calendar");
      }
    } catch (error) {
      showError("Failed to sync calendar");
    }
  };

  return (
    <div className="space-y-8">
      {/* Connection Status */}
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-6 border border-white/20 dark:border-slate-700/50">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-3">
          <Calendar className="h-6 w-6 text-brand" />
          Google Calendar Integration
        </h3>
        
        <div className="space-y-4">
          {calendarSettings.isConnected ? (
            <div className="p-4 rounded-2xl bg-green-50/80 dark:bg-green-900/20 backdrop-blur-sm border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <div>
                    <h4 className="font-semibold text-green-800 dark:text-green-200">Connected to Google Calendar</h4>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Calendar: {calendarSettings.calendarId}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleSyncNow}
                    variant="outline"
                    size="sm"
                    className="h-9 px-4 text-sm font-semibold border-2 border-green-200 dark:border-green-800 hover:border-green-400 hover:ring-4 hover:ring-green-400/20 rounded-xl transition-all duration-300"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Sync Now
                  </Button>
                  <Button
                    onClick={handleDisconnectCalendar}
                    variant="outline"
                    size="sm"
                    disabled={isDisconnecting}
                    className="h-9 px-4 text-sm font-semibold border-2 border-red-200 dark:border-red-800 hover:border-red-400 hover:ring-4 hover:ring-red-400/20 rounded-xl transition-all duration-300 text-red-600 dark:text-red-400"
                  >
                    {isDisconnecting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent mr-2" />
                        Disconnecting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Disconnect
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-700/80 backdrop-blur-sm border border-slate-200 dark:border-slate-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-6 w-6 text-slate-500" />
                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200">Not Connected</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Connect your Google Calendar to sync learning events
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleConnectGoogleCalendar}
                  disabled={isConnecting}
                  className="h-10 px-6 text-sm font-semibold bg-gradient-to-r from-brand to-purple-600 hover:from-brand/90 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:transform-none rounded-xl"
                >
                  {isConnecting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Connect Google Calendar
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sync Settings */}
      {calendarSettings.isConnected && (
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-6 border border-white/20 dark:border-slate-700/50">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-3">
            <Settings className="h-6 w-6 text-brand" />
            Sync Settings
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border border-slate-200 dark:border-slate-600">
              <div className="space-y-1">
                <h4 className="font-semibold text-slate-800 dark:text-slate-200">Sync Lessons</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Automatically add learning sessions to your calendar
                </p>
              </div>
              <Switch
                checked={calendarSettings.syncLessons}
                onCheckedChange={(checked) => handleSettingChange("syncLessons", checked)}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border border-slate-200 dark:border-slate-600">
              <div className="space-y-1">
                <h4 className="font-semibold text-slate-800 dark:text-slate-200">Sync Reminders</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Add reminder notifications to your calendar
                </p>
              </div>
              <Switch
                checked={calendarSettings.syncReminders}
                onCheckedChange={(checked) => handleSettingChange("syncReminders", checked)}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border border-slate-200 dark:border-slate-600">
              <div className="space-y-1">
                <h4 className="font-semibold text-slate-800 dark:text-slate-200">Sync Deadlines</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Add learning goals and deadlines to your calendar
                </p>
              </div>
              <Switch
                checked={calendarSettings.syncDeadlines}
                onCheckedChange={(checked) => handleSettingChange("syncDeadlines", checked)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Advanced Settings */}
      {calendarSettings.isConnected && (
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-6 border border-white/20 dark:border-slate-700/50">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-3">
            <Clock className="h-6 w-6 text-brand" />
            Advanced Settings
          </h3>
          
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Sync Frequency</label>
              <select
                value={calendarSettings.syncFrequency}
                onChange={(e) => handleSettingChange("syncFrequency", e.target.value)}
                className="w-full p-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 focus:border-brand focus:ring-4 focus:ring-brand/20 transition-all duration-300 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm"
              >
                <option value="realtime">Real-time (immediate sync)</option>
                <option value="daily">Daily (once per day)</option>
                <option value="weekly">Weekly (once per week)</option>
              </select>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                How often to sync changes with Google Calendar
              </p>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Event Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={calendarSettings.eventColor}
                  onChange={(e) => handleSettingChange("eventColor", e.target.value)}
                  className="w-12 h-12 rounded-lg border-2 border-slate-200 dark:border-slate-600 cursor-pointer"
                />
                <div className="flex-1 p-3 rounded-xl bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
                  <div 
                    className="w-full h-4 rounded"
                    style={{ backgroundColor: calendarSettings.eventColor }}
                  />
                </div>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Color for learning events in your calendar
              </p>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Reminder Time</label>
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-slate-500" />
                <select
                  value={calendarSettings.reminderTime}
                  onChange={(e) => handleSettingChange("reminderTime", parseInt(e.target.value))}
                  className="flex-1 p-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 focus:border-brand focus:ring-4 focus:ring-brand/20 transition-all duration-300 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm"
                >
                  <option value={5}>5 minutes before</option>
                  <option value={15}>15 minutes before</option>
                  <option value={30}>30 minutes before</option>
                  <option value={60}>1 hour before</option>
                  <option value={120}>2 hours before</option>
                  <option value={1440}>1 day before</option>
                </select>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                When to remind you about upcoming learning sessions
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Save Button */}
      {calendarSettings.isConnected && (
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
                Save Calendar Settings
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
