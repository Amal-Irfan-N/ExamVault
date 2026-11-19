"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/app-layout";
import { useExaminations } from "@/context/ExaminationContext";
import { StatusBadge, CertaintyBadge } from "@/components/ui/status-badge";
import { ExaminationLifecycleTimeline } from "@/components/examinations/examination-lifecycle-timeline";
import { EditExamModal } from "@/components/examinations/edit-exam-modal";
import { DeleteConfirmModal } from "@/components/examinations/delete-confirm-modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import {
  ChevronLeft,
  Building2,
  Hash,
  MapPin,
  Award,
  ExternalLink,
  Edit,
  Trash2,
  Archive,
  Copy,
  Check,
  FileText,
  Clock,
  Layers,
  Milestone,
} from "lucide-react";

function ExamDetailPageContent() {
  const params = useParams();
  const router = useRouter();
  const examId = params?.id as string;

  const { examinations, updateExamination, deleteExamination } = useExaminations();

  const exam = useMemo(() => {
    return examinations.find((e) => e.id === examId) || null;
  }, [examinations, examId]);

  const [activeTab, setActiveTab] = useState<"timeline" | "overview">("timeline");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 1500);
  };

  const handleToggleArchive = () => {
    if (!exam) return;
    updateExamination(exam.id, { isArchived: !exam.isArchived });
  };

  const handleDeleteConfirm = () => {
    if (!exam) return;
    deleteExamination(exam.id);
    router.push("/examinations");
  };

  if (!exam) {
    return (
      <AppLayout>
        <div className="p-8 text-center max-w-md mx-auto my-12 rounded-2xl bg-[#121620] border border-[#1e2536]">
          <h3 className="text-base font-bold text-white mb-2">Examination Not Found</h3>
          <p className="text-xs text-slate-400 mb-6">
            The examination with ID &quot;{examId}&quot; does not exist or may have been deleted.
          </p>
          <Link href="/examinations">
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-xs">
              Back to Examinations List
            </Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Back Link & Breadcrumb */}
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/examinations"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Examinations
          </Link>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleToggleArchive}
              className="text-xs h-8 px-3 gap-1.5 cursor-pointer text-slate-300 hover:text-white"
            >
              <Archive className="w-3.5 h-3.5" />
              {exam.isArchived ? "Unarchive" : "Archive"}
            </Button>

            <Button
              size="sm"
              variant="destructive"
              onClick={() => setIsDeleteModalOpen(true)}
              className="text-xs h-8 px-3 gap-1.5 text-red-400 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </Button>

            <Button
              size="sm"
              onClick={() => setIsEditModalOpen(true)}
              className="text-xs h-8 px-3.5 bg-indigo-600 hover:bg-indigo-500 font-semibold gap-1.5 cursor-pointer"
            >
              <Edit className="w-3.5 h-3.5" />
              Edit Details
            </Button>
          </div>
        </div>

        {/* Hero Examination Banner */}
        <div className="p-6 rounded-2xl bg-[#121622] border border-[#232a3e] relative overflow-hidden shadow-xl">
          <div className="relative z-10 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-white bg-indigo-500/20 border border-indigo-500/40 px-2.5 py-0.5 rounded">
                {exam.recruitingOrg}
              </span>
              <Badge variant="outline" className="text-slate-300 border-[#2b354f] text-[11px]">
                {exam.category}
              </Badge>
              <span className="text-xs text-slate-400">Recruitment Year {exam.recruitmentYear}</span>
              <StatusBadge status={exam.status} />
              {exam.isArchived && (
                <Badge variant="secondary" className="text-[10px]">
                  Archived Record
                </Badge>
              )}
            </div>

            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                {exam.examName}
              </h1>
              <p className="text-sm text-slate-300 font-medium mt-1">
                Post: <span className="text-indigo-300">{exam.postName}</span>
                {exam.advertisementNumber && (
                  <span className="text-slate-400 ml-3 font-mono text-xs">
                    (Notice No: {exam.advertisementNumber})
                  </span>
                )}
              </p>
            </div>

            {exam.personalNotes && (
              <p className="text-xs text-slate-300 italic bg-[#0b0e14]/60 p-2.5 rounded-lg border border-[#1a2133] max-w-3xl">
                Preparation Note: {exam.personalNotes}
              </p>
            )}
          </div>
        </div>

        {/* Main Content Layout: Tabs & Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column (2 spans): Timeline & Overview */}
          <div className="lg:col-span-2 space-y-4">
            {/* Tab Selector */}
            <div className="flex items-center gap-2 border-b border-[#1e2536] pb-1">
              <button
                onClick={() => setActiveTab("timeline")}
                className={`flex items-center gap-2 px-4 py-2 rounded-t-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "timeline"
                    ? "bg-[#121620] text-indigo-400 border-t border-x border-[#1e2536]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Milestone className="w-4 h-4" />
                Examination Lifecycle Timeline
              </button>

              <button
                onClick={() => setActiveTab("overview")}
                className={`flex items-center gap-2 px-4 py-2 rounded-t-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "overview"
                    ? "bg-[#121620] text-indigo-400 border-t border-x border-[#1e2536]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Layers className="w-4 h-4" />
                Structured Section Details
              </button>
            </div>

            {/* Tab Views */}
            {activeTab === "timeline" ? (
              <ExaminationLifecycleTimeline
                exam={exam}
                onUpdateStatus={(id, status) => updateExamination(id, { status })}
              />
            ) : (
              <div className="space-y-4">
                {/* Section A: Basic Info */}
                <div className="p-5 rounded-xl bg-[#121620] border border-[#1e2536] space-y-3">
                  <span className="font-semibold text-white uppercase tracking-wider text-xs flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-indigo-400" />
                    A. Basic Recruitment Details
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
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

                  {exam.officialNotificationUrl && (
                    <div className="pt-2 border-t border-[#1a2133] flex items-center justify-between">
                      <span className="text-xs text-slate-400">Official Notification:</span>
                      <a
                        href={exam.officialNotificationUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                      >
                        View Official PDF <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>

                {/* Section B: Application Info */}
                <div className="p-5 rounded-xl bg-[#121620] border border-[#1e2536] space-y-3">
                  <span className="font-semibold text-white uppercase tracking-wider text-xs flex items-center gap-2">
                    <Hash className="w-4 h-4 text-blue-400" />
                    B. Registration IDs & Deadlines
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300 pt-3 border-t border-[#1a2133]">
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
                      <span className="text-slate-500 block text-[11px]">Fee Payment:</span>
                      <span className="capitalize text-slate-200 font-medium">
                        {exam.paymentStatus || "pending"} (₹{exam.applicationFee ?? 0})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Section C: Schedule & Venue */}
                <div className="p-5 rounded-xl bg-[#121620] border border-[#1e2536] space-y-3">
                  <span className="font-semibold text-white uppercase tracking-wider text-xs flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    C. Examination Schedule & Venue
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300 pt-3 border-t border-[#1a2133]">
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
                </div>

                {/* Section D: Post-Exam */}
                <div className="p-5 rounded-xl bg-[#121620] border border-[#1e2536] space-y-3">
                  <span className="font-semibold text-white uppercase tracking-wider text-xs flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-400" />
                    D. Post-Examination Outcomes
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
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
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Key Quick Actions & Identifiers */}
          <div className="space-y-4">
            {/* Quick Identifier Copy Card */}
            <div className="p-4 rounded-xl bg-[#121620] border border-[#1e2536] space-y-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Quick Identifiers
              </span>

              <div className="space-y-2 text-xs">
                {exam.registrationNumber && (
                  <div className="p-2.5 rounded-lg bg-[#0b0e14] border border-[#1a2133] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Registration ID</span>
                      <span className="font-mono text-slate-200 font-medium">
                        {exam.registrationNumber}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopy(exam.registrationNumber!, "reg")}
                      className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-[#1e2536] transition-colors cursor-pointer"
                      title="Copy Registration ID"
                    >
                      {copiedField === "reg" ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                )}

                {exam.applicationNumber && (
                  <div className="p-2.5 rounded-lg bg-[#0b0e14] border border-[#1a2133] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Application No.</span>
                      <span className="font-mono text-slate-200 font-medium">
                        {exam.applicationNumber}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopy(exam.applicationNumber!, "app")}
                      className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-[#1e2536] transition-colors cursor-pointer"
                      title="Copy Application Number"
                    >
                      {copiedField === "app" ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                )}

                {!exam.registrationNumber && !exam.applicationNumber && (
                  <p className="text-slate-500 text-xs italic">
                    No registration credentials recorded yet. Click &quot;Edit Details&quot; to add them.
                  </p>
                )}
              </div>
            </div>

            {/* Official Portals Card */}
            <div className="p-4 rounded-xl bg-[#121620] border border-[#1e2536] space-y-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Official Links
              </span>

              <div className="space-y-2 text-xs">
                {exam.officialApplicationUrl && (
                  <a
                    href={exam.officialApplicationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-lg bg-[#0b0e14] border border-[#1a2133] hover:border-indigo-500/40 text-slate-300 hover:text-white transition-colors"
                  >
                    <span>Application Portal</span>
                    <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
                  </a>
                )}

                {exam.hallTicketDownloadUrl && (
                  <a
                    href={exam.hallTicketDownloadUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-lg bg-[#0b0e14] border border-[#1a2133] hover:border-emerald-500/40 text-emerald-300 hover:text-emerald-200 transition-colors"
                  >
                    <span>Download Hall Ticket</span>
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                  </a>
                )}

                {exam.officialNotificationUrl && (
                  <a
                    href={exam.officialNotificationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-lg bg-[#0b0e14] border border-[#1a2133] hover:border-slate-500/40 text-slate-300 hover:text-white transition-colors"
                  >
                    <span>Official Notification PDF</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>
                )}
              </div>
            </div>

            {/* Linked Document Vault Shortcut */}
            <div className="p-4 rounded-xl bg-[#121620] border border-[#1e2536] space-y-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Examination Documents
              </span>
              <p className="text-xs text-slate-400">
                Store admit card, payment receipts, answer keys and certificates in the dedicated vault.
              </p>
              <Link href={`/documents?examId=${exam.id}`}>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full text-xs gap-1.5 border-[#232c42] hover:bg-[#1a2133] cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-400" />
                  Open Document Vault
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <EditExamModal
        isOpen={isEditModalOpen}
        exam={exam}
        onSave={(id, updates) => {
          updateExamination(id, updates);
          setIsEditModalOpen(false);
        }}
        onClose={() => setIsEditModalOpen(false)}
      />

      {/* Delete Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        examName={exam.examName}
        onConfirm={handleDeleteConfirm}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </AppLayout>
  );
}

export default function ExamDetailPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#0b0d13] flex items-center justify-center text-slate-500 text-sm">
          <Clock className="w-5 h-5 animate-spin mr-2 text-indigo-500" />
          Loading examination details...
        </div>
      }
    >
      <ExamDetailPageContent />
    </React.Suspense>
  );
}
