"use client";

import React from "react";
import { Examination, ExamStatus } from "@/types/examination";
import { StatusBadge, CertaintyBadge } from "@/components/ui/status-badge";
import { formatDate } from "@/lib/utils";
import {
  X,
  Edit,
  Trash2,
  Archive,
  ExternalLink,
  Calendar,
  Building2,
  Hash,
  MapPin,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ExamDetailsModalProps {
  isOpen: boolean;
  exam: Examination | null;
  onEdit: (exam: Examination) => void;
  onDelete: (exam: Examination) => void;
  onToggleArchive: (exam: Examination) => void;
  onUpdateStatus: (examId: string, newStatus: ExamStatus) => void;
  onClose: () => void;
}

export function ExamDetailsModal({
  isOpen,
  exam,
  onEdit,
  onDelete,
  onToggleArchive,
  onUpdateStatus,
  onClose,
}: ExamDetailsModalProps) {
  if (!isOpen || !exam) return null;

  const nextStatusOptions: { status: ExamStatus; label: string }[] = [
    { status: "application_in_progress", label: "App In Progress" },
    { status: "application_submitted", label: "App Submitted" },
    { status: "examination_scheduled", label: "Exam Scheduled" },
    { status: "hall_ticket_available", label: "Admit Card Out" },
    { status: "examination_completed", label: "Exam Completed" },
    { status: "result_published", label: "Result Declared" },
    { status: "qualified", label: "Qualified 🎉" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-[#0d1017] border border-[#232a3e] rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col my-8 max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-[#1e2536] bg-[#121622]">
          <div className="space-y-1.5 flex-1 min-w-0 pr-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-white bg-indigo-500/15 border border-indigo-500/30 px-2.5 py-0.5 rounded">
                {exam.recruitingOrg}
              </span>
              <Badge variant="outline" className="text-slate-400 border-[#242f47] text-[11px]">
                {exam.category}
              </Badge>
              <span className="text-xs text-slate-500">Year {exam.recruitmentYear}</span>
              <StatusBadge status={exam.status} />
              {exam.isArchived && (
                <Badge variant="secondary" className="text-[10px]">
                  Archived Record
                </Badge>
              )}
            </div>

            <h2 className="text-lg font-bold text-white tracking-tight">
              {exam.examName}
            </h2>
            <p className="text-xs text-slate-300 font-medium">
              Target Post: {exam.postName}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1a2133] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* Quick Lifecycle Status Stepper */}
          <div className="p-3.5 rounded-xl bg-[#121620] border border-[#1e2536] space-y-2">
            <span className="font-semibold text-white block text-[11px] uppercase tracking-wider">
              Quick Status Transition
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {nextStatusOptions.map((opt) => (
                <button
                  key={opt.status}
                  onClick={() => onUpdateStatus(exam.id, opt.status)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                    exam.status === opt.status
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-[#0b0e14] text-slate-400 hover:text-white border border-[#1e2536]"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section A: Basic Info */}
          <div className="p-4 rounded-xl bg-[#121620] border border-[#1e2536] space-y-2.5">
            <span className="font-semibold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-indigo-400" />
              A. Basic Recruitment Details
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
              <div>
                <span className="text-slate-500 block text-[11px]">Notice / Ad Number</span>
                <span className="font-mono font-medium text-slate-200">
                  {exam.advertisementNumber || "Not specified"}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Recruitment Year</span>
                <span className="font-medium text-slate-200">{exam.recruitmentYear}</span>
              </div>
            </div>

            {exam.officialApplicationUrl && (
              <div className="pt-2 border-t border-[#1a2133] flex items-center justify-between">
                <span className="text-slate-400">Official Application Portal:</span>
                <a
                  href={exam.officialApplicationUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                >
                  Open Portal <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            {exam.personalNotes && (
              <div className="pt-2 border-t border-[#1a2133]">
                <span className="text-slate-500 block text-[11px] mb-1">Personal Preparation Notes:</span>
                <p className="text-slate-300 bg-[#0b0e14] p-2.5 rounded-lg border border-[#182030] leading-relaxed">
                  {exam.personalNotes}
                </p>
              </div>
            )}
          </div>

          {/* Section B: Application Details & Fee */}
          <div className="p-4 rounded-xl bg-[#121620] border border-[#1e2536] space-y-2.5">
            <span className="font-semibold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-blue-400" />
              B. Registration IDs, Deadlines & Fee
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-2.5 rounded-lg bg-[#0e121a] border border-[#1b2233]">
                <span className="text-slate-500 block text-[11px] mb-0.5">Registration / OTR ID</span>
                <span className="font-mono text-slate-200 font-semibold">
                  {exam.registrationNumber || "Not assigned"}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-[#0e121a] border border-[#1b2233]">
                <span className="text-slate-500 block text-[11px] mb-0.5">Application Number</span>
                <span className="font-mono text-slate-200 font-semibold">
                  {exam.applicationNumber || "Draft / Pending"}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-[#0e121a] border border-[#1b2233]">
                <span className="text-slate-500 block text-[11px] mb-0.5">Payment Status</span>
                <span
                  className={`font-semibold capitalize ${
                    exam.paymentStatus === "completed"
                      ? "text-emerald-400"
                      : "text-amber-400"
                  }`}
                >
                  {exam.paymentStatus} {exam.applicationFee ? `(₹${exam.applicationFee})` : ""}
                </span>
              </div>
            </div>

            {exam.applicationClosingDate?.date && (
              <div className="pt-2 border-t border-[#1a2133] flex items-center justify-between">
                <span className="text-slate-400">Application Closing Deadline:</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-200">
                    {formatDate(exam.applicationClosingDate.date)}
                  </span>
                  <CertaintyBadge certainty={exam.applicationClosingDate.certainty} />
                </div>
              </div>
            )}
          </div>

          {/* Section C: Exam Schedule & Centre */}
          <div className="p-4 rounded-xl bg-[#121620] border border-[#1e2536] space-y-2.5">
            <span className="font-semibold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              C. Examination Schedule & Assigned Centre
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-2.5 rounded-lg bg-[#0e121a] border border-[#1b2233]">
                <span className="text-slate-500 block text-[11px] mb-0.5">Test Date</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">
                    {formatDate(exam.examDate?.date)}
                  </span>
                  {exam.examDate?.certainty && (
                    <CertaintyBadge certainty={exam.examDate.certainty} />
                  )}
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#0e121a] border border-[#1b2233]">
                <span className="text-slate-500 block text-[11px] mb-0.5">Assigned City</span>
                <span className="font-medium text-slate-200 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  {exam.examCity || "To be intimated"}
                </span>
              </div>
            </div>

            {exam.examCentre && (
              <div className="p-2.5 rounded-lg bg-[#0e121a] border border-[#1b2233]">
                <span className="text-slate-500 block text-[11px] mb-0.5">Test Centre / Venue</span>
                <span className="text-slate-200 font-medium">{exam.examCentre}</span>
              </div>
            )}

            {exam.examSession && (
              <div className="text-slate-400">
                <span>Session / Timings: </span>
                <strong className="text-slate-200">{exam.examSession}</strong>
              </div>
            )}
          </div>

          {/* Section D: Post-Exam & Selection */}
          <div className="p-4 rounded-xl bg-[#121620] border border-[#1e2536] space-y-2.5">
            <span className="font-semibold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              D. Post-Examination Milestones & Results
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-slate-500 block text-[11px]">Provisional Answer Key:</span>
                <span className="text-slate-200 font-medium">
                  {formatDate(exam.answerKeyReleaseDate?.date)}
                </span>
              </div>

              <div>
                <span className="text-slate-500 block text-[11px]">Result Publication:</span>
                <span className="text-slate-200 font-medium">
                  {formatDate(exam.resultPublicationDate?.date)}
                </span>
              </div>
            </div>

            {exam.finalSelectionStatus && exam.finalSelectionStatus !== "pending" && (
              <div className="pt-2 border-t border-[#1a2133] flex items-center justify-between">
                <span className="text-slate-400">Selection Outcome:</span>
                <Badge
                  variant={
                    exam.finalSelectionStatus === "qualified" || exam.finalSelectionStatus === "selected"
                      ? "success"
                      : "destructive"
                  }
                  className="capitalize font-semibold text-xs"
                >
                  {exam.finalSelectionStatus}
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#1e2536] bg-[#101420] flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onToggleArchive(exam)}
              className="text-xs h-8 px-3 gap-1.5 cursor-pointer"
            >
              <Archive className="w-3.5 h-3.5 text-slate-400" />
              {exam.isArchived ? "Unarchive" : "Archive"}
            </Button>

            <Button
              type="button"
              variant="destructive"
              onClick={() => onDelete(exam)}
              className="text-xs h-8 px-3 gap-1.5 text-red-400 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="text-xs h-8 px-3.5 cursor-pointer"
            >
              Close
            </Button>

            <Button
              type="button"
              onClick={() => onEdit(exam)}
              className="text-xs h-8 px-4 bg-indigo-600 hover:bg-indigo-500 font-semibold gap-1.5 cursor-pointer"
            >
              <Edit className="w-3.5 h-3.5" />
              Edit Examination
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
