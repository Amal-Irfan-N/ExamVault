"use client";

import React from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeleteCredentialModalProps {
  isOpen: boolean;
  portalName: string;
  username: string;
  onConfirm: () => void;
  onClose: () => void;
}

export function DeleteCredentialModal({
  isOpen,
  portalName,
  username,
  onConfirm,
  onClose,
}: DeleteCredentialModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-md bg-[#0d1017] border border-red-500/30 rounded-2xl shadow-2xl overflow-hidden z-10 p-5 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 flex-shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white">Delete Credential</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Are you sure you want to permanently delete credentials for{" "}
              <span className="text-white font-semibold">&quot;{portalName}&quot;</span> (Username:{" "}
              <span className="font-mono text-slate-200">{username}</span>)? This will erase the
              encrypted entry from local and cloud storage.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#1e2536]">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="text-xs h-8 px-3.5 cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            className="text-xs h-8 px-4 bg-red-600 hover:bg-red-500 font-semibold gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete Credential
          </Button>
        </div>
      </div>
    </div>
  );
}
