"use client";

import React, { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { useDocuments } from "@/context/DocumentContext";
import { useExaminations } from "@/context/ExaminationContext";
import { DOCUMENT_CATEGORIES, DocumentCategory, VaultDocument } from "@/types/document";
import { DocumentUploadModal } from "@/components/documents/document-upload-modal";
import { DocumentPreviewModal } from "@/components/documents/document-preview-modal";
import { RenameDocumentModal } from "@/components/documents/rename-document-modal";
import { DeleteDocumentModal } from "@/components/documents/delete-document-modal";
import {
  Upload,
  Search,
  FileText,
  Download,
  Eye,
  Camera,
  Trash2,
  Edit3,
  HardDrive,
  RotateCcw,
  LayoutGrid,
  List,
  Building2,
  Image as ImageIcon,
} from "lucide-react";

function DocumentsContent() {
  const searchParams = useSearchParams();
  const examIdParam = searchParams.get("examId");

  const { documents, updateDocument, deleteDocument, totalStorageBytes } = useDocuments();
  const { examinations } = useExaminations();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedExamId, setSelectedExamId] = useState<string>(examIdParam || "all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<VaultDocument | null>(null);
  const [renameDoc, setRenameDoc] = useState<VaultDocument | null>(null);
  const [deleteDoc, setDeleteDoc] = useState<VaultDocument | null>(null);

  // Storage calculation
  const formattedTotalStorage = useMemo(() => {
    if (totalStorageBytes < 1024 * 1024) {
      return `${(totalStorageBytes / 1024).toFixed(1)} KB`;
    }
    return `${(totalStorageBytes / (1024 * 1024)).toFixed(1)} MB`;
  }, [totalStorageBytes]);

  const pdfCount = useMemo(() => documents.filter((d) => d.fileType === "pdf").length, [documents]);
  const imageCount = useMemo(() => documents.filter((d) => d.fileType === "image").length, [documents]);

  // Filtered documents
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      // Exam Filter
      if (selectedExamId !== "all" && doc.examId !== selectedExamId) {
        return false;
      }
      // Category Filter
      if (selectedCategory !== "all" && doc.category !== selectedCategory) {
        return false;
      }
      // Search Filter
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchTitle = doc.title.toLowerCase().includes(q);
        const matchExam = doc.examName.toLowerCase().includes(q);
        const matchFile = doc.fileName.toLowerCase().includes(q);
        const matchNotes = doc.notes?.toLowerCase().includes(q);
        if (!matchTitle && !matchExam && !matchFile && !matchNotes) {
          return false;
        }
      }
      return true;
    });
  }, [documents, selectedExamId, selectedCategory, search]);

  const handleDownload = (doc: VaultDocument) => {
    const a = document.createElement("a");
    a.href = doc.fileUrl;
    a.download = doc.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const getCategoryMeta = (catId: DocumentCategory) => {
    return DOCUMENT_CATEGORIES.find((c) => c.id === catId);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header with Title & Action Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Examination Document Vault
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Secure, categorized storage for hall tickets, receipts, response sheets and certificates
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsUploadOpen(true)}
              className="text-xs h-9 px-3 gap-1.5 border-[#28334b] text-slate-300 hover:text-white cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5 text-emerald-400" />
              Camera Scan
            </Button>

            <Button
              size="sm"
              onClick={() => setIsUploadOpen(true)}
              className="text-xs h-9 px-4 bg-indigo-600 hover:bg-indigo-500 font-semibold gap-1.5 cursor-pointer shadow-lg shadow-indigo-950/30"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload Document
            </Button>
          </div>
        </div>

        {/* Storage Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-[#121620] border border-[#1e2536] flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">
                Total Files
              </span>
              <span className="text-base font-bold text-white font-mono">{documents.length}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#121620] border border-[#1e2536] flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <HardDrive className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">
                Vault Storage
              </span>
              <span className="text-base font-bold text-white font-mono">{formattedTotalStorage}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#121620] border border-[#1e2536] flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">
                PDF Documents
              </span>
              <span className="text-base font-bold text-white font-mono">{pdfCount}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#121620] border border-[#1e2536] flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">
                Scanned Images
              </span>
              <span className="text-base font-bold text-white font-mono">{imageCount}</span>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 rounded-xl bg-[#121620] border border-[#1e2536] space-y-3">
          <div className="flex flex-col md:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full md:flex-1">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <Input
                type="text"
                placeholder="Search documents by name, examination, or notes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-[#0d1017] border-[#20283c] text-xs"
              />
            </div>

            {/* Exam Filter Dropdown */}
            <div className="w-full md:w-64">
              <select
                value={selectedExamId}
                onChange={(e) => setSelectedExamId(e.target.value)}
                className="flex h-9 w-full rounded-lg border border-[#20283c] bg-[#0d1017] px-3 py-1 text-xs text-slate-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
              >
                <option value="all">All Examinations</option>
                {examinations.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.examName} ({ex.recruitingOrg})
                  </option>
                ))}
              </select>
            </div>

            {/* View Switcher & Reset */}
            <div className="flex items-center gap-1.5 self-end md:self-auto">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-indigo-600 border-indigo-500 text-white"
                    : "bg-[#0d1017] border-[#20283c] text-slate-400 hover:text-white"
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>

              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                  viewMode === "list"
                    ? "bg-indigo-600 border-indigo-500 text-white"
                    : "bg-[#0d1017] border-[#20283c] text-slate-400 hover:text-white"
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>

              {(search || selectedCategory !== "all" || selectedExamId !== "all") && (
                <button
                  onClick={() => {
                    setSearch("");
                    setSelectedCategory("all");
                    setSelectedExamId("all");
                  }}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-amber-300 bg-[#0d1017] border border-[#20283c] text-xs transition-colors"
                  title="Reset filters"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* 14 Category Filters Scrollable Row */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === "all"
                  ? "bg-indigo-600 text-white"
                  : "bg-[#0d1017] text-slate-400 hover:text-white border border-[#1e2536]"
              }`}
            >
              All Categories ({documents.length})
            </button>

            {DOCUMENT_CATEGORIES.map((cat) => {
              const count = documents.filter((d) => d.category === cat.id).length;
              if (count === 0 && selectedCategory !== cat.id) return null;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                    selectedCategory === cat.id
                      ? "bg-indigo-600 text-white"
                      : "bg-[#0d1017] text-slate-400 hover:text-white border border-[#1e2536]"
                  }`}
                >
                  <span>{cat.shortLabel}</span>
                  <span className="text-[10px] opacity-75 font-mono">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Documents Content Grid / List */}
        {filteredDocuments.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#121620] border border-[#1e2536]">
            <FileText className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-300">No documents found</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              {search || selectedCategory !== "all" || selectedExamId !== "all"
                ? "Try adjusting your search criteria or category filter."
                : "Upload your first hall ticket, application confirmation, or payment receipt."}
            </p>
            <Button
              size="sm"
              onClick={() => setIsUploadOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-500 gap-1.5 text-xs font-semibold cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload Document Now
            </Button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocuments.map((doc) => {
              const catMeta = getCategoryMeta(doc.category);
              const isPdf = doc.fileType === "pdf";

              return (
                <Card
                  key={doc.id}
                  className="bg-[#121620] border-[#1e2536] hover:border-indigo-500/40 hover:bg-[#131825] transition-all flex flex-col group"
                >
                  <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2">
                        <Badge
                          variant="outline"
                          className="text-[10px] font-medium border-[#28334b] text-indigo-300 bg-indigo-500/10"
                        >
                          {catMeta?.label || doc.category}
                        </Badge>
                        <span className="text-[11px] text-slate-500 font-mono">
                          {doc.fileSizeFormatted}
                        </span>
                      </div>

                      {/* Title & Preview Trigger */}
                      <div
                        onClick={() => setPreviewDoc(doc)}
                        className="cursor-pointer group/title"
                      >
                        <h4 className="text-sm font-bold text-white tracking-tight line-clamp-2 group-hover/title:text-indigo-400 transition-colors">
                          {doc.title}
                        </h4>
                      </div>

                      {/* Linked Exam Name */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Building2 className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                        <span className="truncate">{doc.examName}</span>
                      </div>

                      {/* File Details & Notes */}
                      <div className="p-2 rounded-lg bg-[#0b0e14] border border-[#1a2133] space-y-1">
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-300 font-mono truncate">
                          {isPdf ? (
                            <FileText className="w-3 h-3 text-red-400 flex-shrink-0" />
                          ) : (
                            <ImageIcon className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                          )}
                          <span className="truncate">{doc.fileName}</span>
                        </div>
                        {doc.notes && (
                          <p className="text-[10px] text-slate-400 italic line-clamp-1">
                            {doc.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="pt-2 border-t border-[#1a2133] flex items-center justify-between gap-1 text-xs">
                      <span className="text-[10px] text-slate-500">
                        {formatDate(doc.createdAt)}
                      </span>

                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setPreviewDoc(doc)}
                          className="text-xs h-7 px-2 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 cursor-pointer"
                          title="Preview Document"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Button>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDownload(doc)}
                          className="text-xs h-7 px-2 text-slate-300 hover:text-white hover:bg-[#1e2536] cursor-pointer"
                          title="Download File"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </Button>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setRenameDoc(doc)}
                          className="text-xs h-7 px-2 text-slate-400 hover:text-white hover:bg-[#1e2536] cursor-pointer"
                          title="Rename / Edit Notes"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </Button>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeleteDoc(doc)}
                          className="text-xs h-7 px-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer"
                          title="Delete Document"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          /* List View */
          <div className="rounded-xl bg-[#121620] border border-[#1e2536] overflow-hidden divide-y divide-[#1e2536]">
            {filteredDocuments.map((doc) => {
              const catMeta = getCategoryMeta(doc.category);
              const isPdf = doc.fileType === "pdf";

              return (
                <div
                  key={doc.id}
                  className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#131825] transition-colors"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-[#0b0e14] border border-[#1e2536] flex items-center justify-center flex-shrink-0 mt-0.5">
                      {isPdf ? (
                        <FileText className="w-4 h-4 text-red-400" />
                      ) : (
                        <ImageIcon className="w-4 h-4 text-emerald-400" />
                      )}
                    </div>

                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          onClick={() => setPreviewDoc(doc)}
                          className="text-xs font-bold text-white hover:text-indigo-400 cursor-pointer transition-colors truncate"
                        >
                          {doc.title}
                        </span>
                        <Badge
                          variant="outline"
                          className="text-[10px] border-[#252f46] text-slate-300"
                        >
                          {catMeta?.shortLabel || doc.category}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                        <span>{doc.examName}</span>
                        <span>•</span>
                        <span className="font-mono">{doc.fileSizeFormatted}</span>
                        <span>•</span>
                        <span>{formatDate(doc.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 self-end sm:self-auto flex-shrink-0">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setPreviewDoc(doc)}
                      className="text-xs h-7 px-2.5 gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Preview
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownload(doc)}
                      className="text-xs h-7 px-2.5 gap-1 border-[#242f47] cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setRenameDoc(doc)}
                      className="text-xs h-7 px-2 text-slate-400 hover:text-white cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setDeleteDoc(doc)}
                      className="text-xs h-7 px-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <DocumentUploadModal
        isOpen={isUploadOpen}
        defaultExamId={selectedExamId !== "all" ? selectedExamId : undefined}
        onClose={() => setIsUploadOpen(false)}
      />

      {/* Preview Modal */}
      <DocumentPreviewModal
        isOpen={Boolean(previewDoc)}
        document={previewDoc}
        onClose={() => setPreviewDoc(null)}
      />

      {/* Rename Modal */}
      <RenameDocumentModal
        isOpen={Boolean(renameDoc)}
        document={renameDoc}
        onSave={(id, newTitle, newNotes) => {
          updateDocument(id, { title: newTitle, notes: newNotes });
          setRenameDoc(null);
        }}
        onClose={() => setRenameDoc(null)}
      />

      {/* Delete Confirmation Modal */}
      <DeleteDocumentModal
        isOpen={Boolean(deleteDoc)}
        docTitle={deleteDoc?.title || ""}
        onConfirm={() => {
          if (deleteDoc) {
            deleteDocument(deleteDoc.id);
            setDeleteDoc(null);
          }
        }}
        onClose={() => setDeleteDoc(null)}
      />
    </AppLayout>
  );
}

export default function DocumentsPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#0b0d13] flex items-center justify-center text-slate-500 text-sm">
          Loading Document Vault...
        </div>
      }
    >
      <DocumentsContent />
    </React.Suspense>
  );
}
