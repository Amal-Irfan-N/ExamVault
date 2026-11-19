"use client";

import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import {
  Examination,
  ExamActivity,
  DashboardStats,
  UpcomingDeadlineItem,
  UpcomingExamDateItem,
} from "@/types/examination";
import {
  INITIAL_MOCK_EXAMINATIONS,
  MOCK_ACTIVITIES,
  calculateDashboardStats,
  getUpcomingDeadlines,
  getUpcomingExamDates,
} from "@/data/mockExaminations";

interface ExaminationContextType {
  examinations: Examination[];
  activities: ExamActivity[];
  addExamination: (exam: Omit<Examination, "id" | "userId" | "createdAt" | "updatedAt">) => Examination;
  updateExamination: (id: string, updates: Partial<Examination>) => void;
  deleteExamination: (id: string) => void;
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
          return JSON.parse(saved);
        } catch {
          return INITIAL_MOCK_EXAMINATIONS;
        }
      }
    }
    return INITIAL_MOCK_EXAMINATIONS;
  });

  const [activities, setActivities] = useState<ExamActivity[]>(MOCK_ACTIVITIES);
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isQuickAddOpen, setIsQuickAddOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);

  // Sync with client localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("examvault_exams", JSON.stringify(examinations));
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

  const addExamination = (newExamData: Omit<Examination, "id" | "userId" | "createdAt" | "updatedAt">): Examination => {
    const newExam: Examination = {
      ...newExamData,
      id: `exam-${Date.now()}`,
      userId: "user-demo-1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setExaminations((prev) => [newExam, ...prev]);

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
  };

  const deleteExamination = (id: string) => {
    setExaminations((prev) => prev.filter((exam) => exam.id !== id));
  };

  // Filtered examinations
  const filteredExaminations = useMemo(() => {
    return examinations.filter((exam) => {
      if (exam.isArchived) return false;

      // Year filter
      if (selectedYear !== "all" && exam.recruitmentYear.toString() !== selectedYear) {
        return false;
      }

      // Category filter
      if (selectedCategory !== "all" && exam.category !== selectedCategory) {
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
