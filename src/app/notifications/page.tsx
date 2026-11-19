"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDateTime } from "@/lib/utils";
import { useMonitoring } from "@/context/MonitoringContext";
import { ChangeReviewModal } from "@/components/monitoring/change-review-modal";
import { AddTargetModal } from "@/components/monitoring/add-target-modal";
import { DetectedUpdate } from "@/types/monitoring";
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  Award,
  Sparkles,
  ExternalLink,
  RefreshCw,
  Globe,
  Plus,
  Radio,
  ArrowRight,
  ShieldCheck,
  Pause,
  Play,
  Trash2,
} from "lucide-react";

interface AppNotification {
  id: string;
  title: string;
  message: string;
  examName: string;
  category: "admit_card" | "deadline" | "monitoring" | "result";
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

const INITIAL_NOTIFICATIONS: AppNotification[] = [];

export default function NotificationsPage() {
  const {
    sources,
    detectedUpdates,
    pendingUpdatesCount,
    isScanning,
    lastScanTimestamp,
    runMonitoringScan,
    applyUpdate,
    dismissUpdate,
    toggleSourcePause,
    deleteSource,
  } = useMonitoring();

  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState<"monitoring" | "general">("monitoring");
  const [reviewUpdate, setReviewUpdate] = useState<DetectedUpdate | null>(null);
  const [isAddTargetOpen, setIsAddTargetOpen] = useState(false);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const getNotificationIcon = (cat: AppNotification["category"]) => {
    switch (cat) {
      case "admit_card":
        return <Award className="w-4 h-4 text-emerald-400" />;
      case "deadline":
        return <AlertCircle className="w-4 h-4 text-amber-400" />;
      case "monitoring":
        return <Sparkles className="w-4 h-4 text-indigo-400" />;
      case "result":
        return <CheckCircle2 className="w-4 h-4 text-blue-400" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
                Notifications & Portal Monitoring
              </h1>
              {pendingUpdatesCount > 0 && (
                <Badge variant="destructive" className="text-[11px] font-bold">
                  {pendingUpdatesCount} updates to review
                </Badge>
              )}
            </div>
            <p className="text-xs text-slate-400">
              Automated website diff alerts, deadline countdowns and official recruitment bulletins
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={isScanning}
              onClick={runMonitoringScan}
              className="text-xs h-9 px-3 gap-1.5 border-[#28324a] text-slate-300 hover:text-white cursor-pointer"
              title="Run background check on all active official portals"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-indigo-400 ${isScanning ? "animate-spin" : ""}`} />
              {isScanning ? "Scanning Official Sites..." : "Check Sites Now"}
            </Button>

            <Button
              size="sm"
              onClick={() => setIsAddTargetOpen(true)}
              className="text-xs h-9 px-3.5 bg-indigo-600 hover:bg-indigo-500 font-semibold gap-1.5 cursor-pointer shadow-lg shadow-indigo-950/40"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Portal Target
            </Button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-[#1e2536] pb-1">
          <button
            onClick={() => setActiveTab("monitoring")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "monitoring"
                ? "bg-[#121620] text-indigo-400 border-t border-x border-[#1e2536]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            Website Change Detection
            {pendingUpdatesCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono bg-red-500/20 text-red-300 border border-red-500/30">
                {pendingUpdatesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("general")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "general"
                ? "bg-[#121620] text-indigo-400 border-t border-x border-[#1e2536]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            All Examination Alerts ({notifications.length})
          </button>
        </div>

        {/* Tab 1: Website Monitoring Engine */}
        {activeTab === "monitoring" ? (
          <div className="space-y-6">
            {/* Worker Health Banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#121622] border border-[#232b3f] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">
                      Automated Monitoring Worker: <span className="text-emerald-400">ACTIVE</span>
                    </span>
                    <span className="text-[10px] bg-[#1a2337] px-2 py-0.5 rounded text-slate-300">
                      Respectful Rate-Limiting
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Checking {sources.filter((s) => !s.isPaused).length} official government portals. Last run: {formatDateTime(lastScanTimestamp)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto text-xs">
                <span className="text-slate-400">
                  <strong className="text-white font-mono">{sources.length}</strong> targets tracked
                </span>
              </div>
            </div>

            {/* Pending Detected Updates Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  Detected Website Changes Requiring Review
                </h3>
                <span className="text-xs text-slate-400">
                  {detectedUpdates.filter((u) => u.status === "pending_review").length} pending approval
                </span>
              </div>

              <div className="space-y-3">
                {detectedUpdates.filter((u) => u.status === "pending_review").length === 0 ? (
                  <div className="p-8 text-center rounded-xl bg-[#121620] border border-[#1e2536] text-xs text-slate-400">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                    All detected updates have been reviewed and applied.
                  </div>
                ) : (
                  detectedUpdates
                    .filter((u) => u.status === "pending_review")
                    .map((update) => (
                      <Card
                        key={update.id}
                        className="bg-[#121620] border-indigo-500/30 hover:border-indigo-500/50 transition-all"
                      >
                        <CardContent className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-1.5 flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs font-bold text-white bg-indigo-500/20 px-2 py-0.5 rounded border border-indigo-500/30">
                                {update.org}
                              </span>
                              <Badge variant="outline" className="text-[10px] text-slate-400 border-[#28324a]">
                                {update.examName}
                              </Badge>
                              <span className="text-[10px] text-emerald-400 font-mono">
                                {update.confidenceScore}% confidence
                              </span>
                              <span className="text-[10px] text-slate-500">
                                {formatDateTime(update.detectedAt)}
                              </span>
                            </div>

                            <h4 className="text-sm font-bold text-white leading-tight">
                              {update.headline}
                            </h4>

                            <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                              {update.summary}
                            </p>

                            {update.extractedChanges && update.extractedChanges.length > 0 && (
                              <div className="flex items-center gap-2 text-[11px] text-amber-300 font-medium pt-1">
                                <span>Proposed Update:</span>
                                <span className="font-mono bg-[#0b0e14] px-1.5 py-0.5 rounded border border-[#1e2536]">
                                  {update.extractedChanges[0].field} ➔ {update.extractedChanges[0].newValue}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0 self-end md:self-auto">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => dismissUpdate(update.id)}
                              className="text-xs h-8 px-3 border-[#28324a] text-slate-400 hover:text-white cursor-pointer"
                            >
                              Dismiss
                            </Button>

                            <Button
                              size="sm"
                              onClick={() => setReviewUpdate(update)}
                              className="text-xs h-8 px-4 bg-indigo-600 hover:bg-indigo-500 font-semibold gap-1.5 cursor-pointer shadow-lg shadow-indigo-950/40"
                            >
                              <span>Review & Apply</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                )}
              </div>
            </div>

            {/* Monitored Portals Table / Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-indigo-400" />
                  Tracked Official Recruitment Websites ({sources.length})
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sources.map((source) => (
                  <Card
                    key={source.id}
                    className="bg-[#121620] border-[#1e2536] hover:border-indigo-500/40 transition-all flex flex-col justify-between"
                  >
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-bold text-white bg-indigo-500/15 border border-indigo-500/30 px-2 py-0.5 rounded">
                          {source.org}
                        </span>

                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                            source.isPaused
                              ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                              : "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              source.isPaused ? "bg-amber-400" : "bg-emerald-400 animate-pulse"
                            }`}
                          />
                          {source.isPaused ? "Paused" : "Monitoring"}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-white tracking-tight line-clamp-1">
                          {source.portalName}
                        </h4>
                        <a
                          href={source.targetUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-mono truncate max-w-full mt-0.5"
                        >
                          <span className="truncate">{source.targetUrl}</span>
                          <ExternalLink className="w-2.5 h-2.5 flex-shrink-0" />
                        </a>
                      </div>

                      <div className="text-[11px] text-slate-400 space-y-1 pt-1 border-t border-[#1a2133]">
                        <div className="flex items-center justify-between">
                          <span>Check Frequency:</span>
                          <span className="text-slate-300 font-medium">Every {source.checkIntervalMinutes} mins</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Last Checked:</span>
                          <span className="text-slate-300 font-medium">
                            {source.lastCheckedAt ? formatDateTime(source.lastCheckedAt) : "Pending"}
                          </span>
                        </div>
                      </div>

                      {/* Card Control Actions */}
                      <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-[#1a2133]">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleSourcePause(source.id)}
                          className="text-xs h-7 px-2 text-slate-400 hover:text-white cursor-pointer"
                          title={source.isPaused ? "Resume Monitoring" : "Pause Monitoring"}
                        >
                          {source.isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                        </Button>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteSource(source.id)}
                          className="text-xs h-7 px-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer"
                          title="Remove Target"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Tab 2: General Examination Notifications */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Displaying all in-app notifications and countdown alerts
              </span>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllRead}
                  className="text-xs text-indigo-400 hover:text-indigo-300 cursor-pointer"
                >
                  Mark all as read
                </Button>
              )}
            </div>

            <div className="space-y-3">
              {notifications.length === 0 ? (
                <div className="p-10 text-center rounded-xl bg-[#121620] border border-[#1e2536]">
                  <Bell className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                  <h3 className="text-sm font-semibold text-slate-300">No new notifications</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    You are all caught up! Real-time alerts for admit cards, result announcements, and deadline reminders will appear here.
                  </p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <Card
                    key={notif.id}
                    className={`border-[#1e2536] transition-colors ${
                      notif.isRead ? "bg-[#121620] opacity-80" : "bg-[#141926] border-indigo-500/30"
                    }`}
                  >
                    <CardContent className="p-4 sm:p-5 flex items-start gap-3.5">
                      <div className="p-2.5 rounded-xl bg-[#0b0e14] border border-[#1e2536] flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notif.category)}
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white">{notif.title}</h4>
                            {!notif.isRead && (
                              <span className="w-2 h-2 rounded-full bg-indigo-500" />
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500">
                            {formatDateTime(notif.timestamp)}
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed">
                          {notif.message}
                        </p>

                        <div className="flex items-center justify-between pt-2">
                          <span className="text-[11px] font-medium text-slate-400">
                            {notif.examName}
                          </span>

                          {notif.actionUrl && (
                            <a
                              href={notif.actionUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                            >
                              <span>Action Link</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}

        {/* Change Review Modal */}
        <ChangeReviewModal
          isOpen={Boolean(reviewUpdate)}
          update={reviewUpdate}
          onAccept={applyUpdate}
          onDismiss={dismissUpdate}
          onClose={() => setReviewUpdate(null)}
        />

        {/* Add Target Modal */}
        <AddTargetModal
          isOpen={isAddTargetOpen}
          onClose={() => setIsAddTargetOpen(false)}
        />
      </div>
    </AppLayout>
  );
}
