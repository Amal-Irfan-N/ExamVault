"use client";

import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import {
  Examination,
  ExamActivity,
  DashboardStats,
  UpcomingDeadlineItem,
  UpcomingExamDateItem,
  ExamStatus,
} from "@/types/examination";
import {
  INITIAL_MOCK_EXAMINATIONS,
  MOCK_ACTIVITIES,
  calculateDashboardStats,
  getUpcomingDeadlines,
  getUpcomingExamDates,
} from "@/data/mockExaminations";
import { examVaultDB, seedDatabaseIfEmpty, LocalExamination } from "@/lib/db/indexed-db";

export const DEFAULT_CATEGORIES = [
  "UPSC",
  "SSC",
  "ISRO",
  "GATE",
  "RRB",
  "DRDO",
  "State PSC",
  "Banking",
  "Defence",
  "PSU",
];

interface ExaminationContextType {
  examinations: Examination[];
  activities: ExamActivity[];
  addExamination: (exam: Omit<Examination, "id" | "userId" | "createdAt" | "updatedAt">) => Examination;
  updateExamination: (id: string, updates: Partial<Examination>) => void;
  deleteExamination: (id: string) => void;
  toggleExamCompletion: (id: string) => void;
  resetToSampleExaminations: () => void;
  categories: string[];
  addCategory: (name: string) => boolean;
  removeCategory: (name: string) => void;
  resetCategories: () => void;
  selectedYear: string;
  setSelectedYear: (year: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredExaminations: Examination[];
  stats: DashboardStats;
  upcomingDeadlines: UpcomingDeadlineItem[];
  upcomingExamDates: UpcomingExamDateItem[];
  isQuickAddOpen: boolean;
  setIsQuickAddOpen: (open: boolean) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
}

const ExaminationContext = createContext<ExaminationContextType | undefined>(undefined);

export function ExaminationProvider({ children }: { children: React.ReactNode }) {
  const [examinations, setExaminations] = useState<Examination[]>(() => {
    // Check localStorage in browser for persistent client session if available
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("examvault_exams");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        } catch {
          return INITIAL_MOCK_EXAMINATIONS;
        }
      }
    }
    return INITIAL_MOCK_EXAMINATIONS;
  });

  const [categories, setCategories] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("examvault_categories");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        } catch {
          return DEFAULT_CATEGORIES;
        }
      }
    }
    return DEFAULT_CATEGORIES;
  });

  const [activities, setActivities] = useState<ExamActivity[]>(MOCK_ACTIVITIES);
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isQuickAddOpen, setIsQuickAddOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);

  // Sync categories with localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("examvault_categories", JSON.stringify(categories));
    }
  }, [categories]);

  // Load from IndexedDB on initial mount
  useEffect(() => {
    async function loadFromIndexedDB() {
      try {
        const stored = await examVaultDB.examinations.toArray();
        if (stored.length > 0) {
          const list = stored.map((item) => (item.fullData ? item.fullData : item));
          setExaminations(list as unknown as Examination[]);
        } else {
          await seedDatabaseIfEmpty(INITIAL_MOCK_EXAMINATIONS, [], []);
          setExaminations(INITIAL_MOCK_EXAMINATIONS);
          if (typeof window !== "undefined") {
            localStorage.setItem("examvault_exams", JSON.stringify(INITIAL_MOCK_EXAMINATIONS));
          }
        }
      } catch (err) {
        console.warn("IndexedDB load error, fallback to localStorage:", err);
      }
    }
    loadFromIndexedDB();
  }, []);

  // Sync with client localStorage and IndexedDB (Dexie)
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("examvault_exams", JSON.stringify(examinations));
      try {
        const localItems: LocalExamination[] = examinations.map((exam) => ({
          id: exam.id,
          examName: exam.examName,
          recruitingOrg: exam.recruitingOrg,
          category: exam.category,
          postName: exam.postName,
          advertisementNumber: exam.advertisementNumber,
          recruitmentYear: exam.recruitmentYear,
          applicationStatus: exam.status,
          paymentStatus: exam.paymentStatus,
          examDate: exam.examDate?.date || undefined,
          dateCertainty: exam.examDate?.certainty || undefined,
          isArchived: exam.isArchived || false,
          updatedAt: exam.updatedAt || new Date().toISOString(),
          syncStatus: "synced",
          fullData: exam,
        }));
        examVaultDB.examinations.bulkPut(localItems).catch((e) => console.warn("Dexie bulkPut warning:", e));
      } catch (e) {
        console.warn("IndexedDB sync error:", e);
      }
    }
  }, [examinations]);

  // Global keyboard shortcut listener (⌘K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const addCategory = (name: string): boolean => {
    const trimmed = name.trim();
    if (!trimmed) return false;
    const exists = categories.some((c) => c.toLowerCase() === trimmed.toLowerCase());
    if (exists) return false;
    setCategories((prev) => [...prev, trimmed]);
    return true;
  };

  const removeCategory = (name: string) => {
    setCategories((prev) => prev.filter((c) => c.toLowerCase() !== name.toLowerCase()));
    if (selectedCategory.toLowerCase() === name.toLowerCase()) {
      setSelectedCategory("all");
    }
  };

  const resetCategories = () => {
    setCategories(DEFAULT_CATEGORIES);
  };

  const resetToSampleExaminations = () => {
    setExaminations(INITIAL_MOCK_EXAMINATIONS);
    if (typeof window !== "undefined") {
      localStorage.setItem("examvault_exams", JSON.stringify(INITIAL_MOCK_EXAMINATIONS));
    }
    const localItems: LocalExamination[] = INITIAL_MOCK_EXAMINATIONS.map((exam) => ({
      id: exam.id,
      examName: exam.examName,
      recruitingOrg: exam.recruitingOrg,
      category: exam.category,
      postName: exam.postName,
      advertisementNumber: exam.advertisementNumber,
      recruitmentYear: exam.recruitmentYear,
      applicationStatus: exam.status,
      paymentStatus: exam.paymentStatus,
      examDate: exam.examDate?.date || undefined,
      dateCertainty: exam.examDate?.certainty || undefined,
      isArchived: exam.isArchived || false,
      updatedAt: exam.updatedAt || new Date().toISOString(),
      syncStatus: "synced",
      fullData: exam,
    }));
    examVaultDB.examinations.clear().then(() => {
      examVaultDB.examinations.bulkPut(localItems);
    }).catch((e) => console.warn("Reset IndexedDB error:", e));
  };

  const addExamination = (newExamData: Omit<Examination, "id" | "userId" | "createdAt" | "updatedAt">): Examination => {
    const newExam: Examination = {
      ...newExamData,
      id: `exam-${Date.now()}`,
      userId: "user-demo-1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setExaminations((prev) => [newExam, ...prev]);

    // Queue offline mutation if currently disconnected
    if (typeof window !== "undefined" && !navigator.onLine) {
      examVaultDB.offlineMutations
        .add({
          id: `mut-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          entity: "examination",
          entityId: newExam.id,
          action: "create",
          payload: newExam,
          timestamp: Date.now(),
          status: "pending",
          retryCount: 0,
        })
        .catch((e) => console.warn("Failed to queue offline mutation:", e));
    }

    // Add activity record
    const newActivity: ExamActivity = {
      id: `act-${Date.now()}`,
      examId: newExam.id,
      examName: newExam.examName,
      action: "Examination Added",
      details: `Tracked ${newExam.recruitingOrg} ${newExam.postName} for recruitment year ${newExam.recruitmentYear}.`,
      timestamp: new Date().toISOString(),
      type: "status_change",
    };
    setActivities((prev) => [newActivity, ...prev]);

    return newExam;
  };

  const updateExamination = (id: string, updates: Partial<Examination>) => {
    setExaminations((prev) =>
      prev.map((exam) => (exam.id === id ? { ...exam, ...updates, updatedAt: new Date().toISOString() } : exam))
    );

    if (typeof window !== "undefined" && !navigator.onLine) {
      examVaultDB.offlineMutations
        .add({
          id: `mut-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          entity: "examination",
          entityId: id,
          action: "update",
          payload: updates,
          timestamp: Date.now(),
          status: "pending",
          retryCount: 0,
        })
        .catch((e) => console.warn("Failed to queue offline update mutation:", e));
    }
  };

  const toggleExamCompletion = (id: string) => {
    setExaminations((prev) =>
      prev.map((exam) => {
        if (exam.id !== id) return exam;
        const willBeCompleted = !exam.isCompleted;
        const newStatus = willBeCompleted
          ? (["result_published", "qualified", "not_qualified", "selected", "not_selected"].includes(exam.status)
              ? exam.status
              : "examination_completed")
          : (exam.status === "examination_completed" ? "examination_scheduled" : exam.status);

        const updated: Examination = {
          ...exam,
          isCompleted: willBeCompleted,
          status: newStatus as ExamStatus,
          updatedAt: new Date().toISOString(),
        };

        if (typeof window !== "undefined" && !navigator.onLine) {
          examVaultDB.offlineMutations
            .add({
              id: `mut-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
              entity: "examination",
              entityId: id,
              action: "update",
              payload: { isCompleted: willBeCompleted, status: newStatus },
              timestamp: Date.now(),
              status: "pending",
              retryCount: 0,
            })
            .catch(() => {});
        }

        return updated;
      })
    );
  };

  const deleteExamination = (id: string) => {
    setExaminations((prev) => prev.filter((exam) => exam.id !== id));
    examVaultDB.examinations.delete(id).catch((e) => console.warn("IndexedDB delete error:", e));

    if (typeof window !== "undefined" && !navigator.onLine) {
      examVaultDB.offlineMutations
        .add({
          id: `mut-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          entity: "examination",
          entityId: id,
          action: "delete",
          payload: { id },
          timestamp: Date.now(),
          status: "pending",
          retryCount: 0,
        })
        .catch((e) => console.warn("Failed to queue offline delete mutation:", e));
    }
  };

  // Filtered examinations
  const filteredExaminations = useMemo(() => {
    return examinations.filter((exam) => {
      // Year filter
      if (selectedYear !== "all" && exam.recruitmentYear.toString() !== selectedYear) {
        return false;
      }

      // Category filter
      if (selectedCategory !== "all" && exam.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }

      // Status filter
      if (selectedStatus === "applications") {
        if (!["application_not_started", "application_in_progress", "payment_pending", "interested"].includes(exam.status)) {
          return false;
        }
      } else if (selectedStatus === "scheduled") {
        if (!["examination_scheduled", "hall_ticket_available"].includes(exam.status)) {
          return false;
        }
      } else if (selectedStatus === "results") {
        if (!["result_pending", "result_published", "qualified", "selected"].includes(exam.status)) {
          return false;
        }
      } else if (selectedStatus !== "all" && exam.status !== selectedStatus) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          exam.examName.toLowerCase().includes(q) ||
          exam.recruitingOrg.toLowerCase().includes(q) ||
          exam.postName.toLowerCase().includes(q) ||
          (exam.registrationNumber && exam.registrationNumber.toLowerCase().includes(q)) ||
          (exam.applicationNumber && exam.applicationNumber.toLowerCase().includes(q));
        if (!matches) return false;
      }

      return true;
    });
  }, [examinations, selectedYear, selectedStatus, selectedCategory, searchQuery]);

  // Derived dynamic calculations
  const stats = useMemo(() => calculateDashboardStats(filteredExaminations), [filteredExaminations]);
  const upcomingDeadlines = useMemo(() => getUpcomingDeadlines(filteredExaminations), [filteredExaminations]);
  const upcomingExamDates = useMemo(() => getUpcomingExamDates(filteredExaminations), [filteredExaminations]);

  return (
    <ExaminationContext.Provider
      value={{
        examinations,
        activities,
        addExamination,
        updateExamination,
        deleteExamination,
        toggleExamCompletion,
        resetToSampleExaminations,
        categories,
        addCategory,
        removeCategory,
        resetCategories,
        selectedYear,
        setSelectedYear,
        selectedStatus,
        setSelectedStatus,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        filteredExaminations,
        stats,
        upcomingDeadlines,
        upcomingExamDates,
        isQuickAddOpen,
        setIsQuickAddOpen,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
      }}
    >
      {children}
    </ExaminationContext.Provider>
  );
}

export function useExaminations() {
  const context = useContext(ExaminationContext);
  if (!context) {
    throw new Error("useExaminations must be used within an ExaminationProvider");
  }
  return context;
}
