"use client";

import React from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  examName: string;
  onConfirm: () => void;
  onClose: () => void;
}

export function DeleteConfirmModal({
  isOpen,
  examName,
  onConfirm,
  onClose,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-[#0d1017] border border-[#232a3e] rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col animate-in fade-in zoom-in-95 duration-100">
        <div className="p-5 border-b border-[#1e2536] bg-[#121622] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Delete Examination
              </h3>
              <p className="text-xs text-slate-400">
                This action will remove the record from your tracking vault.
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

        <div className="p-5 space-y-3 text-xs text-slate-300">
          <p>
            Are you sure you want to permanently delete:
          </p>
          <div className="p-3 rounded-lg bg-[#0e121a] border border-[#1b2233] font-semibold text-white">
            {examName}
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Note: If you have already completed this examination, consider archiving it instead so you retain your historical records and registration numbers.
          </p>
        </div>

        <div className="p-4 border-t border-[#1e2536] bg-[#101420] flex items-center justify-end gap-2.5">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="text-xs h-9 px-4"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            className="text-xs h-9 px-4 bg-red-600 hover:bg-red-500 text-white font-semibold gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete Permanently
          </Button>
        </div>
      </div>
    </div>
  );
}
