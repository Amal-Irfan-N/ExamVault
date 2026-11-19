"use client";

import React from "react";
import {
  Bell,
  FileCheck2,
  Ticket,
  Calendar,
  KeyRound,
  Award,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Examination, ExamStatus, DateCertainty } from "@/types/examination";
import { CertaintyBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

interface ExaminationLifecycleTimelineProps {
  exam: Examination;
  onUpdateStatus?: (examId: string, newStatus: ExamStatus) => void;
  className?: string;
}

interface TimelineStage {
  id: string;
  stepNumber: number;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  statuses: ExamStatus[];
  isCurrent: boolean;
  isCompleted: boolean;
  isFailed?: boolean;
  isSuccess?: boolean;
  dateInfo?: {
    label: string;
    date?: string | null;
    certainty?: DateCertainty;
  };
  details: {
    label: string;
    value: string | React.ReactNode;
  }[];
  actionLink?: {
    label: string;
    url: string;
  };
  quickAdvanceStatus?: ExamStatus;
  quickAdvanceLabel?: string;
}

export function ExaminationLifecycleTimeline({
  exam,
  onUpdateStatus,
  className = "",
}: ExaminationLifecycleTimelineProps) {
  // Ordered lifecycle stages list to evaluate progression
  const statusRankMap: Record<ExamStatus, number> = {
    interested: 1,
    notification_released: 1,
    application_not_started: 2,
    application_in_progress: 2,
    payment_pending: 2,
    application_submitted: 3,
    application_rejected: 2,
    examination_scheduled: 3,
    hall_ticket_available: 3,
    examination_completed: 4,
    answer_key_pending: 5,
    answer_key_published: 5,
    result_pending: 6,
    result_published: 6,
    qualified: 6,
    not_qualified: 6,
    selected: 6,
    not_selected: 6,
    archived: 7,
  };

  const currentRank = statusRankMap[exam.status] || 1;
  const isRejected = exam.status === "application_rejected";
  const isSelected = exam.status === "selected";
  const isNotSelected = exam.status === "not_selected" || exam.status === "not_qualified";

  // Build the 6 concrete milestone stages
  const stages: TimelineStage[] = [
    {
      id: "notification",
      stepNumber: 1,
      title: "1. Official Notification",
      subtitle: "Recruitment announcement & eligibility release",
      icon: Bell,
      statuses: ["interested", "notification_released"],
      isCurrent: currentRank === 1,
      isCompleted: currentRank > 1,
      details: [
        {
          label: "Recruiting Body",
          value: `${exam.recruitingOrg} (${exam.category})`,
        },
        {
          label: "Notice / Ad No.",
          value: exam.advertisementNumber || "Awaiting notification",
        },
        {
          label: "Target Post",
          value: exam.postName,
        },
      ],
      actionLink: exam.officialNotificationUrl
        ? { label: "View Official Notification", url: exam.officialNotificationUrl }
        : undefined,
      quickAdvanceStatus: "application_in_progress",
      quickAdvanceLabel: "Start Application",
    },
    {
      id: "application",
      stepNumber: 2,
      title: "2. Application & Fee",
      subtitle: "Online registration & fee settlement",
      icon: FileCheck2,
      statuses: [
        "application_not_started",
        "application_in_progress",
        "payment_pending",
        "application_submitted",
        "application_rejected",
      ],
      isCurrent: currentRank === 2,
      isCompleted: currentRank > 2,
      isFailed: isRejected,
      dateInfo: exam.applicationClosingDate
        ? {
            label: "Closing Deadline",
            date: exam.applicationClosingDate.date,
            certainty: exam.applicationClosingDate.certainty,
          }
        : undefined,
      details: [
        {
          label: "Registration / OTR ID",
          value: (
            <span className="font-mono text-slate-200">
              {exam.registrationNumber || "Not recorded yet"}
            </span>
          ),
        },
        {
          label: "Fee Payment",
          value: (
            <span
              className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${
                exam.paymentStatus === "completed"
                  ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                  : exam.paymentStatus === "exempted"
                  ? "bg-blue-500/15 text-blue-300 border border-blue-500/30"
                  : exam.paymentStatus === "failed"
                  ? "bg-red-500/15 text-red-300 border border-red-500/30"
                  : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
              }`}
            >
              {exam.paymentStatus || "pending"} (₹{exam.applicationFee ?? 0})
            </span>
          ),
        },
      ],
      actionLink: exam.officialApplicationUrl
        ? { label: "Application Portal", url: exam.officialApplicationUrl }
        : undefined,
      quickAdvanceStatus: "application_submitted",
      quickAdvanceLabel: "Mark Submitted",
    },
    {
      id: "admit_card",
      stepNumber: 3,
      title: "3. City & Hall Ticket",
      subtitle: "Venue allotment & admit card download",
      icon: Ticket,
      statuses: ["examination_scheduled", "hall_ticket_available"],
      isCurrent: currentRank === 3,
      isCompleted: currentRank > 3,
      dateInfo: exam.examDate
        ? {
            label: "Scheduled Exam Date",
            date: exam.examDate.date,
            certainty: exam.examDate.certainty,
          }
        : undefined,
      details: [
        {
          label: "Allotted City",
          value: exam.examCity || "Pending city intimation",
        },
        {
          label: "Exam Centre / Venue",
          value: exam.examCentre || "Pending admit card",
        },
        {
          label: "Shift / Session",
          value: exam.examSession || "To be announced",
        },
      ],
      actionLink: exam.hallTicketDownloadUrl
        ? { label: "Download Admit Card", url: exam.hallTicketDownloadUrl }
        : undefined,
      quickAdvanceStatus: "hall_ticket_available",
      quickAdvanceLabel: "Admit Card Released",
    },
    {
      id: "examination_day",
      stepNumber: 4,
      title: "4. Examination Day",
      subtitle: "Computer-based test / Written paper",
      icon: Calendar,
      statuses: ["examination_completed"],
      isCurrent: currentRank === 4,
      isCompleted: currentRank > 4,
      dateInfo: exam.examDate
        ? {
            label: "Test Date",
            date: exam.examDate.date,
            certainty: exam.examDate.certainty,
          }
        : undefined,
      details: [
        {
          label: "Session Timing",
          value: exam.examSession || "Report 1 hour prior to exam time",
        },
        {
          label: "Exam Status",
          value:
            currentRank >= 4 ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Exam Attempted
              </span>
            ) : (
              <span className="text-slate-400">Scheduled / Pending</span>
            ),
        },
      ],
      quickAdvanceStatus: "examination_completed",
      quickAdvanceLabel: "Mark Exam Completed",
    },
    {
      id: "answer_key",
      stepNumber: 5,
      title: "5. Answer Key & Objections",
      subtitle: "Provisional key & candidate response sheet",
      icon: KeyRound,
      statuses: ["answer_key_pending", "answer_key_published"],
      isCurrent: currentRank === 5,
      isCompleted: currentRank > 5,
      dateInfo: exam.answerKeyReleaseDate
        ? {
            label: "Answer Key Date",
            date: exam.answerKeyReleaseDate.date,
            certainty: exam.answerKeyReleaseDate.certainty,
          }
        : undefined,
      details: [
        {
          label: "Key Publication",
          value:
            exam.status === "answer_key_published" || currentRank > 5 ? (
              <span className="text-emerald-400 font-semibold">Published & Verified</span>
            ) : (
              <span className="text-slate-400">Pending release</span>
            ),
        },
      ],
      quickAdvanceStatus: "answer_key_published",
      quickAdvanceLabel: "Key Published",
    },
    {
      id: "results",
      stepNumber: 6,
      title: "6. Results & Selection",
      subtitle: "Merit list, scorecard & final appointment",
      icon: Award,
      statuses: [
        "result_pending",
        "result_published",
        "qualified",
        "not_qualified",
        "selected",
        "not_selected",
      ],
      isCurrent: currentRank === 6,
      isCompleted: currentRank === 6 && (isSelected || isNotSelected || exam.status === "qualified"),
      isSuccess: isSelected || exam.status === "qualified",
      isFailed: isNotSelected,
      dateInfo: exam.resultPublicationDate
        ? {
            label: "Result Date",
            date: exam.resultPublicationDate.date,
            certainty: exam.resultPublicationDate.certainty,
          }
        : undefined,
      details: [
        {
          label: "Selection Status",
          value: (
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold ${
                isSelected
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : exam.status === "qualified"
                  ? "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                  : isNotSelected
                  ? "bg-red-500/20 text-red-300 border border-red-500/40"
                  : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
              }`}
            >
              {isSelected ? (
                <>
                  <Sparkles className="w-3 h-3 text-amber-300" /> SELECTED
                </>
              ) : (
                exam.finalSelectionStatus?.toUpperCase() || "PENDING"
              )}
            </span>
          ),
        },
      ],
      quickAdvanceStatus: "selected",
      quickAdvanceLabel: "Mark as Selected 🎉",
    },
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Visual Timeline Header Summary */}
      <div className="p-4 rounded-xl bg-[#0e121a] border border-[#1e2536] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Examination Lifecycle Progress
          </span>
          <h4 className="text-sm font-bold text-white flex items-center gap-2 mt-0.5">
            Stage {currentRank} of 6:{" "}
            <span className="text-indigo-400">
              {stages.find((s) => s.isCurrent)?.title || "Lifecycle Active"}
            </span>
          </h4>
        </div>

        {/* Overall Completion Percentage Bar */}
        <div className="flex items-center gap-3 w-full sm:w-48">
          <div className="flex-1 h-2 bg-[#1b2234] rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                isSelected
                  ? "bg-gradient-to-r from-emerald-500 to-amber-400"
                  : isFailed(exam.status)
                  ? "bg-red-500"
                  : "bg-indigo-500"
              }`}
              style={{ width: `${Math.min(100, Math.round((currentRank / 6) * 100))}%` }}
            />
          </div>
          <span className="text-xs font-mono font-bold text-slate-300 min-w-[36px] text-right">
            {Math.round((currentRank / 6) * 100)}%
          </span>
        </div>
      </div>

      {/* Vertical Stepper Container */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#1e2536]">
        {stages.map((stage) => {
          const StageIcon = stage.icon;

          // Determine node styling
          let nodeClasses = "bg-[#121620] border-[#1e2536] text-slate-500";
          if (stage.isSuccess) {
            nodeClasses = "bg-emerald-500/20 border-emerald-500 text-emerald-400 ring-4 ring-emerald-500/10";
          } else if (stage.isFailed) {
            nodeClasses = "bg-red-500/20 border-red-500 text-red-400 ring-4 ring-red-500/10";
          } else if (stage.isCurrent) {
            nodeClasses = "bg-indigo-600 border-indigo-400 text-white ring-4 ring-indigo-500/20";
          } else if (stage.isCompleted) {
            nodeClasses = "bg-emerald-950/80 border-emerald-600 text-emerald-400";
          }

          return (
            <div key={stage.id} className="relative group">
              {/* Stepper Node Marker */}
              <div
                className={`absolute -left-6 sm:-left-8 top-1 flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full border transition-all ${nodeClasses}`}
              >
                {stage.isCompleted && !stage.isFailed ? (
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                ) : stage.isFailed ? (
                  <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400" />
                ) : (
                  <StageIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                )}
              </div>

              {/* Stage Card Content */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  stage.isCurrent
                    ? "bg-[#121620] border-indigo-500/40 shadow-lg shadow-indigo-950/20"
                    : stage.isCompleted
                    ? "bg-[#0e121a] border-[#1e2536]"
                    : "bg-[#0b0e14]/60 border-[#1a2133] opacity-80"
                }`}
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-[#1a2133]">
                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="text-sm font-bold text-white tracking-tight">
                        {stage.title}
                      </h5>
                      {stage.isCurrent && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          Active Stage
                        </span>
                      )}
                      {stage.isCompleted && !stage.isFailed && (
                        <span className="text-[10px] text-emerald-400 font-semibold">
                          Completed ✓
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{stage.subtitle}</p>
                  </div>

                  {/* Stage Date & Certainty Badge */}
                  {stage.dateInfo?.date && (
                    <div className="flex items-center gap-1.5 self-start sm:self-auto bg-[#0b0e14] px-2.5 py-1 rounded-lg border border-[#1e2536]">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span className="text-xs text-slate-300 font-medium">
                        {formatDate(stage.dateInfo.date)}
                      </span>
                      {stage.dateInfo.certainty && (
                        <CertaintyBadge certainty={stage.dateInfo.certainty} />
                      )}
                    </div>
                  )}
                </div>

                {/* Milestone Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 py-3 text-xs">
                  {stage.details.map((detail, idx) => (
                    <div key={idx}>
                      <span className="text-[11px] text-slate-500 block mb-0.5">
                        {detail.label}
                      </span>
                      <div className="text-slate-300 font-medium">{detail.value}</div>
                    </div>
                  ))}
                </div>

                {/* Action Link & Quick Status Transition */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-[#1a2133]">
                  {stage.actionLink ? (
                    <a
                      href={stage.actionLink.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                    >
                      {stage.actionLink.label}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-[11px] text-slate-600">
                      Step {stage.stepNumber} of 6
                    </span>
                  )}

                  {onUpdateStatus && stage.quickAdvanceStatus && !stage.isCompleted && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onUpdateStatus(exam.id, stage.quickAdvanceStatus!)}
                      className="text-xs h-7 px-2.5 gap-1 border-indigo-500/30 text-indigo-300 hover:text-white hover:bg-indigo-600 cursor-pointer"
                    >
                      <span>{stage.quickAdvanceLabel || "Set Status"}</span>
                      <ChevronRight className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function isFailed(status: ExamStatus): boolean {
  return (
    status === "application_rejected" ||
    status === "not_qualified" ||
    status === "not_selected"
  );
}
