"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  Shield, 
  Mail, 
  Key, 
  AlertTriangle,
  CheckCircle,
  Smartphone as Phone,
  QrCode,
  Copy
} from "lucide-react";
import { success as showSuccess, error as showError } from "@/app/lib/toast";

interface AdvancedSecurityProps {
  userEmail?: string;
}

export function AdvancedSecurity({ userEmail }: AdvancedSecurityProps) {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [suspiciousActivity, setSuspiciousActivity] = useState(true);

  // Mock 2FA setup - in a real app, this would integrate with an authenticator service
  const handle2FASetup = async () => {
    try {
      // Simulate 2FA setup
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate mock backup codes
      const codes = Array.from({ length: 10 }, () => 
        Math.random().toString(36).substring(2, 8).toUpperCase()
      );
      setBackupCodes(codes);
      setTwoFactorEnabled(true);
      setShow2FASetup(false);
      setShowBackupCodes(true);
      showSuccess("Two-factor authentication enabled successfully!");
    } catch (error) {
      showError("Failed to enable two-factor authentication");
    }
  };

  const handle2FADisable = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTwoFactorEnabled(false);
      setBackupCodes([]);
      showSuccess("Two-factor authentication disabled");
    } catch (error) {
      showError("Failed to disable two-factor authentication");
    }
  };

  const copyBackupCode = (code: string) => {
    navigator.clipboard.writeText(code);
    showSuccess("Backup code copied to clipboard");
  };

  return (
    <div className="space-y-8">
      {/* Two-Factor Authentication */}
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-6 border border-white/20 dark:border-slate-700/50">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-3">
          <Shield className="h-6 w-6 text-brand" />
          Two-Factor Authentication
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border border-slate-200 dark:border-slate-600">
            <div className="space-y-1">
              <h4 className="font-semibold text-slate-800 dark:text-slate-200">Enable 2FA</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Add an extra layer of security to your account
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-sm font-medium ${twoFactorEnabled ? 'text-green-600' : 'text-slate-500'}`}>
                {twoFactorEnabled ? 'Enabled' : 'Disabled'}
              </span>
              <Switch
                checked={twoFactorEnabled}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setShow2FASetup(true);
                  } else {
                    handle2FADisable();
                  }
                }}
              />
            </div>
          </div>

          {twoFactorEnabled && (
            <div className="p-4 rounded-2xl bg-green-50/80 dark:bg-green-900/20 backdrop-blur-sm border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-green-800 dark:text-green-200">2FA is Active</span>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300">
                Your account is protected with two-factor authentication
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Security Alerts */}
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-6 border border-white/20 dark:border-slate-700/50">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-3">
          <AlertTriangle className="h-6 w-6 text-brand" />
          Security Alerts
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border border-slate-200 dark:border-slate-600">
            <div className="space-y-1">
              <h4 className="font-semibold text-slate-800 dark:text-slate-200">Login Alerts</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Get notified when someone logs into your account
              </p>
            </div>
            <Switch
              checked={loginAlerts}
              onCheckedChange={setLoginAlerts}
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border border-slate-200 dark:border-slate-600">
            <div className="space-y-1">
              <h4 className="font-semibold text-slate-800 dark:text-slate-200">Suspicious Activity</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Alert me about unusual account activity
              </p>
            </div>
            <Switch
              checked={suspiciousActivity}
              onCheckedChange={setSuspiciousActivity}
            />
          </div>
        </div>
      </div>

      {/* Account Recovery */}
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-6 border border-white/20 dark:border-slate-700/50">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-3">
          <Key className="h-6 w-6 text-brand" />
          Account Recovery
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border border-slate-200 dark:border-slate-600">
            <div className="space-y-1">
              <h4 className="font-semibold text-slate-800 dark:text-slate-200">Recovery Email</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {userEmail || "No email set"}
              </p>
            </div>
            <Button 
              variant="outline"
              className="h-10 px-4 text-sm font-semibold border-2 border-slate-200 dark:border-slate-600 hover:border-brand hover:ring-4 hover:ring-brand/20 rounded-xl transition-all duration-300"
            >
              <Mail className="h-4 w-4 mr-2" />
              Update
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border border-slate-200 dark:border-slate-600">
            <div className="space-y-1">
              <h4 className="font-semibold text-slate-800 dark:text-slate-200">Phone Number</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Add a phone number for account recovery
              </p>
            </div>
            <Button 
              variant="outline"
              className="h-10 px-4 text-sm font-semibold border-2 border-slate-200 dark:border-slate-600 hover:border-brand hover:ring-4 hover:ring-brand/20 rounded-xl transition-all duration-300"
            >
              <Phone className="h-4 w-4 mr-2" />
              Add Phone
            </Button>
          </div>
        </div>
      </div>

      {/* 2FA Setup Modal */}
      {show2FASetup && (
        <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-indigo-900/20 to-cyan-900/20 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 max-w-md w-full shadow-2xl border border-white/20 dark:border-slate-700/50">
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 bg-gradient-to-r from-brand/10 to-purple-500/10 backdrop-blur-sm border border-brand/30 dark:border-brand/30 mb-4">
                  <Shield className="w-4 h-4 text-brand" />
                  <span className="text-sm font-semibold text-brand">Setup 2FA</span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                  Enable Two-Factor Authentication
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Scan the QR code with your authenticator app
                </p>
              </div>
              
              <div className="flex justify-center">
                <div className="p-4 bg-white rounded-xl border-2 border-slate-200">
                  <QrCode className="h-32 w-32 text-slate-400" />
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Or enter this code manually:
                </p>
                <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg font-mono text-sm">
                  ABCDEFGHIJKLMNOP
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShow2FASetup(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handle2FASetup}
                  className="flex-1 bg-gradient-to-r from-brand to-purple-600 hover:from-brand/90 hover:to-purple-700 text-white"
                >
                  Enable 2FA
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Backup Codes Modal */}
      {showBackupCodes && (
        <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-indigo-900/20 to-cyan-900/20 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 max-w-md w-full shadow-2xl border border-white/20 dark:border-slate-700/50">
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 bg-gradient-to-r from-green-500/10 to-green-600/10 backdrop-blur-sm border border-green-300/30 dark:border-green-700/30 mb-4">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-semibold text-green-700 dark:text-green-300">Backup Codes</span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                  Save Your Backup Codes
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Store these codes in a safe place. You can use them to access your account if you lose your phone.
                </p>
              </div>
              
              <div className="space-y-2">
                {backupCodes.map((code, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                    <span className="font-mono text-sm">{code}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyBackupCode(code)}
                      className="h-8 w-8 p-0"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Important:</strong> These codes can only be used once. Generate new codes if you run out.
                </p>
              </div>
              
              <Button
                onClick={() => setShowBackupCodes(false)}
                className="w-full bg-gradient-to-r from-brand to-purple-600 hover:from-brand/90 hover:to-purple-700 text-white"
              >
                I&apos;ve Saved These Codes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
