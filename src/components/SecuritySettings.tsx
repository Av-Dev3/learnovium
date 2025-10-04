"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Lock, 
  Eye, 
  EyeOff, 
  AlertTriangle,
  Download,
  Trash2,
  LogOut,
  Key,
  Clock
} from "lucide-react";
import { success as showSuccess, error as showError } from "@/app/lib/toast";
import { PrivacySettings } from "./PrivacySettings";
import { AdvancedSecurity } from "./AdvancedSecurity";
import { CalendarIntegration } from "./CalendarIntegration";

interface SecuritySettingsProps {
  userEmail?: string;
}

export function SecuritySettings({ userEmail }: SecuritySettingsProps) {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isExportingData, setIsExportingData] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showError("New passwords don't match");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      showError("New password must be at least 8 characters long");
      return;
    }

    setIsChangingPassword(true);
    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        showSuccess("Password changed successfully!");
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setShowPasswordModal(false);
      } else {
        showError(data.error || "Failed to change password");
      }
    } catch (error) {
      showError("Failed to change password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleExportData = async () => {
    setIsExportingData(true);
    try {
      const response = await fetch("/api/auth/export-data");
      
      if (response.ok) {
        const data = await response.json();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `learnovium-data-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showSuccess("Data exported successfully!");
      } else {
        const data = await response.json();
        showError(data.error || "Failed to export data");
      }
    } catch (error) {
      showError("Failed to export data");
    } finally {
      setIsExportingData(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== "DELETE") {
      showError("Please type 'DELETE' to confirm");
      return;
    }

    setIsDeletingAccount(true);
    try {
      const response = await fetch("/api/auth/delete-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: deletePassword,
          confirmDelete: deleteConfirm
        })
      });

      const data = await response.json();

      if (response.ok) {
        showSuccess("Account deleted successfully. Redirecting...");
        setTimeout(() => {
          window.location.href = "/auth";
        }, 2000);
      } else {
        showError(data.error || "Failed to delete account");
      }
    } catch (error) {
      showError("Failed to delete account");
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const handleSignOutAllSessions = async () => {
    try {
      const response = await fetch("/api/auth/sessions", {
        method: "DELETE"
      });

      if (response.ok) {
        showSuccess("Signed out successfully. Redirecting...");
        setTimeout(() => {
          window.location.href = "/auth";
        }, 1000);
      } else {
        const data = await response.json();
        showError(data.error || "Failed to sign out");
      }
    } catch (error) {
      showError("Failed to sign out");
    }
  };

  return (
    <div className="space-y-8">
      {/* Calendar Integration */}
      <CalendarIntegration userEmail={userEmail} />
      
      {/* Privacy Settings */}
      <PrivacySettings userEmail={userEmail} />
      
      {/* Advanced Security */}
      <AdvancedSecurity userEmail={userEmail} />
      {/* Password Security */}
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-6 border border-white/20 dark:border-slate-700/50">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-3">
          <Lock className="h-6 w-6 text-brand" />
          Password Security
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border border-slate-200 dark:border-slate-600">
            <div className="space-y-1">
              <h4 className="font-semibold text-slate-800 dark:text-slate-200">Change Password</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Update your password to keep your account secure
              </p>
            </div>
            <Button 
              onClick={() => setShowPasswordModal(true)}
              className="h-10 px-6 text-sm font-semibold bg-gradient-to-r from-brand to-purple-600 hover:from-brand/90 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-xl"
            >
              <Key className="h-4 w-4 mr-2" />
              Change Password
            </Button>
          </div>
        </div>
      </div>

      {/* Session Management */}
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-6 border border-white/20 dark:border-slate-700/50">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-3">
          <Clock className="h-6 w-6 text-brand" />
          Session Management
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border border-slate-200 dark:border-slate-600">
            <div className="space-y-1">
              <h4 className="font-semibold text-slate-800 dark:text-slate-200">Sign Out All Sessions</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Sign out from all devices and browsers
              </p>
            </div>
            <Button 
              onClick={handleSignOutAllSessions}
              variant="outline"
              className="h-10 px-6 text-sm font-semibold border-2 border-slate-200 dark:border-slate-600 hover:border-brand hover:ring-4 hover:ring-brand/20 rounded-xl transition-all duration-300"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out All
            </Button>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-6 border border-white/20 dark:border-slate-700/50">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-3">
          <Download className="h-6 w-6 text-brand" />
          Data Management
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border border-slate-200 dark:border-slate-600">
            <div className="space-y-1">
              <h4 className="font-semibold text-slate-800 dark:text-slate-200">Export My Data</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Download all your learning data and progress
              </p>
            </div>
            <Button 
              onClick={handleExportData}
              disabled={isExportingData}
              variant="outline"
              className="h-10 px-6 text-sm font-semibold border-2 border-slate-200 dark:border-slate-600 hover:border-brand hover:ring-4 hover:ring-brand/20 rounded-xl transition-all duration-300 disabled:opacity-50"
            >
              {isExportingData ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-brand border-t-transparent mr-2" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Account Deletion */}
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-6 border border-red-200 dark:border-red-800">
        <h3 className="text-xl font-bold text-red-800 dark:text-red-200 mb-6 flex items-center gap-3">
          <AlertTriangle className="h-6 w-6 text-red-600" />
          Danger Zone
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-red-50/80 dark:bg-red-900/20 backdrop-blur-sm border border-red-200 dark:border-red-800">
            <div className="space-y-1">
              <h4 className="font-semibold text-red-800 dark:text-red-200">Delete Account</h4>
              <p className="text-sm text-red-600 dark:text-red-400">
                Permanently remove your account and all data. This action cannot be undone.
              </p>
            </div>
            <Button 
              onClick={() => setShowDeleteModal(true)}
              variant="destructive"
              className="h-10 px-6 text-sm font-semibold bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-xl"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Account
            </Button>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-indigo-900/20 to-cyan-900/20 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 max-w-md w-full shadow-2xl border border-white/20 dark:border-slate-700/50">
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 bg-gradient-to-r from-brand/10 to-purple-500/10 backdrop-blur-sm border border-brand/30 dark:border-brand/30 mb-4">
                  <Lock className="w-4 h-4 text-brand" />
                  <span className="text-sm font-semibold text-brand">Change Password</span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                  Update Your Password
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Enter your current password and choose a new one
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="current-password"
                      type={showPasswords.current ? "text" : "password"}
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700"
                    >
                      {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showPasswords.new ? "text" : "password"}
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700"
                    >
                      {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showPasswords.confirm ? "text" : "password"}
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700"
                    >
                      {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowPasswordModal(false)}
                  disabled={isChangingPassword}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handlePasswordChange}
                  disabled={isChangingPassword || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
                  className="flex-1 bg-gradient-to-r from-brand to-purple-600 hover:from-brand/90 hover:to-purple-700 text-white"
                >
                  {isChangingPassword ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                      Changing...
                    </>
                  ) : (
                    "Change Password"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gradient-to-br from-red-900/20 via-red-800/20 to-red-900/20 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 max-w-md w-full shadow-2xl border border-red-200 dark:border-red-800">
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 bg-gradient-to-r from-red-500/10 to-red-600/10 backdrop-blur-sm border border-red-300/30 dark:border-red-700/30 mb-4">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-semibold text-red-700 dark:text-red-300">Delete Account</span>
                </div>
                <h3 className="text-xl font-bold text-red-800 dark:text-red-200 mb-2">
                  Are you absolutely sure?
                </h3>
                <p className="text-sm text-red-600 dark:text-red-400">
                  This action cannot be undone. This will permanently delete your account and remove all data from our servers.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="delete-password">Enter your password</Label>
                  <Input
                    id="delete-password"
                    type="password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    placeholder="Enter your password"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="delete-confirm">Type DELETE to confirm</Label>
                  <Input
                    id="delete-confirm"
                    type="text"
                    value={deleteConfirm}
                    onChange={(e) => setDeleteConfirm(e.target.value)}
                    placeholder="Type DELETE"
                  />
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeletePassword("");
                    setDeleteConfirm("");
                  }}
                  disabled={isDeletingAccount}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDeleteAccount}
                  disabled={isDeletingAccount || !deletePassword || deleteConfirm !== "DELETE"}
                  variant="destructive"
                  className="flex-1"
                >
                  {isDeletingAccount ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                      Deleting...
                    </>
                  ) : (
                    "Delete Account"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
