"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AppLayout } from "@/components/layout/app-layout";
import { useExaminations } from "@/context/ExaminationContext";
import { Examination, ExamStatus } from "@/types/examination";
import { StatusBadge, CertaintyBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import {
  GraduationCap,
  Plus,
  Search,
  Calendar,
  ExternalLink,
  Hash,
  RotateCcw,
  Edit,
  Trash2,
  Archive,
  Eye,
} from "lucide-react";
import { ExamDetailsModal } from "@/components/examinations/exam-details-modal";
import { EditExamModal } from "@/components/examinations/edit-exam-modal";
import { DeleteConfirmModal } from "@/components/examinations/delete-confirm-modal";

function ExaminationsContent() {
  const searchParams = useSearchParams();
  const examIdParam = searchParams.get("id");

  const {
    examinations,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    setIsQuickAddOpen,
    updateExamination,
    deleteExamination,
  } = useExaminations();

  const [activeTab, setActiveTab] = useState<"active" | "archived">("active");
  const [selectedExamForDetails, setSelectedExamForDetails] = useState<Examination | null>(null);
  const [selectedExamForEdit, setSelectedExamForEdit] = useState<Examination | null>(null);
  const [selectedExamForDelete, setSelectedExamForDelete] = useState<Examination | null>(null);
  const [isDetailsDismissed, setIsDetailsDismissed] = useState(false);

  // Auto-open modal if ?id= is in query string and user has not dismissed it
  const activeExamForDetails = useMemo(() => {
    if (selectedExamForDetails) return selectedExamForDetails;
    if (!isDetailsDismissed && examIdParam) {
      return examinations.find((e) => e.id === examIdParam) || null;
    }
    return null;
  }, [selectedExamForDetails, isDetailsDismissed, examIdParam, examinations]);

  const categories = ["all", "UPSC", "SSC", "ISRO", "GATE", "RRB", "DRDO", "State PSC", "Banking"];

  // Filter examinations based on tab (active vs archived), category, and search query
  const displayedExams = useMemo(() => {
    return examinations.filter((exam) => {
      // Tab filter
      if (activeTab === "active" && exam.isArchived) return false;
      if (activeTab === "archived" && !exam.isArchived) return false;

      // Category filter
      if (selectedCategory !== "all" && exam.category !== selectedCategory) {
        return false;
      }

      // Search filter
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
  }, [examinations, activeTab, selectedCategory, searchQuery]);

  const activeCount = examinations.filter((e) => !e.isArchived).length;
  const archivedCount = examinations.filter((e) => e.isArchived).length;

  const handleToggleArchive = (exam: Examination) => {
    updateExamination(exam.id, { isArchived: !exam.isArchived });
    if (selectedExamForDetails?.id === exam.id) {
      setSelectedExamForDetails({ ...exam, isArchived: !exam.isArchived });
    }
  };

  const handleUpdateStatus = (examId: string, newStatus: ExamStatus) => {
    updateExamination(examId, { status: newStatus });
    if (selectedExamForDetails?.id === examId) {
      setSelectedExamForDetails((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleDeleteConfirm = () => {
    if (selectedExamForDelete) {
      deleteExamination(selectedExamForDelete.id);
      setSelectedExamForDelete(null);
      if (selectedExamForDetails?.id === selectedExamForDelete.id) {
        setSelectedExamForDetails(null);
      }
    }
  };

  return (
    <AppLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              My Examinations
            </h1>
            <Badge variant="outline" className="text-slate-400 border-[#232a3e]">
              {displayedExams.length} Records
            </Badge>
          </div>
          <p className="text-xs md:text-sm text-slate-400">
            Track and manage your applications, test dates, registration credentials, and results.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setIsQuickAddOpen(true)}
          className="gap-2 bg-indigo-600 hover:bg-indigo-500 font-semibold shadow-sm w-fit cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Examination
        </Button>
      </div>

      {/* Tab Switcher: Active vs Archived */}
      <div className="flex items-center gap-2 border-b border-[#1e2536] text-xs">
        <button
          onClick={() => setActiveTab("active")}
          className={`pb-2.5 px-3 font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === "active"
              ? "border-indigo-500 text-white"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <span>Active Examinations</span>
          <span className="text-[10px] bg-[#1a2133] px-1.5 py-0.2 rounded-full text-slate-300">
            {activeCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("archived")}
          className={`pb-2.5 px-3 font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === "archived"
              ? "border-indigo-500 text-white"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <span>Archived Records</span>
          <span className="text-[10px] bg-[#1a2133] px-1.5 py-0.2 rounded-full text-slate-300">
            {archivedCount}
          </span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-[#121620] border border-[#1e2536] space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative w-full md:flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <Input
              type="text"
              placeholder="Search by exam name, post, registration number or organization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-[#0d1017] border-[#20283c] text-xs"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-indigo-600 text-white"
                    : "bg-[#0d1017] text-slate-400 hover:text-white border border-[#1e2536]"
                }`}
              >
                {cat === "all" ? "All Categories" : cat}
              </button>
            ))}

            {(searchQuery || selectedCategory !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-amber-300 bg-[#0d1017] border border-[#1e2536] text-xs transition-colors"
                title="Reset filters"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Examinations List View */}
      <div className="space-y-3">
        {displayedExams.length === 0 ? (
          <div className="p-12 text-center rounded-xl bg-[#121620] border border-[#1e2536]">
            <GraduationCap className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-300">
              {activeTab === "active" ? "No active examinations found" : "No archived records"}
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              {activeTab === "active"
                ? "Add a new examination to your vault or adjust your search filter."
                : "Completed examinations you archive will appear here for historical reference."}
            </p>
            {activeTab === "active" && (
              <Button
                size="sm"
                onClick={() => setIsQuickAddOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-500 gap-1.5 text-xs font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Examination Now
              </Button>
            )}
          </div>
        ) : (
          displayedExams.map((exam) => (
            <Card
              key={exam.id}
              className="bg-[#121620] border-[#1e2536] hover:border-indigo-500/40 hover:bg-[#131825] transition-all"
            >
              <CardContent className="p-4 md:p-5">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left Column: Core details */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-white bg-indigo-500/15 border border-indigo-500/30 px-2 py-0.5 rounded">
                        {exam.recruitingOrg}
                      </span>
                      <Badge variant="outline" className="text-slate-400 border-[#252f47] text-[11px]">
                        {exam.category}
                      </Badge>
                      <span className="text-xs text-slate-500">Year {exam.recruitmentYear}</span>
                      <StatusBadge status={exam.status} />
                      {exam.isArchived && (
                        <Badge variant="secondary" className="text-[10px]">
                          Archived
                        </Badge>
                      )}
                    </div>

                    <Link
                      href={`/examinations/${exam.id}`}
                      className="group/title inline-block"
                    >
                      <h3 className="text-base font-bold text-white tracking-tight group-hover/title:text-indigo-400 transition-colors">
                        {exam.examName}
                      </h3>
                    </Link>

                    <p className="text-xs text-slate-300 font-medium">
                      Post: {exam.postName}
                    </p>

                    {exam.personalNotes && (
                      <p className="text-xs text-slate-400 italic line-clamp-1 bg-[#0b0e14]/50 p-1.5 rounded border border-[#1a2133] mt-1">
                        Note: {exam.personalNotes}
                      </p>
                    )}
                  </div>

                  {/* Middle Column: Key Dates & Identifiers */}
                  <div className="flex flex-wrap lg:flex-col items-start gap-2 text-xs text-slate-400 lg:border-l lg:border-[#1e2536] lg:pl-6 min-w-[200px]">
                    {exam.registrationNumber && (
                      <div className="flex items-center gap-1.5 font-mono text-slate-200">
                        <Hash className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-[11px] text-slate-400">Reg:</span>
                        <span>{exam.registrationNumber}</span>
                      </div>
                    )}

                    {exam.examDate?.date && (
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="text-slate-200 font-medium">
                          {formatDate(exam.examDate.date)}
                        </span>
                        <CertaintyBadge certainty={exam.examDate.certainty} />
                      </div>
                    )}

                    {exam.applicationClosingDate?.date && (
                      <div className="text-[11px] text-amber-400">
                        Deadline: {formatDate(exam.applicationClosingDate.date)}
                      </div>
                    )}
                  </div>

                  {/* Right Column: Actions */}
                  <div className="flex flex-wrap items-center gap-2 lg:flex-col lg:items-end flex-shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#1a2133]">
                    <div className="flex items-center gap-1.5">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setIsDetailsDismissed(false);
                          setSelectedExamForDetails(exam);
                        }}
                        className="text-xs h-8 px-2.5 gap-1 text-slate-200 hover:text-white cursor-pointer"
                        title="View Full Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Details
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedExamForEdit(exam)}
                        className="text-xs h-8 px-2.5 gap-1 text-indigo-400 hover:text-indigo-300"
                        title="Edit Details"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        Edit
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleToggleArchive(exam)}
                        className="text-xs h-8 px-2 text-slate-400 hover:text-white"
                        title={exam.isArchived ? "Unarchive" : "Archive"}
                      >
                        <Archive className="w-3.5 h-3.5" />
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedExamForDelete(exam)}
                        className="text-xs h-8 px-2 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>

                    {exam.officialApplicationUrl && (
                      <a
                        href={exam.officialApplicationUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium mt-1"
                      >
                        Official Portal <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Examination Details Modal */}
      <ExamDetailsModal
        isOpen={Boolean(activeExamForDetails)}
        exam={activeExamForDetails}
        onEdit={(exam) => {
          setSelectedExamForDetails(null);
          setIsDetailsDismissed(true);
          setSelectedExamForEdit(exam);
        }}
        onDelete={(exam) => {
          setSelectedExamForDetails(null);
          setIsDetailsDismissed(true);
          setSelectedExamForDelete(exam);
        }}
        onToggleArchive={handleToggleArchive}
        onUpdateStatus={handleUpdateStatus}
        onClose={() => {
          setSelectedExamForDetails(null);
          setIsDetailsDismissed(true);
        }}
      />

      {/* Edit Examination Modal */}
      <EditExamModal
        isOpen={Boolean(selectedExamForEdit)}
        exam={selectedExamForEdit}
        onSave={(id, updates) => {
          updateExamination(id, updates);
          setSelectedExamForEdit(null);
        }}
        onClose={() => setSelectedExamForEdit(null)}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(selectedExamForDelete)}
        examName={selectedExamForDelete?.examName || ""}
        onConfirm={handleDeleteConfirm}
        onClose={() => setSelectedExamForDelete(null)}
      />
    </AppLayout>
  );
}

export default function ExaminationsPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#0b0d13] flex items-center justify-center text-slate-500 text-sm">
          Loading examinations...
        </div>
      }
    >
      <ExaminationsContent />
    </React.Suspense>
  );
}
