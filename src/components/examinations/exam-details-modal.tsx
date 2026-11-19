"use client";

import React, { useState } from "react";
import { Examination, ExamStatus, isExamCompleted } from "@/types/examination";
import { StatusBadge, CertaintyBadge } from "@/components/ui/status-badge";
import { formatDate } from "@/lib/utils";
import {
  X,
  Edit,
  Trash2,
  ExternalLink,
  Building2,
  Hash,
  MapPin,
  Award,
  Layers,
  Milestone,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExaminationLifecycleTimeline } from "./examination-lifecycle-timeline";

interface ExamDetailsModalProps {
  isOpen: boolean;
  exam: Examination | null;
  onEdit: (exam: Examination) => void;
  onDelete: (exam: Examination) => void;
  onToggleArchive?: (exam: Examination) => void;
  onToggleCompletion?: (exam: Examination) => void;
  onUpdateStatus: (examId: string, newStatus: ExamStatus) => void;
  onClose: () => void;
}

export function ExamDetailsModal({
  isOpen,
  exam,
  onEdit,
  onDelete,
  onToggleArchive,
  onToggleCompletion,
  onUpdateStatus,
  onClose,
}: ExamDetailsModalProps) {
  const [activeModalTab, setActiveModalTab] = useState<"overview" | "timeline">("overview");

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
              {isExamCompleted(exam) ? (
                <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px]">
                  Completed
                </Badge>
              ) : (
                <Badge className="bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 text-[10px]">
                  Active
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
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1a2133] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-header Navigation Tabs */}
        <div className="flex items-center gap-1 px-5 pt-3 border-b border-[#1e2536] bg-[#0f131c]">
          <button
            onClick={() => setActiveModalTab("overview")}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeModalTab === "overview"
                ? "border-indigo-500 text-white"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Full Details Overview
          </button>

          <button
            onClick={() => setActiveModalTab("timeline")}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeModalTab === "timeline"
                ? "border-indigo-500 text-white"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Milestone className="w-3.5 h-3.5 text-indigo-400" />
            Visual Lifecycle Timeline
            <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.2 rounded-full font-mono">
              6 Steps
            </span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {activeModalTab === "timeline" ? (
            <ExaminationLifecycleTimeline
              exam={exam}
              onUpdateStatus={onUpdateStatus}
            />
          ) : (
            <>
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

              {/* Section B: Application Credentials & Fee */}
              <div className="p-4 rounded-xl bg-[#121620] border border-[#1e2536] space-y-2.5">
                <span className="font-semibold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-blue-400" />
                  B. Registration IDs & Application Deadlines
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Registration / OTR ID</span>
                    <span className="font-mono font-medium text-slate-200">
                      {exam.registrationNumber || "Not recorded yet"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Application Number</span>
                    <span className="font-mono font-medium text-slate-200">
                      {exam.applicationNumber || "Not recorded yet"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300 pt-2 border-t border-[#1a2133]">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Application Deadline:</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-slate-200 font-medium">
                        {formatDate(exam.applicationClosingDate?.date)}
                      </span>
                      {exam.applicationClosingDate?.certainty && (
                        <CertaintyBadge certainty={exam.applicationClosingDate.certainty} />
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[11px]">Fee Payment Status:</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="capitalize text-slate-200 font-medium">
                        {exam.paymentStatus || "pending"}
                      </span>
                      {exam.applicationFee !== undefined && (
                        <span className="text-[11px] text-slate-400">
                          (₹{exam.applicationFee})
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section C: Exam Schedule & Venue */}
              <div className="p-4 rounded-xl bg-[#121620] border border-[#1e2536] space-y-2.5">
                <span className="font-semibold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  C. Examination Schedule & Allotted Venue
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Examination Date:</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-slate-200 font-medium">
                        {formatDate(exam.examDate?.date)}
                      </span>
                      {exam.examDate?.certainty && (
                        <CertaintyBadge certainty={exam.examDate.certainty} />
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[11px]">Assigned City:</span>
                    <span className="text-slate-200 font-medium">
                      {exam.examCity || "Pending city intimation"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300 pt-2 border-t border-[#1a2133]">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Examination Centre:</span>
                    <span className="text-slate-200 font-medium">
                      {exam.examCentre || "Pending admit card"}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[11px]">Shift / Session:</span>
                    <span className="text-slate-200 font-medium">
                      {exam.examSession || "To be announced"}
                    </span>
                  </div>
                </div>

                {exam.hallTicketDownloadUrl && (
                  <div className="pt-2 border-t border-[#1a2133] flex items-center justify-between">
                    <span className="text-slate-400">Hall Ticket / Admit Card:</span>
                    <a
                      href={exam.hallTicketDownloadUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
                    >
                      Download Admit Card <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>

              {/* Section D: Post-Exam Information */}
              <div className="p-4 rounded-xl bg-[#121620] border border-[#1e2536] space-y-2.5">
                <span className="font-semibold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  D. Post-Examination Outcomes
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Answer Key Release:</span>
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
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#1e2536] bg-[#101420] flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => (onToggleCompletion ? onToggleCompletion(exam) : onToggleArchive?.(exam))}
              className="text-xs h-8 px-3 gap-1.5 cursor-pointer"
            >
              {isExamCompleted(exam) ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                  Mark as Active
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Mark as Completed
                </>
              )}
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
