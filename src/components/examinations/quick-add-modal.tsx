"use client";

import React, { useState } from "react";
import { useExaminations } from "@/context/ExaminationContext";
import {
  X,
  Plus,
  GraduationCap,
  Calendar,
  Hash,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ExamCategory, ExamStatus, DateCertainty } from "@/types/examination";

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

export function QuickAddModal() {
  const { isQuickAddOpen, setIsQuickAddOpen, addExamination } = useExaminations();

  const [examName, setExamName] = useState("");
  const [recruitingOrg, setRecruitingOrg] = useState("UPSC");
  const [category, setCategory] = useState<ExamCategory>("UPSC");
  const [postName, setPostName] = useState("");
  const [advertisementNumber, setAdvertisementNumber] = useState("");
  const [recruitmentYear, setRecruitmentYear] = useState<number>(2026);
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [applicationNumber, setApplicationNumber] = useState("");
  const [officialNotificationUrl, setOfficialNotificationUrl] = useState("");
  const [officialApplicationUrl, setOfficialApplicationUrl] = useState("");
  const [personalNotes, setPersonalNotes] = useState("");

  // Dates & Certainties
  const [appClosingDate, setAppClosingDate] = useState("");
  const [appClosingCertainty, setAppClosingCertainty] = useState<DateCertainty>("confirmed");

  const [examDate, setExamDate] = useState("");
  const [examDateCertainty, setExamDateCertainty] = useState<DateCertainty>("tentative");
  const [examSession, setExamSession] = useState("");
  const [examCity, setExamCity] = useState("");

  const [status, setStatus] = useState<ExamStatus>("interested");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const handleOrgChange = (orgName: string) => {
    setRecruitingOrg(orgName);
    const match = ORG_OPTIONS.find((o) => o.name === orgName);
    if (match) setCategory(match.category);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examName.trim() || !postName.trim()) return;

    setIsSubmitting(true);

    addExamination({
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
      applicationStatus: status === "application_submitted" ? "submitted" : "not_started",
      paymentStatus: "pending",
      status,
      isArchived: false,
      applicationClosingDate: appClosingDate
        ? { date: appClosingDate, certainty: appClosingCertainty }
        : undefined,
      examDate: examDate ? { date: examDate, certainty: examDateCertainty } : undefined,
      examSession: examSession.trim() || undefined,
      examCity: examCity.trim() || undefined,
    });

    setIsSubmitting(false);
    setSuccessMessage(true);

    setTimeout(() => {
      setSuccessMessage(false);
      setIsQuickAddOpen(false);
      // Reset form
      setExamName("");
      setPostName("");
      setRegistrationNumber("");
      setApplicationNumber("");
      setAdvertisementNumber("");
      setPersonalNotes("");
      setOfficialNotificationUrl("");
      setOfficialApplicationUrl("");
      setAppClosingDate("");
      setExamDate("");
      setExamCity("");
      setExamSession("");
    }, 1000);
  };

  if (!isQuickAddOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={() => setIsQuickAddOpen(false)}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-[#0d1017] border border-[#232a3e] rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col my-8 max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#1e2536] bg-[#121622]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Add New Examination
              </h2>
              <p className="text-xs text-slate-400">
                Register a new competitive recruitment to track deadlines, admit cards & results.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsQuickAddOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1a2133] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold">Examination added successfully! Live dashboard updated.</span>
            </div>
          )}

          {/* Section A: Basic Information */}
          <div className="space-y-3 p-4 rounded-xl bg-[#121620] border border-[#1e2536]">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                A. Basic Information
              </span>
              <Badge variant="outline" className="text-[10px] text-slate-400 border-[#242e44]">
                Required
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Examination Name *
                </label>
                <Input
                  required
                  placeholder="e.g. Civil Services Examination (Prelims)"
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
                  onChange={(e) => handleOrgChange(e.target.value)}
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
                  placeholder="e.g. Assistant Section Officer / Inspector"
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

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Advertisement / Notice Number
              </label>
              <Input
                placeholder="e.g. 05/2026-CSP or CEN 05/2026"
                value={advertisementNumber}
                onChange={(e) => setAdvertisementNumber(e.target.value)}
                className="bg-[#0b0e14] border-[#1e2536] text-xs font-mono"
              />
            </div>
          </div>

          {/* Section B: Application Credentials & Deadlines */}
          <div className="space-y-3 p-4 rounded-xl bg-[#121620] border border-[#1e2536]">
            <span className="font-semibold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-blue-400" />
              B. Registration IDs & Application Deadline
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Registration / OTR Number
                </label>
                <Input
                  placeholder="e.g. RID-893041829"
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
                  placeholder="e.g. UPSC2026987412"
                  value={applicationNumber}
                  onChange={(e) => setApplicationNumber(e.target.value)}
                  className="bg-[#0b0e14] border-[#1e2536] text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                  <option value="confirmed">Confirmed by Official Notification</option>
                  <option value="tentative">Tentative / Estimated Date</option>
                  <option value="unannounced">Unannounced / Awaiting Notice</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section C: Examination Schedule & Location */}
          <div className="space-y-3 p-4 rounded-xl bg-[#121620] border border-[#1e2536]">
            <span className="font-semibold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              C. Examination Schedule & Location
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Target Examination Date
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
                  <option value="confirmed">Confirmed Date</option>
                  <option value="tentative">Tentative Schedule</option>
                  <option value="unannounced">Unannounced</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Assigned City
                </label>
                <Input
                  placeholder="e.g. New Delhi / Bengaluru"
                  value={examCity}
                  onChange={(e) => setExamCity(e.target.value)}
                  className="bg-[#0b0e14] border-[#1e2536] text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Session / Shifts
                </label>
                <Input
                  placeholder="e.g. Paper I (09:30-11:30) & Paper II"
                  value={examSession}
                  onChange={(e) => setExamSession(e.target.value)}
                  className="bg-[#0b0e14] border-[#1e2536] text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section D: URLs, Status & Notes */}
          <div className="space-y-3 p-4 rounded-xl bg-[#121620] border border-[#1e2536]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Official Notification Link
                </label>
                <Input
                  placeholder="https://upsc.gov.in/notification"
                  value={officialNotificationUrl}
                  onChange={(e) => setOfficialNotificationUrl(e.target.value)}
                  className="bg-[#0b0e14] border-[#1e2536] text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Official Application Portal URL
                </label>
                <Input
                  placeholder="https://upsconline.nic.in"
                  value={officialApplicationUrl}
                  onChange={(e) => setOfficialApplicationUrl(e.target.value)}
                  className="bg-[#0b0e14] border-[#1e2536] text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Initial Lifecycle Status
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
                <option value="examination_scheduled">Examination Scheduled</option>
                <option value="hall_ticket_available">Hall Ticket Available</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Personal Preparation Notes
              </label>
              <textarea
                rows={2}
                placeholder="Target score, syllabus revision checklist, or center travel notes..."
                value={personalNotes}
                onChange={(e) => setPersonalNotes(e.target.value)}
                className="w-full rounded-lg border border-[#1e2536] bg-[#0b0e14] p-2.5 text-xs text-slate-200 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
              />
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsQuickAddOpen(false)}
              className="text-xs h-9 px-4"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="text-xs h-9 px-5 bg-indigo-600 hover:bg-indigo-500 font-semibold gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Save Examination
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
