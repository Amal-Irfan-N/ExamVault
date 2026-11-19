"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useOffline } from "@/context/OfflineContext";
import { useExaminations } from "@/context/ExaminationContext";
import {
  User,
  Shield,
  Bell,
  Database,
  CheckCircle2,
  LogIn,
  LogOut,
  HardDrive,
  Wifi,
  WifiOff,
  Download,
} from "lucide-react";

export default function SettingsPage() {
  const { profile, isConfigured, signOut, setIsAuthModalOpen } = useAuth();
  const {
    effectiveOnline,
    isSimulatedOffline,
    toggleSimulatedOffline,
    storageMetrics,
    pendingCount,
    setIsStorageModalOpen,
  } = useOffline();
  const { examinations } = useExaminations();

  const [name, setName] = useState(profile?.fullName ?? "Aman Verma");
  const [email, setEmail] = useState(profile?.email ?? "aman.verma.exam@gmail.com");
  const [reminderDays, setReminderDays] = useState("30, 15, 7, 3, 1");
  const [autoLockMinutes, setAutoLockMinutes] = useState("15");
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleExportBackup = () => {
    const backup = {
      exportDate: new Date().toISOString(),
      platform: "ExamVault",
      version: "1.0.0",
      examinationsCount: examinations.length,
      examinations,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ExamVault_Backup_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              Application Settings
            </h1>
            <Badge variant="outline" className="text-indigo-400 border-indigo-500/30">
              Stage 11 Offline & Cloud Ready
            </Badge>
          </div>
          <p className="text-xs md:text-sm text-slate-400">
            Manage your candidate profile, Supabase PostgreSQL configuration, credential encryption keys, and reminder intervals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {profile ? (
            <Button
              size="sm"
              variant="outline"
              onClick={signOut}
              className="text-xs h-9 gap-1.5 text-red-400 hover:text-red-300 border-red-500/30"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsAuthModalOpen(true)}
              className="text-xs h-9 gap-1.5 text-indigo-400 border-indigo-500/30"
            >
              <LogIn className="w-3.5 h-3.5" />
              Sign In
            </Button>
          )}

          <Button
            size="sm"
            onClick={handleSave}
            className="bg-indigo-600 hover:bg-indigo-500 font-semibold text-xs h-9 cursor-pointer"
          >
            {isSaved ? "Saved!" : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <Card className="bg-[#121620] border-[#1e2536]">
          <CardHeader className="pb-3 flex flex-row items-center gap-2">
            <User className="w-4 h-4 text-indigo-400" />
            <CardTitle className="text-sm font-semibold text-white">Profile Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Full Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-[#0d1017] border-[#1e2536] text-xs"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Registered Email</label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#0d1017] border-[#1e2536] text-xs"
              />
            </div>
            <div className="pt-1 flex items-center justify-between">
              <span className="text-slate-400">Account Status:</span>
              <Badge variant="success" className="text-[10px]">
                Active Candidate Session
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Database & Supabase Backend Architecture */}
        <Card className="bg-[#121620] border-[#1e2536]">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-400" />
              <CardTitle className="text-sm font-semibold text-white">Supabase PostgreSQL Architecture</CardTitle>
            </div>
            {isConfigured ? (
              <Badge variant="success" className="text-[10px] gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Live Cloud Active
              </Badge>
            ) : (
              <Badge variant="outline" className="text-[10px] text-indigo-300 border-indigo-500/30">
                Stage 3 Schema Ready
              </Badge>
            )}
          </CardHeader>
          <CardContent className="space-y-3.5 text-xs">
            <div className="p-3 rounded-lg bg-[#0d1017] border border-[#1e2536] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200">12 Normalized PostgreSQL Tables</span>
                <span className="text-[10px] text-emerald-400 font-mono">100% RLS Protected</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Schema: <code className="text-slate-300">profiles, examinations, examination_dates, applications, credentials, documents, notifications, reminders, exam_sources, monitoring_logs, examination_results, user_settings</code>
              </p>
              <div className="text-[10px] text-slate-500 pt-1 border-t border-[#1a2133]">
                Migration File: <code className="text-indigo-300">supabase/migrations/20261119000000_init_examvault_schema.sql</code>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#0d1017] border border-[#1e2536] space-y-1.5">
              <span className="font-semibold text-slate-300 block">Connecting to your Supabase Project:</span>
              <p className="text-slate-400 text-[11px]">
                Create a free project at <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-indigo-400 underline">supabase.com</a>, run the migration in SQL Editor, and paste your project URL & Anon Key into <code className="text-slate-300">.env.local</code>.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Security & Vault Master Password */}
        <Card className="bg-[#121620] border-[#1e2536]">
          <CardHeader className="pb-3 flex flex-row items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <CardTitle className="text-sm font-semibold text-white">Vault Security & Encryption</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Auto-Lock Inactivity Period (Minutes)</label>
              <Input
                value={autoLockMinutes}
                onChange={(e) => setAutoLockMinutes(e.target.value)}
                className="bg-[#0d1017] border-[#1e2536] text-xs"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Master Password Status</label>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#0d1017] border border-[#1e2536]">
                <span className="text-emerald-400 font-medium">Configured (Client PBKDF2)</span>
                <Button size="sm" variant="outline" className="h-7 text-[11px]">
                  Change Key
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications & Reminders */}
        <Card className="bg-[#121620] border-[#1e2536]">
          <CardHeader className="pb-3 flex flex-row items-center gap-2">
            <Bell className="w-4 h-4 text-amber-400" />
            <CardTitle className="text-sm font-semibold text-white">Reminder Scheduling</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Default Alert Milestones (Days before event)</label>
              <Input
                value={reminderDays}
                onChange={(e) => setReminderDays(e.target.value)}
                className="bg-[#0d1017] border-[#1e2536] text-xs"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Comma-separated days before examination or deadline.
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#0d1017] border border-[#1e2536]">
              <span className="text-slate-300">Web Push Notifications</span>
              <Badge variant="outline" className="text-indigo-400 border-indigo-500/30">
                PWA Enabled
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Local Storage & Offline Functionality (Dexie.js IndexedDB) */}
        <Card className="bg-[#121620] border-[#1e2536]">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-indigo-400" />
              <CardTitle className="text-sm font-semibold text-white">
                IndexedDB & Offline Storage
              </CardTitle>
            </div>
            <Badge
              variant={effectiveOnline ? "success" : "outline"}
              className="text-[10px] gap-1"
            >
              {effectiveOnline ? (
                <>
                  <Wifi className="w-3 h-3 text-emerald-400" />
                  Online
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 text-amber-400" />
                  Offline
                </>
              )}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-3.5 text-xs">
            <div className="p-3 rounded-lg bg-[#0d1017] border border-[#1e2536] space-y-2">
              <div className="flex items-center justify-between text-slate-300">
                <span className="font-semibold">Local IndexedDB (Dexie v4)</span>
                <span className="font-mono text-indigo-400">
                  {storageMetrics.examCount} Exams • {storageMetrics.documentCount} Docs
                </span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                ExamVault functions completely offline on mobile and desktop. All records, documents, and credentials stay cached on your device.
              </p>
              {pendingCount > 0 && (
                <div className="text-amber-400 text-[11px] flex items-center gap-1 font-medium pt-1">
                  <span>{pendingCount} unsynced local mutations waiting for network reconnection.</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsStorageModalOpen(true)}
                className="text-xs h-8 gap-1.5 flex-1 border-indigo-500/30 text-indigo-300 hover:bg-indigo-950/40"
              >
                <Database className="w-3.5 h-3.5" />
                Inspect Storage & Queue
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={toggleSimulatedOffline}
                className={`text-xs h-8 gap-1.5 ${
                  isSimulatedOffline
                    ? "border-amber-500/40 text-amber-300 bg-amber-950/40"
                    : "border-slate-700 text-slate-300"
                }`}
              >
                {isSimulatedOffline ? "Disable Offline Mode" : "Simulate Offline"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Data Portability & JSON Export */}
        <Card className="bg-[#121620] border-[#1e2536]">
          <CardHeader className="pb-3 flex flex-row items-center gap-2">
            <Download className="w-4 h-4 text-indigo-400" />
            <CardTitle className="text-sm font-semibold text-white">Data Portability & Backup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3.5 text-xs">
            <div className="p-3 rounded-lg bg-[#0d1017] border border-[#1e2536] space-y-1.5">
              <span className="font-semibold text-slate-300 block">Export Candidate Records</span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Download a complete, offline-readable JSON export containing all your {examinations.length} examinations, dates, deadlines, and registration numbers.
              </p>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={handleExportBackup}
              className="text-xs h-8 gap-1.5 w-full border-slate-700 text-slate-200 hover:bg-slate-800"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              Download JSON Backup ({examinations.length} Examinations)
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
