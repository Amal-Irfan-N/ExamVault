import React from "react";
import { Badge } from "@/components/ui/badge";
import { ExamStatus, DateCertainty } from "@/types/examination";
import { CheckCircle2, Clock, AlertTriangle, FileText, Award, XCircle, Archive, HelpCircle } from "lucide-react";

interface StatusBadgeProps {
  status: ExamStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  switch (status) {
    case "interested":
      return (
        <Badge variant="purple" className={className}>
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mr-1.5" />
          Interested
        </Badge>
      );
    case "notification_released":
      return (
        <Badge variant="info" className={className}>
          <FileText className="w-3 h-3 mr-1" />
          Notification Released
        </Badge>
      );
    case "application_not_started":
      return (
        <Badge variant="warning" className={className}>
          <Clock className="w-3 h-3 mr-1" />
          App Not Started
        </Badge>
      );
    case "application_in_progress":
      return (
        <Badge variant="warning" className={className}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-1.5 animate-pulse" />
          App In Progress
        </Badge>
      );
    case "payment_pending":
      return (
        <Badge variant="destructive" className={className}>
          <AlertTriangle className="w-3 h-3 mr-1" />
          Payment Pending
        </Badge>
      );
    case "application_submitted":
      return (
        <Badge variant="success" className={className}>
          <CheckCircle2 className="w-3 h-3 mr-1" />
          App Submitted
        </Badge>
      );
    case "application_rejected":
      return (
        <Badge variant="destructive" className={className}>
          <XCircle className="w-3 h-3 mr-1" />
          App Rejected
        </Badge>
      );
    case "examination_scheduled":
      return (
        <Badge variant="info" className={className}>
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mr-1.5" />
          Exam Scheduled
        </Badge>
      );
    case "hall_ticket_available":
      return (
        <Badge variant="success" className={className}>
          <Award className="w-3 h-3 mr-1" />
          Hall Ticket Available
        </Badge>
      );
    case "examination_completed":
      return (
        <Badge variant="secondary" className={className}>
          <CheckCircle2 className="w-3 h-3 mr-1 text-slate-400" />
          Exam Completed
        </Badge>
      );
    case "answer_key_pending":
      return (
        <Badge variant="warning" className={className}>
          <Clock className="w-3 h-3 mr-1" />
          Answer Key Pending
        </Badge>
      );
    case "answer_key_published":
      return (
        <Badge variant="info" className={className}>
          <FileText className="w-3 h-3 mr-1" />
          Answer Key Published
        </Badge>
      );
    case "result_pending":
      return (
        <Badge variant="warning" className={className}>
          <Clock className="w-3 h-3 mr-1" />
          Result Pending
        </Badge>
      );
    case "result_published":
      return (
        <Badge variant="default" className={className}>
          <Award className="w-3 h-3 mr-1 text-indigo-400" />
          Result Published
        </Badge>
      );
    case "qualified":
      return (
        <Badge variant="success" className={className}>
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Qualified
        </Badge>
      );
    case "not_qualified":
      return (
        <Badge variant="destructive" className={className}>
          <XCircle className="w-3 h-3 mr-1" />
          Not Qualified
        </Badge>
      );
    case "selected":
      return (
        <Badge variant="success" className={className}>
          <Award className="w-3 h-3 mr-1" />
          Selected 🎉
        </Badge>
      );
    case "not_selected":
      return (
        <Badge variant="destructive" className={className}>
          <XCircle className="w-3 h-3 mr-1" />
          Not Selected
        </Badge>
      );
    case "archived":
      return (
        <Badge variant="secondary" className={className}>
          <Archive className="w-3 h-3 mr-1" />
          Archived
        </Badge>
      );
    default:
      return (
        <Badge variant="secondary" className={className}>
          {status}
        </Badge>
      );
  }
}

interface CertaintyBadgeProps {
  certainty: DateCertainty;
  className?: string;
}

export function CertaintyBadge({ certainty, className }: CertaintyBadgeProps) {
  if (certainty === "confirmed") {
    return (
      <span className={`inline-flex items-center text-[10px] font-medium text-emerald-400 ${className}`}>
        <span className="w-1 h-1 rounded-full bg-emerald-400 mr-1" />
        Confirmed
      </span>
    );
  }
  if (certainty === "tentative") {
    return (
      <span className={`inline-flex items-center text-[10px] font-medium text-amber-400/90 ${className}`}>
        <span className="w-1 h-1 rounded-full bg-amber-400 mr-1" />
        Tentative
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center text-[10px] font-medium text-slate-500 ${className}`}>
      <HelpCircle className="w-2.5 h-2.5 mr-1" />
      Unannounced
    </span>
  );
}
