"use client";

import React, { useState } from "react";
import {
  X,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCw,
  FileText,
  Calendar,
  Building2,
  HardDrive,
  Printer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VaultDocument, DOCUMENT_CATEGORIES } from "@/types/document";
import { formatDate } from "@/lib/utils";

interface DocumentPreviewModalProps {
  isOpen: boolean;
  document: VaultDocument | null;
  onClose: () => void;
}

export function DocumentPreviewModal({
  isOpen,
  document: doc,
  onClose,
}: DocumentPreviewModalProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  if (!isOpen || !doc) return null;

  const categoryMeta = DOCUMENT_CATEGORIES.find((c) => c.id === doc.category);

  const handleDownload = () => {
    const a = window.document.createElement("a");
    a.href = doc.fileUrl;
    a.download = doc.fileName;
    window.document.body.appendChild(a);
    a.click();
    window.document.body.removeChild(a);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/90 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-5xl bg-[#0a0d14] border border-[#232b3f] rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col my-4 max-h-[95vh] h-[85vh]">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-[#1e2536] bg-[#121622]">
          <div className="flex items-center gap-2.5 min-w-0 pr-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 flex-shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-white tracking-tight truncate">
                {doc.title}
              </h3>
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span className="truncate">{doc.examName}</span>
                <span>•</span>
                <Badge variant="outline" className="text-[10px] py-0 px-1.5 border-[#28334b]">
                  {categoryMeta?.shortLabel || doc.category}
                </Badge>
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {doc.fileType === "image" && (
              <>
                <button
                  onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1a2133] transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-[10px] font-mono text-slate-400 px-1 min-w-[36px] text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1a2133] transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1a2133] transition-colors"
                  title="Rotate 90°"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
                <div className="h-4 w-px bg-[#1e2536] mx-1" />
              </>
            )}

            <Button
              size="sm"
              variant="outline"
              onClick={handlePrint}
              className="text-xs h-7 px-2.5 gap-1 text-slate-300 hover:text-white border-[#242e44] hidden sm:flex"
            >
              <Printer className="w-3.5 h-3.5" />
              Print
            </Button>

            <Button
              size="sm"
              onClick={handleDownload}
              className="text-xs h-7 px-2.5 bg-indigo-600 hover:bg-indigo-500 font-semibold gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              Download
            </Button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1a2133] transition-colors ml-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Viewer Canvas */}
        <div className="flex-1 bg-[#07090e] overflow-auto flex items-center justify-center p-4 relative">
          {doc.fileType === "image" ? (
            <div className="flex items-center justify-center min-h-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={doc.fileUrl}
                alt={doc.title}
                style={{
                  transform: `scale(${zoom}) rotate(${rotation}deg)`,
                  transition: "transform 0.2s ease-out",
                }}
                className="max-h-[70vh] max-w-full rounded-lg shadow-2xl object-contain"
              />
            </div>
          ) : (
            <div className="w-full h-full rounded-xl overflow-hidden bg-slate-900 border border-[#1e2536] flex flex-col">
              <iframe
                src={`${doc.fileUrl}#toolbar=0`}
                title={doc.title}
                className="w-full h-full border-none"
              />
            </div>
          )}
        </div>

        {/* Metadata Footer */}
        <div className="p-3 sm:p-3.5 border-t border-[#1e2536] bg-[#0d1017] flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-slate-500" />
              {doc.fileSizeFormatted} ({doc.mimeType})
            </span>

            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              Uploaded: {formatDate(doc.createdAt)}
            </span>

            <span className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-500" />
              {doc.examName}
            </span>
          </div>

          {doc.notes && (
            <span className="text-[11px] text-slate-400 italic line-clamp-1 max-w-md">
              Note: {doc.notes}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
