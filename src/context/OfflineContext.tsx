"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useTransition } from "react";
import {
  examVaultDB,
  getStorageMetrics,
  OfflineMutation,
  CachedBlob,
} from "@/lib/db/indexed-db";
import { runCloudSync, SyncAuditItem } from "@/lib/sync/sync-engine";

interface StorageMetricsData {
  usageBytes: number;
  quotaBytes: number;
  percentUsed: number;
  examCount: number;
  documentCount: number;
  credentialCount: number;
  pendingMutationCount: number;
  cachedBlobCount: number;
}

interface OfflineContextType {
  isOnline: boolean;
  isSimulatedOffline: boolean;
  effectiveOnline: boolean;
  toggleSimulatedOffline: () => void;
  pendingMutations: OfflineMutation[];
  pendingCount: number;
  storageMetrics: StorageMetricsData;
  isSyncing: boolean;
  isStorageModalOpen: boolean;
  setIsStorageModalOpen: (open: boolean) => void;
  queueMutation: (
    entity: "examination" | "document" | "credential",
    entityId: string,
    action: "create" | "update" | "delete",
    payload?: any // eslint-disable-line @typescript-eslint/no-explicit-any
  ) => Promise<void>;
  syncPendingMutations: () => Promise<{ success: boolean; syncedCount: number; message: string }>;
  clearOfflineCache: () => Promise<void>;
  refreshMetrics: () => Promise<void>;
  cacheDocumentBlob: (documentId: string, fileName: string, mimeType: string, base64Data: string) => Promise<void>;
  getCachedDocumentBlob: (documentId: string) => Promise<CachedBlob | undefined>;
  lastSyncTime: string | null;
  reconnectedNotice: boolean;
  dismissReconnectedNotice: () => void;
  auditLog: SyncAuditItem[];
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export function OfflineProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return navigator.onLine;
    }
    return true;
  });

  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(false);
  const [pendingMutations, setPendingMutations] = useState<OfflineMutation[]>([]);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isStorageModalOpen, setIsStorageModalOpen] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [reconnectedNotice, setReconnectedNotice] = useState<boolean>(false);
  const [auditLog, setAuditLog] = useState<SyncAuditItem[]>([]);
  const [, startTransition] = useTransition();

  const [storageMetrics, setStorageMetrics] = useState<StorageMetricsData>({
    usageBytes: 0,
    quotaBytes: 0,
    percentUsed: 0,
    examCount: 0,
    documentCount: 0,
    credentialCount: 0,
    pendingMutationCount: 0,
    cachedBlobCount: 0,
  });

  const effectiveOnline = isOnline && !isSimulatedOffline;

  // Refresh storage metrics from IndexedDB
  const refreshMetrics = useCallback(async () => {
    try {
      const metrics = await getStorageMetrics();
      startTransition(() => {
        setStorageMetrics(metrics);
        setPendingCount(metrics.pendingMutationCount);
      });

      const mutations = await examVaultDB.offlineMutations
        .where("status")
        .equals("pending")
        .reverse()
        .sortBy("timestamp");

      startTransition(() => {
        setPendingMutations(mutations);
      });
    } catch (err) {
      console.warn("Could not read storage metrics:", err);
    }
  }, []);

  // Sync pending mutations to server / reconcile cloud records
  const syncPendingMutations = useCallback(async (): Promise<{
    success: boolean;
    syncedCount: number;
    message: string;
  }> => {
    setIsSyncing(true);
    try {
      const result = await runCloudSync("user-demo-1", false);
      setLastSyncTime(result.timestamp);
      setAuditLog((prev) => [...result.auditLog, ...prev].slice(0, 50));
      await refreshMetrics();
      setIsSyncing(false);

      return {
        success: result.success,
        syncedCount: result.syncedExams + result.syncedDocs + result.syncedCreds,
        message: result.message,
      };
    } catch (err) {
      setIsSyncing(false);
      console.error("Sync error:", err);
      return {
        success: false,
        syncedCount: 0,
        message: "Failed to synchronize changes. Offline modifications remain queued locally.",
      };
    }
  }, [refreshMetrics]);

  // Queue an offline mutation in IndexedDB
  const queueMutation = useCallback(
    async (
      entity: "examination" | "document" | "credential",
      entityId: string,
      action: "create" | "update" | "delete",
      payload?: any // eslint-disable-line @typescript-eslint/no-explicit-any
    ) => {
      try {
        const mutation: OfflineMutation = {
          id: `mut-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          entity,
          entityId,
          action,
          payload,
          timestamp: Date.now(),
          status: "pending",
          retryCount: 0,
        };

        await examVaultDB.offlineMutations.add(mutation);
        await refreshMetrics();
      } catch (err) {
        console.error("Failed to queue offline mutation:", err);
      }
    },
    [refreshMetrics]
  );

  // Toggle simulated offline for QA / testing
  const toggleSimulatedOffline = useCallback(() => {
    setIsSimulatedOffline((prev) => {
      const next = !prev;
      if (!next && isOnline) {
        // Returned to effective online
        setReconnectedNotice(true);
      }
      return next;
    });
  }, [isOnline]);

  // Dismiss reconnection toast
  const dismissReconnectedNotice = useCallback(() => {
    setReconnectedNotice(false);
  }, []);

  // Clear local cache and re-index
  const clearOfflineCache = useCallback(async () => {
    try {
      await examVaultDB.offlineMutations.clear();
      await examVaultDB.cachedBlobs.clear();
      await refreshMetrics();
    } catch (err) {
      console.error("Failed to clear offline cache:", err);
    }
  }, [refreshMetrics]);

  // Cache a document blob/base64 for offline document viewing
  const cacheDocumentBlob = useCallback(
    async (documentId: string, fileName: string, mimeType: string, base64Data: string) => {
      try {
        const cachedItem: CachedBlob = {
          id: documentId,
          documentId,
          fileName,
          mimeType,
          size: Math.round((base64Data.length * 3) / 4),
          dataBase64: base64Data,
          cachedAt: Date.now(),
        };
        await examVaultDB.cachedBlobs.put(cachedItem);
        await refreshMetrics();
      } catch (err) {
        console.warn("Failed to cache document blob:", err);
      }
    },
    [refreshMetrics]
  );

  // Retrieve cached document blob
  const getCachedDocumentBlob = useCallback(async (documentId: string): Promise<CachedBlob | undefined> => {
    try {
      return await examVaultDB.cachedBlobs.get(documentId);
    } catch {
      return undefined;
    }
  }, []);

  // Window event listeners for online and offline state
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleOnline = () => {
      setIsOnline(true);
      setReconnectedNotice(true);
      if (!isSimulatedOffline) {
        syncPendingMutations();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Initial metrics load
    refreshMetrics();

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [isSimulatedOffline, refreshMetrics, syncPendingMutations]);

  return (
    <OfflineContext.Provider
      value={{
        isOnline,
        isSimulatedOffline,
        effectiveOnline,
        toggleSimulatedOffline,
        pendingMutations,
        pendingCount,
        storageMetrics,
        isSyncing,
        isStorageModalOpen,
        setIsStorageModalOpen,
        queueMutation,
        syncPendingMutations,
        clearOfflineCache,
        refreshMetrics,
        cacheDocumentBlob,
        getCachedDocumentBlob,
        lastSyncTime,
        reconnectedNotice,
        dismissReconnectedNotice,
        auditLog,
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
}

export function useOffline() {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error("useOffline must be used within an OfflineProvider");
  }
  return context;
}
