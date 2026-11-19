"use client";

import React, { useState } from "react";
import { Examination, ExamCategory, ExamStatus, DateCertainty } from "@/types/examination";
import {
  X,
  Edit,
  GraduationCap,
  Calendar,
  Hash,
  CheckCircle2,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface EditExamModalProps {
  isOpen: boolean;
  exam: Examination | null;
  onSave: (id: string, updates: Partial<Examination>) => void;
  onClose: () => void;
}

const ORG_OPTIONS: { name: string; category: ExamCategory }[] = [
  { name: "UPSC", category: "UPSC" },
  { name: "SSC", category: "SSC" },
  { name: "ISRO", category: "ISRO" },
  { name: "DRDO", category: "DRDO" },
  { name: "GATE / IIT", category: "GATE" },
  { name: "RRB (Railways)", category: "RRB" },
  { name: "State PSC", category: "State PSC" },
  { name: "IBPS / Banking", category: "Banking" },
  { name: "Defence / CDS / NDA", category: "Defence" },
  { name: "PSU Recruitment", category: "PSU" },
  { name: "Other Organization", category: "Other" },
];

function EditExamFormContent({
  exam,
  onSave,
  onClose,
}: {
  exam: Examination;
  onSave: (id: string, updates: Partial<Examination>) => void;
  onClose: () => void;
}) {
  // A. Basic Info
  const [examName, setExamName] = useState(exam.examName || "");
  const [recruitingOrg, setRecruitingOrg] = useState(exam.recruitingOrg || "UPSC");
  const [category, setCategory] = useState<ExamCategory>(exam.category || "UPSC");
  const [postName, setPostName] = useState(exam.postName || "");
  const [advertisementNumber, setAdvertisementNumber] = useState(exam.advertisementNumber || "");
  const [recruitmentYear, setRecruitmentYear] = useState<number>(exam.recruitmentYear || 2026);
  const [officialNotificationUrl, setOfficialNotificationUrl] = useState(exam.officialNotificationUrl || "");
  const [officialApplicationUrl, setOfficialApplicationUrl] = useState(exam.officialApplicationUrl || "");
  const [personalNotes, setPersonalNotes] = useState(exam.personalNotes || "");

  // B. Application Info
  const [registrationNumber, setRegistrationNumber] = useState(exam.registrationNumber || "");
  const [applicationNumber, setApplicationNumber] = useState(exam.applicationNumber || "");
  const [appClosingDate, setAppClosingDate] = useState(exam.applicationClosingDate?.date || "");
  const [appClosingCertainty, setAppClosingCertainty] = useState<DateCertainty>(
    exam.applicationClosingDate?.certainty || "confirmed"
  );
  const [feePaymentDeadline, setFeePaymentDeadline] = useState(exam.feePaymentDeadline?.date || "");
  const [applicationFee, setApplicationFee] = useState<number>(exam.applicationFee ?? 100);
  const [paymentStatus, setPaymentStatus] = useState<Examination["paymentStatus"]>(
    exam.paymentStatus || "pending"
  );

  // C. Examination Info
  const [examDate, setExamDate] = useState(exam.examDate?.date || "");
  const [examDateCertainty, setExamDateCertainty] = useState<DateCertainty>(
    exam.examDate?.certainty || "tentative"
  );
  const [examSession, setExamSession] = useState(exam.examSession || "");
  const [examCity, setExamCity] = useState(exam.examCity || "");
  const [examCentre, setExamCentre] = useState(exam.examCentre || "");
  const [hallTicketUrl, setHallTicketUrl] = useState(exam.hallTicketDownloadUrl || "");

  // D. Post-Exam Info
  const [answerKeyDate, setAnswerKeyDate] = useState(exam.answerKeyReleaseDate?.date || "");
  const [resultDate, setResultDate] = useState(exam.resultPublicationDate?.date || "");
  const [selectionStatus, setSelectionStatus] = useState<Examination["finalSelectionStatus"]>(
    exam.finalSelectionStatus || "pending"
  );

  // Status & Archive
  const [status, setStatus] = useState<ExamStatus>(exam.status || "interested");
  const [isArchived, setIsArchived] = useState<boolean>(Boolean(exam.isArchived));
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examName.trim() || !postName.trim()) return;

    onSave(exam.id, {
      examName: examName.trim(),
      recruitingOrg: recruitingOrg.trim(),
      category,
      postName: postName.trim(),
      advertisementNumber: advertisementNumber.trim() || undefined,
      recruitmentYear: Number(recruitmentYear) || 2026,
      officialNotificationUrl: officialNotificationUrl.trim() || undefined,
      officialApplicationUrl: officialApplicationUrl.trim() || undefined,
      personalNotes: personalNotes.trim() || undefined,

      registrationNumber: registrationNumber.trim() || undefined,
      applicationNumber: applicationNumber.trim() || undefined,
      applicationClosingDate: appClosingDate
        ? { date: appClosingDate, certainty: appClosingCertainty }
        : undefined,
      feePaymentDeadline: feePaymentDeadline
        ? { date: feePaymentDeadline, certainty: "tentative" }
        : undefined,
      applicationFee: Number(applicationFee) || 0,
      paymentStatus,

      examDate: examDate
        ? { date: examDate, certainty: examDateCertainty }
        : undefined,
      examSession: examSession.trim() || undefined,
      examCity: examCity.trim() || undefined,
      examCentre: examCentre.trim() || undefined,
      hallTicketDownloadUrl: hallTicketUrl.trim() || undefined,

      answerKeyReleaseDate: answerKeyDate
        ? { date: answerKeyDate, certainty: "tentative" }
        : undefined,
      resultPublicationDate: resultDate
        ? { date: resultDate, certainty: "tentative" }
        : undefined,
      finalSelectionStatus: selectionStatus,

      status,
      isArchived,
    });

    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 600);
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
      {isSaved && (
        <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold">Examination updated successfully!</span>
        </div>
      )}

      {/* Section A: Basic Info */}
      <div className="space-y-3 p-4 rounded-xl bg-[#121620] border border-[#1e2536]">
        <span className="font-semibold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
          <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
          A. Basic Recruitment Details
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Examination Name *
            </label>
            <Input
              required
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
              className="bg-[#0b0e14] border-[#1e2536] text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Recruiting Organization *
            </label>
            <select
              value={recruitingOrg}
              onChange={(e) => {
                setRecruitingOrg(e.target.value);
                const match = ORG_OPTIONS.find((o) => o.name === e.target.value);
                if (match) setCategory(match.category);
              }}
              className="flex h-9 w-full rounded-lg border border-[#1e2536] bg-[#0b0e14] px-3 py-1 text-xs text-slate-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
            >
              {ORG_OPTIONS.map((o) => (
                <option key={o.name} value={o.name}>
                  {o.name} ({o.category})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-slate-300 font-medium mb-1">
              Post Name *
            </label>
            <Input
              required
              value={postName}
              onChange={(e) => setPostName(e.target.value)}
              className="bg-[#0b0e14] border-[#1e2536] text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Recruitment Year
            </label>
            <Input
              type="number"
              value={recruitmentYear}
              onChange={(e) => setRecruitmentYear(Number(e.target.value))}
              className="bg-[#0b0e14] border-[#1e2536] text-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Advertisement / Notice No.
            </label>
            <Input
              value={advertisementNumber}
              onChange={(e) => setAdvertisementNumber(e.target.value)}
              placeholder="e.g. 05/2026-CSP"
              className="bg-[#0b0e14] border-[#1e2536] text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Official Notification URL
            </label>
            <Input
              value={officialNotificationUrl}
              onChange={(e) => setOfficialNotificationUrl(e.target.value)}
              placeholder="https://..."
              className="bg-[#0b0e14] border-[#1e2536] text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Official Application Portal URL
            </label>
            <Input
              value={officialApplicationUrl}
              onChange={(e) => setOfficialApplicationUrl(e.target.value)}
              placeholder="https://..."
              className="bg-[#0b0e14] border-[#1e2536] text-xs"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-300 font-medium mb-1">
            Personal Preparation Notes
          </label>
          <textarea
            rows={2}
            value={personalNotes}
            onChange={(e) => setPersonalNotes(e.target.value)}
            className="w-full rounded-lg border border-[#1e2536] bg-[#0b0e14] p-2.5 text-xs text-slate-200 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
          />
        </div>
      </div>

      {/* Section B: Application Credentials & Fee */}
      <div className="space-y-3 p-4 rounded-xl bg-[#121620] border border-[#1e2536]">
        <span className="font-semibold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
          <Hash className="w-3.5 h-3.5 text-blue-400" />
          B. Registration IDs, Deadlines & Fee Status
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Registration / OTR ID
            </label>
            <Input
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
              className="bg-[#0b0e14] border-[#1e2536] text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Application Number
            </label>
            <Input
              value={applicationNumber}
              onChange={(e) => setApplicationNumber(e.target.value)}
              className="bg-[#0b0e14] border-[#1e2536] text-xs font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Application Closing Date
            </label>
            <Input
              type="date"
              value={appClosingDate}
              onChange={(e) => setAppClosingDate(e.target.value)}
              className="bg-[#0b0e14] border-[#1e2536] text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Date Certainty
            </label>
            <select
              value={appClosingCertainty}
              onChange={(e) => setAppClosingCertainty(e.target.value as DateCertainty)}
              className="flex h-9 w-full rounded-lg border border-[#1e2536] bg-[#0b0e14] px-3 py-1 text-xs text-slate-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
            >
              <option value="confirmed">Confirmed</option>
              <option value="tentative">Tentative</option>
              <option value="unannounced">Unannounced</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Fee Payment Status
            </label>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value as Examination["paymentStatus"])}
              className="flex h-9 w-full rounded-lg border border-[#1e2536] bg-[#0b0e14] px-3 py-1 text-xs text-slate-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
            >
              <option value="pending">Pending Payment</option>
              <option value="completed">Completed / Paid</option>
              <option value="exempted">Fee Exempted</option>
              <option value="failed">Payment Failed</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Fee Payment Deadline
            </label>
            <Input
              type="date"
              value={feePaymentDeadline}
              onChange={(e) => setFeePaymentDeadline(e.target.value)}
              className="bg-[#0b0e14] border-[#1e2536] text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Application Fee (₹)
            </label>
            <Input
              type="number"
              value={applicationFee}
              onChange={(e) => setApplicationFee(Number(e.target.value))}
              className="bg-[#0b0e14] border-[#1e2536] text-xs"
            />
          </div>
        </div>
      </div>

      {/* Section C: Examination Schedule & Venue */}
      <div className="space-y-3 p-4 rounded-xl bg-[#121620] border border-[#1e2536]">
        <span className="font-semibold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-emerald-400" />
          C. Examination Schedule & Venue Details
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Examination Date
            </label>
            <Input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="bg-[#0b0e14] border-[#1e2536] text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Exam Date Certainty
            </label>
            <select
              value={examDateCertainty}
              onChange={(e) => setExamDateCertainty(e.target.value as DateCertainty)}
              className="flex h-9 w-full rounded-lg border border-[#1e2536] bg-[#0b0e14] px-3 py-1 text-xs text-slate-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
            >
              <option value="confirmed">Confirmed</option>
              <option value="tentative">Tentative</option>
              <option value="unannounced">Unannounced</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Assigned City
            </label>
            <Input
              value={examCity}
              onChange={(e) => setExamCity(e.target.value)}
              className="bg-[#0b0e14] border-[#1e2536] text-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Examination Centre / Venue
            </label>
            <Input
              value={examCentre}
              onChange={(e) => setExamCentre(e.target.value)}
              className="bg-[#0b0e14] border-[#1e2536] text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Session / Shifts
            </label>
            <Input
              value={examSession}
              onChange={(e) => setExamSession(e.target.value)}
              className="bg-[#0b0e14] border-[#1e2536] text-xs"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-300 font-medium mb-1">
            Hall Ticket / Admit Card Download URL
          </label>
          <Input
            value={hallTicketUrl}
            onChange={(e) => setHallTicketUrl(e.target.value)}
            placeholder="https://..."
            className="bg-[#0b0e14] border-[#1e2536] text-xs"
          />
        </div>
      </div>

      {/* Section D: Lifecycle Status & Archive */}
      <div className="space-y-3 p-4 rounded-xl bg-[#121620] border border-[#1e2536]">
        <span className="font-semibold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          D. Lifecycle Status & Post-Exam Outcomes
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Answer Key Release Date
            </label>
            <Input
              type="date"
              value={answerKeyDate}
              onChange={(e) => setAnswerKeyDate(e.target.value)}
              className="bg-[#0b0e14] border-[#1e2536] text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Result Publication Date
            </label>
            <Input
              type="date"
              value={resultDate}
              onChange={(e) => setResultDate(e.target.value)}
              className="bg-[#0b0e14] border-[#1e2536] text-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Examination Lifecycle Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ExamStatus)}
              className="flex h-9 w-full rounded-lg border border-[#1e2536] bg-[#0b0e14] px-3 py-1 text-xs text-slate-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
            >
              <option value="interested">Interested</option>
              <option value="notification_released">Notification Released</option>
              <option value="application_not_started">Application Not Started</option>
              <option value="application_in_progress">Application In Progress</option>
              <option value="payment_pending">Payment Pending</option>
              <option value="application_submitted">Application Submitted</option>
              <option value="application_rejected">Application Rejected</option>
              <option value="examination_scheduled">Examination Scheduled</option>
              <option value="hall_ticket_available">Hall Ticket Available</option>
              <option value="examination_completed">Examination Completed</option>
              <option value="answer_key_pending">Answer Key Pending</option>
              <option value="answer_key_published">Answer Key Published</option>
              <option value="result_pending">Result Pending</option>
              <option value="result_published">Result Published</option>
              <option value="qualified">Qualified</option>
              <option value="not_qualified">Not Qualified</option>
              <option value="selected">Selected 🎉</option>
              <option value="not_selected">Not Selected</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Final Selection Outcome
            </label>
            <select
              value={selectionStatus}
              onChange={(e) => setSelectionStatus(e.target.value as Examination["finalSelectionStatus"])}
              className="flex h-9 w-full rounded-lg border border-[#1e2536] bg-[#0b0e14] px-3 py-1 text-xs text-slate-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
            >
              <option value="pending">Pending</option>
              <option value="qualified">Qualified</option>
              <option value="not_qualified">Not Qualified</option>
              <option value="selected">Selected</option>
              <option value="not_selected">Not Selected</option>
            </select>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-[#1a2133]">
          <div>
            <span className="font-semibold text-white block">Archive Examination</span>
            <span className="text-[11px] text-slate-400">
              Archived examinations are kept in historical records but hidden from active dashboard counts.
            </span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isArchived}
              onChange={(e) => setIsArchived(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[#1a2133] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" />
          </label>
        </div>
      </div>

      {/* Form Actions Footer */}
      <div className="pt-2 flex items-center justify-end gap-2.5">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="text-xs h-9 px-4"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="text-xs h-9 px-5 bg-indigo-600 hover:bg-indigo-500 font-semibold gap-1.5 cursor-pointer"
        >
          <CheckCircle2 className="w-4 h-4" />
          Save Changes
        </Button>
      </div>
    </form>
  );
}

export function EditExamModal({
  isOpen,
  exam,
  onSave,
  onClose,
}: EditExamModalProps) {
  if (!isOpen || !exam) return null;

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
        <div className="flex items-center justify-between p-5 border-b border-[#1e2536] bg-[#121622]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
              <Edit className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Edit Examination Details
              </h2>
              <p className="text-xs text-slate-400">
                Update recruitment timeline, registration numbers, test venue, and post-exam results.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1a2133] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content with stable key so form state initializes with exam */}
        <EditExamFormContent key={exam.id} exam={exam} onSave={onSave} onClose={onClose} />
      </div>
    </div>
  );
}
