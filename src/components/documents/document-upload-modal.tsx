"use client";

import React, { useState, useRef } from "react";
import {
  X,
  Upload,
  Camera,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useExaminations } from "@/context/ExaminationContext";
import { useDocuments } from "@/context/DocumentContext";
import { DOCUMENT_CATEGORIES, DocumentCategory } from "@/types/document";

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultExamId?: string;
  defaultCategory?: DocumentCategory;
}

export function DocumentUploadModal({
  isOpen,
  onClose,
  defaultExamId,
  defaultCategory = "hall_ticket",
}: DocumentUploadModalProps) {
  const { examinations } = useExaminations();
  const { addDocument } = useDocuments();

  const [selectedExamId, setSelectedExamId] = useState<string>(
    defaultExamId || (examinations[0]?.id ?? "")
  );
  const [category, setCategory] = useState<DocumentCategory>(defaultCategory);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size (max 20MB)
    if (file.size > 20 * 1024 * 1024) {
      setErrorMsg("File size exceeds 20MB limit. Please upload a smaller file.");
      return;
    }

    const isPdf = file.type === "application/pdf" || file.name.endsWith(".pdf");
    const isImg = file.type.startsWith("image/");

    if (!isPdf && !isImg) {
      setErrorMsg("Supported formats are PDF documents and images (PNG, JPG, WEBP).");
      return;
    }

    setSelectedFile(file);

    // Auto-populate title if empty
    if (!title) {
      const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " ");
      setTitle(cleanName);
    }

    // Generate local preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMsg("Please select a file or take a camera photo to upload.");
      return;
    }
    if (!title.trim()) {
      setErrorMsg("Please specify a document title.");
      return;
    }

    const linkedExam = examinations.find((x) => x.id === selectedExamId);
    const isPdf = selectedFile.type === "application/pdf" || selectedFile.name.endsWith(".pdf");

    addDocument({
      examId: selectedExamId || undefined,
      examName: linkedExam?.examName || "General Examination Document",
      title: title.trim(),
      category,
      fileName: selectedFile.name,
      fileType: isPdf ? "pdf" : "image",
      mimeType: selectedFile.type || (isPdf ? "application/pdf" : "image/jpeg"),
      fileSize: selectedFile.size,
      fileSizeFormatted: formatFileSize(selectedFile.size),
      fileUrl: previewUrl || "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      notes: notes.trim() || undefined,
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      resetForm();
      onClose();
    }, 600);
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setTitle("");
    setNotes("");
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl bg-[#0d1017] border border-[#232a3e] rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col my-8 max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#1e2536] bg-[#121622]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Upload to Document Vault
              </h2>
              <p className="text-xs text-slate-400">
                Securely store admit cards, receipts, answer keys and certificates
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1a2133] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {isSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold">Document uploaded successfully to Vault!</span>
            </div>
          )}

          {/* Upload Zone */}
          <div className="space-y-2">
            <label className="block text-slate-300 font-semibold">
              Select File or Scan Document *
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* File Drop / Browse Button */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-4 rounded-xl border border-dashed border-[#28324a] hover:border-indigo-500/60 bg-[#121620] hover:bg-[#151a27] transition-all flex flex-col items-center justify-center text-center cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-full bg-[#1b2234] group-hover:bg-indigo-600/20 flex items-center justify-center text-indigo-400 mb-2 transition-colors">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="font-semibold text-slate-200">Browse PDF or Image</span>
                <span className="text-[11px] text-slate-500 mt-0.5">
                  PDF, PNG, JPG up to 20MB
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf,image/png,image/jpeg,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* Camera Scanner Button (Android / Mobile friendly) */}
              <div
                onClick={() => cameraInputRef.current?.click()}
                className="p-4 rounded-xl border border-dashed border-[#28324a] hover:border-emerald-500/60 bg-[#121620] hover:bg-[#151a27] transition-all flex flex-col items-center justify-center text-center cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-full bg-[#1b2234] group-hover:bg-emerald-600/20 flex items-center justify-center text-emerald-400 mb-2 transition-colors">
                  <Camera className="w-5 h-5" />
                </div>
                <span className="font-semibold text-slate-200">Camera Scan</span>
                <span className="text-[11px] text-slate-500 mt-0.5">
                  Take photo with camera
                </span>
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Selected File Card Preview */}
            {selectedFile && (
              <div className="p-3 rounded-xl bg-[#0b0e14] border border-indigo-500/30 flex items-center justify-between gap-3 mt-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  {selectedFile.type.startsWith("image/") ? (
                    <ImageIcon className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <FileText className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <span className="font-semibold text-white block truncate">
                      {selectedFile.name}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {formatFileSize(selectedFile.size)} • {selectedFile.type || "Document"}
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
                  className="text-slate-400 hover:text-red-400 h-7 px-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Form Fields: Linked Exam & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Linked Examination *
              </label>
              <select
                value={selectedExamId}
                onChange={(e) => setSelectedExamId(e.target.value)}
                className="flex h-9 w-full rounded-lg border border-[#1e2536] bg-[#121620] px-3 py-1 text-xs text-slate-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
              >
                <option value="">General / Unlinked Document</option>
                {examinations.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.examName} ({ex.recruitingOrg})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Document Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as DocumentCategory)}
                className="flex h-9 w-full rounded-lg border border-[#1e2536] bg-[#121620] px-3 py-1 text-xs text-slate-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
              >
                {DOCUMENT_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Document Title */}
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Document Title *
            </label>
            <Input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. UPSC CSE Prelims Hall Ticket 2026"
              className="bg-[#121620] border-[#1e2536] text-xs"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Document Notes / Reference Info (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Exam centre code 104, roll number 0849201"
              className="w-full rounded-lg border border-[#1e2536] bg-[#121620] p-2.5 text-xs text-slate-200 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-[#1a2133]">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="text-xs h-9 px-4 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!selectedFile || isSuccess}
              className="text-xs h-9 px-5 bg-indigo-600 hover:bg-indigo-500 font-semibold gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              Save Document
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
