"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  User,
  Shield,
  Bell,
  Cloud,
  Download,
  Upload,
} from "lucide-react";

export default function SettingsPage() {
  const [name, setName] = useState("Aman Verma");
  const [email, setEmail] = useState("aman.verma.exam@gmail.com");
  const [reminderDays, setReminderDays] = useState("30, 15, 7, 3, 1");
  const [autoLockMinutes, setAutoLockMinutes] = useState("15");

  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              Application Settings
            </h1>
            <Badge variant="outline" className="text-slate-400 border-[#232a3e]">
              v0.1.0 (Stage 1)
            </Badge>
          </div>
          <p className="text-xs md:text-sm text-slate-400">
            Manage your profile, credential encryption keys, cloud sync, and reminder preferences.
          </p>
        </div>

        <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 font-semibold text-xs h-9">
          Save Changes
        </Button>
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

        {/* Data Backup & Cloud Synchronization */}
        <Card className="bg-[#121620] border-[#1e2536]">
          <CardHeader className="pb-3 flex flex-row items-center gap-2">
            <Cloud className="w-4 h-4 text-sky-400" />
            <CardTitle className="text-sm font-semibold text-white">Cloud Sync & Data Backup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3.5 text-xs">
            <div className="p-3 rounded-lg bg-[#0d1017] border border-[#1e2536]">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-slate-200">Supabase Backend</span>
                <Badge variant="secondary" className="text-[10px]">
                  Configuring in Stage 3
                </Badge>
              </div>
              <p className="text-slate-400 text-[11px]">
                Currently running in local-first architecture. All records preserved in local state.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Button size="sm" variant="outline" className="gap-1.5 text-xs flex-1 h-8">
                <Download className="w-3.5 h-3.5" />
                Export JSON
              </Button>
              <Button size="sm" variant="outline" className="gap-1.5 text-xs flex-1 h-8">
                <Upload className="w-3.5 h-3.5" />
                Import JSON
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
