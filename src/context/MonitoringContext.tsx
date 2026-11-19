"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  DetectedUpdate,
  MonitoredPortalSource,
} from "@/types/monitoring";
import {
  INITIAL_MONITORED_SOURCES,
  INITIAL_DETECTED_UPDATES,
} from "@/lib/monitoring/monitoring-worker";
import { useExaminations } from "@/context/ExaminationContext";
import { ExamStatus } from "@/types/examination";

interface MonitoringContextType {
  sources: MonitoredPortalSource[];
  detectedUpdates: DetectedUpdate[];
  pendingUpdatesCount: number;
  isScanning: boolean;
  lastScanTimestamp: string;
  runMonitoringScan: () => Promise<number>;
  applyUpdate: (updateId: string) => Promise<boolean>;
  dismissUpdate: (updateId: string) => void;
  addMonitoredSource: (sourceData: Omit<MonitoredPortalSource, "id">) => void;
  toggleSourcePause: (sourceId: string) => void;
  deleteSource: (sourceId: string) => void;
}

const SOURCES_KEY = "examvault_monitored_sources_v1";
const UPDATES_KEY = "examvault_detected_updates_v1";

const MonitoringContext = createContext<MonitoringContextType | undefined>(undefined);

export function MonitoringProvider({ children }: { children: React.ReactNode }) {
  const { updateExamination } = useExaminations();

  const [sources, setSources] = useState<MonitoredPortalSource[]>(() => {
    if (typeof window === "undefined") return INITIAL_MONITORED_SOURCES;
    try {
      const stored = localStorage.getItem(SOURCES_KEY);
      return stored ? JSON.parse(stored) : INITIAL_MONITORED_SOURCES;
    } catch {
      return INITIAL_MONITORED_SOURCES;
    }
  });

  const [detectedUpdates, setDetectedUpdates] = useState<DetectedUpdate[]>(() => {
    if (typeof window === "undefined") return INITIAL_DETECTED_UPDATES;
    try {
      const stored = localStorage.getItem(UPDATES_KEY);
      return stored ? JSON.parse(stored) : INITIAL_DETECTED_UPDATES;
    } catch {
      return INITIAL_DETECTED_UPDATES;
    }
  });

  const [isScanning, setIsScanning] = useState(false);
  const [lastScanTimestamp, setLastScanTimestamp] = useState<string>(
    new Date().toISOString()
  );

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(SOURCES_KEY, JSON.stringify(sources));
    } catch (e) {
      console.warn("Failed to persist sources:", e);
    }
  }, [sources]);

  useEffect(() => {
    try {
      localStorage.setItem(UPDATES_KEY, JSON.stringify(detectedUpdates));
    } catch (e) {
      console.warn("Failed to persist detected updates:", e);
    }
  }, [detectedUpdates]);

  // Run instant portal check worker
  const runMonitoringScan = async (): Promise<number> => {
    setIsScanning(true);

    // Simulate polite respectful scraping scan delay
    await new Promise((res) => setTimeout(res, 1200));

    const now = new Date().toISOString();
    setLastScanTimestamp(now);

    // Update all sources lastCheckedAt
    setSources((prev) =>
      prev.map((s) => ({
        ...s,
        lastCheckedAt: now,
        lastStatusCode: 200,
        healthStatus: "healthy",
      }))
    );

    // Generate a newly detected notification event
    const newUpdate: DetectedUpdate = {
      id: `update-${Date.now()}`,
      sourceId: "source-ssc",
      examName: "SSC Combined Graduate Level (CGL) 2026",
      org: "SSC",
      updateType: "deadline_extension",
      headline: "Notice No. 04/2026: Online Application Deadline Extended",
      summary:
        "Staff Selection Commission extended CGL 2026 application closing date by 5 days due to heavy portal server traffic. Revised closing date: 15 July 2026.",
      sourceUrl: "https://ssc.gov.in/notice-board",
      detectedAt: now,
      status: "pending_review",
      confidenceScore: 99,
      extractedChanges: [
        {
          field: "applicationClosingDate",
          oldValue: "2026-07-10",
          newValue: "2026-07-15",
        },
      ],
    };

    setDetectedUpdates((prev) => [newUpdate, ...prev]);
    setIsScanning(false);
    return 1;
  };

  // Apply update to examination
  const applyUpdate = async (updateId: string): Promise<boolean> => {
    const target = detectedUpdates.find((u) => u.id === updateId);
    if (!target) return false;

    // Apply extracted changes to Examination record if linked
    if (target.examId && target.extractedChanges) {
      const updatesToApply: Record<string, unknown> = {};

      target.extractedChanges.forEach((ch) => {
        if (ch.field === "status") {
          updatesToApply.status = ch.newValue as ExamStatus;
        } else if (ch.field === "hallTicketDownloadUrl") {
          updatesToApply.hallTicketDownloadUrl = ch.newValue;
        } else if (ch.field === "applicationClosingDate") {
          updatesToApply.applicationClosingDate = {
            date: ch.newValue,
            certainty: "confirmed",
          };
        } else if (ch.field === "examDate") {
          updatesToApply.examDate = {
            date: ch.newValue.split(" ")[0],
            certainty: "confirmed",
          };
        }
      });

      updateExamination(target.examId, updatesToApply);
    }

    // Mark update as applied
    setDetectedUpdates((prev) =>
      prev.map((u) => (u.id === updateId ? { ...u, status: "applied" } : u))
    );

    return true;
  };

  const dismissUpdate = (updateId: string) => {
    setDetectedUpdates((prev) =>
      prev.map((u) => (u.id === updateId ? { ...u, status: "dismissed" } : u))
    );
  };

  const addMonitoredSource = (sourceData: Omit<MonitoredPortalSource, "id">) => {
    const newSource: MonitoredPortalSource = {
      ...sourceData,
      id: `source-${Date.now()}`,
      lastCheckedAt: new Date().toISOString(),
      lastStatusCode: 200,
      healthStatus: "healthy",
      isPaused: false,
    };
    setSources((prev) => [newSource, ...prev]);
  };

  const toggleSourcePause = (sourceId: string) => {
    setSources((prev) =>
      prev.map((s) => (s.id === sourceId ? { ...s, isPaused: !s.isPaused } : s))
    );
  };

  const deleteSource = (sourceId: string) => {
    setSources((prev) => prev.filter((s) => s.id !== sourceId));
  };

  const pendingUpdatesCount = detectedUpdates.filter((u) => u.status === "pending_review").length;

  return (
    <MonitoringContext.Provider
      value={{
        sources,
        detectedUpdates,
        pendingUpdatesCount,
        isScanning,
        lastScanTimestamp,
        runMonitoringScan,
        applyUpdate,
        dismissUpdate,
        addMonitoredSource,
        toggleSourcePause,
        deleteSource,
      }}
    >
      {children}
    </MonitoringContext.Provider>
  );
}

export function useMonitoring() {
  const context = useContext(MonitoringContext);
  if (!context) {
    throw new Error("useMonitoring must be used within a MonitoringProvider");
  }
  return context;
}
