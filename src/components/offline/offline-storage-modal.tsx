"use client";

import React, { useState } from "react";
import { useOffline } from "@/context/OfflineContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Database,
  Wifi,
  WifiOff,
  RefreshCw,
  Trash2,
  HardDrive,
  FileText,
  Lock,
  GraduationCap,
  Clock,
  CheckCircle2,
} from "lucide-react";

export function OfflineStorageModal() {
  const {
    isSimulatedOffline,
    effectiveOnline,
    toggleSimulatedOffline,
    pendingMutations,
    pendingCount,
    storageMetrics,
    isSyncing,
    isStorageModalOpen,
    setIsStorageModalOpen,
    syncPendingMutations,
    clearOfflineCache,
    refreshMetrics,
    lastSyncTime,
    auditLog,
  } = useOffline();

  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "queue" | "conflicts">("overview");

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const handleManualSync = async () => {
    const res = await syncPendingMutations();
    setSyncFeedback(res.message);
    setTimeout(() => setSyncFeedback(null), 4000);
  };

  return (
    <Dialog open={isStorageModalOpen} onOpenChange={setIsStorageModalOpen}>
      <DialogContent className="max-w-2xl bg-[#121620] border-slate-800 text-slate-100 p-0 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 border-b border-slate-800/80 bg-slate-900/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <Database className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
                  Local Storage & Offline Sync
                  <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-indigo-950 text-indigo-300 border border-indigo-800/60 font-normal">
                    Dexie.js v4
                  </span>
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-400 mt-0.5">
                  Client-side IndexedDB persistence and bi-directional cloud synchronization
                </DialogDescription>
              </div>
            </div>

            {/* Live Network State Badge */}
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                  effectiveOnline
                    ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800/60"
                    : "bg-amber-950/80 text-amber-400 border border-amber-800/60"
                }`}
              >
                {effectiveOnline ? (
                  <>
                    <Wifi className="h-3.5 w-3.5" />
                    Online
                  </>
                ) : (
                  <>
                    <WifiOff className="h-3.5 w-3.5" />
                    Offline
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mt-4">
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === "overview"
                  ? "bg-indigo-600 text-white font-semibold shadow-sm"
                  : "bg-slate-800/50 text-slate-400 hover:text-slate-200"
              }`}
            >
              Storage Metrics
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("queue")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === "queue"
                  ? "bg-indigo-600 text-white font-semibold shadow-sm"
                  : "bg-slate-800/50 text-slate-400 hover:text-slate-200"
              }`}
            >
              Pending Mutation Queue
              {pendingCount > 0 && (
                <span className="px-1.5 py-0.2 bg-amber-500 text-slate-950 font-bold rounded-full text-[10px]">
                  {pendingCount}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("conflicts")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === "conflicts"
                  ? "bg-indigo-600 text-white font-semibold shadow-sm"
                  : "bg-slate-800/50 text-slate-400 hover:text-slate-200"
              }`}
            >
              Conflict & Sync Log
              {auditLog.length > 0 && (
                <span className="px-1.5 py-0.2 bg-indigo-500/30 text-indigo-300 font-mono text-[10px] rounded-full border border-indigo-500/40">
                  {auditLog.length}
                </span>
              )}
            </button>
          </div>
        </DialogHeader>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {syncFeedback && (
            <div className="p-3 bg-indigo-950/70 border border-indigo-500/40 rounded-xl text-indigo-200 text-xs flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0" />
              <span>{syncFeedback}</span>
            </div>
          )}

          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Simulate Offline Mode Switch */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <WifiOff className="h-4 w-4 text-amber-400" />
                    Simulate Offline Mode (QA Testing)
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Test offline editing, queueing, and automatic synchronization without disconnecting your device’s Wi-Fi.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={toggleSimulatedOffline}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all border shrink-0 ${
                    isSimulatedOffline
                      ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md hover:bg-amber-400"
                      : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                  }`}
                >
                  {isSimulatedOffline ? "Disable Simulator" : "Enable Offline Mode"}
                </button>
              </div>

              {/* IndexedDB Quota Meter */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                    <HardDrive className="h-4 w-4 text-indigo-400" />
                    IndexedDB Storage Consumption
                  </span>
                  <span className="font-mono text-slate-400">
                    {formatBytes(storageMetrics.usageBytes)} of {formatBytes(storageMetrics.quotaBytes || 10737418240)}
                  </span>
                </div>

                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-blue-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(storageMetrics.percentUsed, 1)}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-[11px] text-slate-500">
                  <span>Usage: {storageMetrics.percentUsed.toFixed(2)}% of available browser quota</span>
                  <span className="text-emerald-400">Offline Ready (Dexie.js IndexedDB)</span>
                </div>
              </div>

              {/* Cached Entity Counts */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400">Examinations</span>
                    <GraduationCap className="h-4 w-4 text-indigo-400" />
                  </div>
                  <div className="text-xl font-bold text-white font-mono">{storageMetrics.examCount}</div>
                  <div className="text-[10px] text-slate-500 mt-1">Full offline records</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400">Documents</span>
                    <FileText className="h-4 w-4 text-blue-400" />
                  </div>
                  <div className="text-xl font-bold text-white font-mono">{storageMetrics.documentCount}</div>
                  <div className="text-[10px] text-slate-500 mt-1">Metadata & cached slips</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400">Encrypted Credentials</span>
                    <Lock className="h-4 w-4 text-amber-400" />
                  </div>
                  <div className="text-xl font-bold text-white font-mono">{storageMetrics.credentialCount}</div>
                  <div className="text-[10px] text-slate-500 mt-1">AES-GCM encrypted</div>
                </div>
              </div>

              {/* Offline Capability Features */}
              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-2">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Offline Capabilities Guaranteed:
                </h4>
                <ul className="text-xs text-slate-400 space-y-1.5 list-disc pl-4">
                  <li>Full examination search, filtering, and timeline inspection without internet.</li>
                  <li>Local document preview with cached slips and PDFs.</li>
                  <li>Client-side zero-knowledge password vault unlocks offline via Web Crypto.</li>
                  <li>Mutations (Add / Edit / Archive) queued with automatic background replay.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === "queue" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-slate-300">
                  Queued Mutations ({pendingMutations.length})
                </h4>
                {pendingMutations.length > 0 && (
                  <button
                    type="button"
                    onClick={() => clearOfflineCache()}
                    className="flex items-center gap-1 text-[11px] text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="h-3 w-3" />
                    Clear Queue
                  </button>
                )}
              </div>

              {pendingMutations.length === 0 ? (
                <div className="text-center py-10 bg-slate-900/30 rounded-xl border border-dashed border-slate-800">
                  <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                  <p className="text-xs font-medium text-slate-300">Queue is Clean</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    No pending offline modifications awaiting synchronization.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                  {pendingMutations.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                              item.action === "create"
                                ? "bg-emerald-950 text-emerald-300 border border-emerald-800/60"
                                : item.action === "update"
                                ? "bg-blue-950 text-blue-300 border border-blue-800/60"
                                : "bg-red-950 text-red-300 border border-red-800/60"
                            }`}
                          >
                            {item.action}
                          </span>
                          <span className="font-semibold text-slate-200 capitalize">
                            {item.entity}: {item.entityId}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2">
                          <Clock className="h-3 w-3 text-slate-500" />
                          <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                          <span className="text-slate-600">•</span>
                          <span className="text-amber-400 font-mono text-[10px]">
                            status: {item.status}
                          </span>
                        </div>
                      </div>

                      <span className="px-2 py-1 bg-slate-800 text-slate-400 rounded text-[10px] font-mono shrink-0">
                        Pending
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "conflicts" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-slate-300">
                    Conflict Resolution & Sync Audit Log
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Deterministic timestamp-based (Last-Write-Wins) reconciliation between IndexedDB and Supabase PostgreSQL.
                  </p>
                </div>
              </div>

              {auditLog.length === 0 ? (
                <div className="text-center py-10 bg-slate-900/30 rounded-xl border border-dashed border-slate-800">
                  <CheckCircle2 className="h-8 w-8 text-indigo-400 mx-auto mb-2" />
                  <p className="text-xs font-medium text-slate-300">Harmonic Alignment</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    No sync conflicts detected. Local IndexedDB and Cloud database state are identical.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                  {auditLog.map((log) => (
                    <div
                      key={log.id}
                      className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                              log.winner === "local"
                                ? "bg-emerald-950 text-emerald-300 border border-emerald-800/60"
                                : "bg-blue-950 text-blue-300 border border-blue-800/60"
                            }`}
                          >
                            {log.winner === "local" ? "Local Record Won" : "Cloud Record Won"}
                          </span>
                          <span className="text-slate-300 font-semibold capitalize">
                            {log.entity}: {log.entityId}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {new Date(log.resolvedAt).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{log.details}</p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 pt-0.5">
                        <span className="font-mono bg-slate-800 px-1 rounded">Strategy: {log.strategy}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/60 flex items-center justify-between gap-3 text-xs">
          <div className="text-slate-400 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-slate-500" />
            <span>
              {lastSyncTime ? `Last synced at ${lastSyncTime}` : "Database synced locally"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => refreshMetrics()}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              title="Refresh Metrics"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onClick={handleManualSync}
              disabled={isSyncing || !effectiveOnline}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-semibold transition-all border ${
                effectiveOnline
                  ? "bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500 shadow-sm shadow-indigo-600/30"
                  : "bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed"
              }`}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? "animate-spin" : ""}`} />
              {isSyncing ? "Syncing to Cloud..." : "Sync Changes Now"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
