"use client";

import React, { useState } from "react";
import { X, Edit3, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VaultDocument } from "@/types/document";

interface RenameDocumentModalProps {
  isOpen: boolean;
  document: VaultDocument | null;
  onSave: (id: string, newTitle: string, newNotes?: string) => void;
  onClose: () => void;
}

export function RenameDocumentModal({
  isOpen,
  document: doc,
  onSave,
  onClose,
}: RenameDocumentModalProps) {
  const [title, setTitle] = useState(doc?.title || "");
  const [notes, setNotes] = useState(doc?.notes || "");

  if (!isOpen || !doc) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave(doc.id, title.trim(), notes.trim() || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-[#0d1017] border border-[#232a3e] rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#1e2536] bg-[#121622]">
          <div className="flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Rename Document</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Document Display Title *
            </label>
            <Input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-[#121620] border-[#1e2536] text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Document Notes / Remarks
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-lg border border-[#1e2536] bg-[#121620] p-2 text-xs text-slate-200 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#1a2133]">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="text-xs h-8 px-3 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="text-xs h-8 px-4 bg-indigo-600 hover:bg-indigo-500 font-semibold gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Save Name
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
