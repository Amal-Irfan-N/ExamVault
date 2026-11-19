"use client";

import React, { useState } from "react";
import {
  X,
  Sparkles,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DetectedUpdate } from "@/types/monitoring";

interface ChangeReviewModalProps {
  isOpen: boolean;
  update: DetectedUpdate | null;
  onAccept: (updateId: string) => Promise<boolean>;
  onDismiss: (updateId: string) => void;
  onClose: () => void;
}

export function ChangeReviewModal({
  isOpen,
  update,
  onAccept,
  onDismiss,
  onClose,
}: ChangeReviewModalProps) {
  const [isApplying, setIsApplying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !update) return null;

  const handleApply = async () => {
    setIsApplying(true);
    await onAccept(update.id);
    setIsApplying(false);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 800);
  };

  const handleDismiss = () => {
    onDismiss(update.id);
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
      <div className="relative w-full max-w-xl bg-[#0d1017] border border-[#232a3e] rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col my-8">
        {/* Header */}
        <div className="flex items-start justify-between p-4 sm:p-5 border-b border-[#1e2536] bg-[#121622]">
          <div className="flex items-center gap-2.5 min-w-0 pr-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 flex-shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white bg-indigo-500/20 px-2 py-0.5 rounded border border-indigo-500/30">
                  {update.org}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {update.confidenceScore}% confidence
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight mt-1">
                Detected Portal Update
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1a2133] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 text-xs">
          {isSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold">
                Examination record updated successfully with detected dates!
              </span>
            </div>
          )}

          {/* Headline & Summary */}
          <div className="p-4 rounded-xl bg-[#121620] border border-[#1e2536] space-y-2">
            <h4 className="text-sm font-bold text-white leading-snug">
              {update.headline}
            </h4>
            <p className="text-slate-300 text-xs leading-relaxed">
              {update.summary}
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-[#1a2133] text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-500" />
                Target: <strong className="text-white">{update.examName}</strong>
              </span>

              <a
                href={update.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                Verify on Portal <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Visual Before & After Diff Box */}
          {update.extractedChanges && update.extractedChanges.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Detected Changes & Record Impact
              </span>

              <div className="space-y-2">
                {update.extractedChanges.map((ch, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#0b0e14] border border-[#1e2536] space-y-2"
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-semibold uppercase tracking-wider text-slate-300">
                        Field: {ch.field}
                      </span>
                      <span className="text-amber-400">Proposed Change</span>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Old Value */}
                      <div className="flex-1 p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 line-through truncate font-mono text-xs">
                        {ch.oldValue || "None recorded"}
                      </div>

                      <ArrowRight className="w-4 h-4 text-slate-500 flex-shrink-0" />

                      {/* New Value */}
                      <div className="flex-1 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-bold truncate font-mono text-xs">
                        {ch.newValue}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* User Confirmation Safety Warning */}
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Accepting this update will synchronize the new dates into your active examination
              timeline, deadlines, and notifications.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t border-[#1e2536] bg-[#121622] flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={handleDismiss}
            className="text-xs h-9 px-3.5 text-slate-400 hover:text-white cursor-pointer"
          >
            Dismiss Alert
          </Button>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="text-xs h-9 px-4 cursor-pointer"
            >
              Close
            </Button>

            <Button
              type="button"
              disabled={isApplying || isSuccess}
              onClick={handleApply}
              className="text-xs h-9 px-5 bg-indigo-600 hover:bg-indigo-500 font-semibold gap-1.5 cursor-pointer shadow-lg shadow-indigo-950/40"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isApplying ? "Updating Record..." : "Accept & Update Examination"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
