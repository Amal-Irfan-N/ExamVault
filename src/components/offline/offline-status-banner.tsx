"use client";

import React from "react";
import { useOffline } from "@/context/OfflineContext";
import { WifiOff, Wifi, RefreshCw, Database, X, AlertTriangle } from "lucide-react";

export function OfflineStatusBanner() {
  const {
    effectiveOnline,
    isSimulatedOffline,
    toggleSimulatedOffline,
    pendingCount,
    isSyncing,
    syncPendingMutations,
    setIsStorageModalOpen,
    reconnectedNotice,
    dismissReconnectedNotice,
  } = useOffline();

  return (
    <>
      {/* Offline Mode Active Banner */}
      {!effectiveOnline && (
        <aside
          aria-label="Offline Mode Active"
          className="bg-gradient-to-r from-amber-950/90 via-amber-900/80 to-amber-950/90 border-b border-amber-600/40 text-amber-200 px-4 py-2.5 transition-all animate-fadeIn backdrop-blur-md sticky top-0 z-50 shadow-lg"
        >
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
              <div className="flex items-center gap-1.5 font-semibold text-amber-100">
                <WifiOff className="h-4 w-4 text-amber-400 shrink-0" />
                <span>Offline Mode Active</span>
                {isSimulatedOffline && (
                  <span className="text-[10px] font-mono uppercase bg-amber-800/80 text-amber-300 px-1.5 py-0.5 rounded border border-amber-600/50">
                    Simulated
                  </span>
                )}
              </div>
              <span className="hidden md:inline text-amber-300/80">
                — Working from local IndexedDB cache. Changes are safely saved locally.
              </span>
            </div>

            <div className="flex items-center gap-2">
              {pendingCount > 0 && (
                <span className="flex items-center gap-1 bg-amber-900/80 text-amber-200 font-mono text-xs px-2.5 py-1 rounded-full border border-amber-600/50">
                  <AlertTriangle className="h-3 w-3 text-amber-400" />
                  {pendingCount} unsynced {pendingCount === 1 ? "change" : "changes"}
                </span>
              )}

              <button
                type="button"
                onClick={() => setIsStorageModalOpen(true)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-800/60 hover:bg-amber-700/80 text-amber-100 border border-amber-500/40 font-medium transition-colors text-xs"
              >
                <Database className="h-3.5 w-3.5 text-amber-300" />
                Storage & Sync
              </button>

              {isSimulatedOffline && (
                <button
                  type="button"
                  onClick={toggleSimulatedOffline}
                  className="px-2.5 py-1 rounded-md bg-emerald-700/60 hover:bg-emerald-600/80 text-emerald-100 border border-emerald-500/40 font-medium transition-colors text-xs"
                >
                  Go Online
                </button>
              )}
            </div>
          </div>
        </aside>
      )}

      {/* Reconnected Toast Notification */}
      {effectiveOnline && reconnectedNotice && (
        <aside
          aria-label="Reconnected notification"
          className="bg-gradient-to-r from-emerald-950/90 via-emerald-900/80 to-emerald-950/90 border-b border-emerald-600/40 text-emerald-200 px-4 py-2 transition-all animate-fadeIn backdrop-blur-md sticky top-0 z-50 shadow-md"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <Wifi className="h-4 w-4 text-emerald-400 shrink-0" />
              <span className="font-semibold text-emerald-100">Back Online</span>
              <span className="hidden sm:inline text-emerald-300/80">
                — Connection restored. All local changes are synchronized with ExamVault Cloud.
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => syncPendingMutations()}
                disabled={isSyncing}
                className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-800/60 hover:bg-emerald-700/80 text-emerald-100 border border-emerald-500/40 font-medium transition-colors text-xs"
              >
                <RefreshCw className={`h-3 w-3 ${isSyncing ? "animate-spin" : ""}`} />
                {isSyncing ? "Syncing..." : "Sync"}
              </button>
              <button
                type="button"
                onClick={dismissReconnectedNotice}
                className="text-emerald-300 hover:text-white p-1 rounded transition-colors"
                title="Dismiss"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </aside>
      )}
    </>
  );
}
