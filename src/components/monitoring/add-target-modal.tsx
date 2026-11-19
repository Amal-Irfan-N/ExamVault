"use client";

import React, { useState } from "react";
import { X, Globe, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMonitoring } from "@/context/MonitoringContext";
import { useExaminations } from "@/context/ExaminationContext";

interface AddTargetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddTargetModal({ isOpen, onClose }: AddTargetModalProps) {
  const { addMonitoredSource } = useMonitoring();
  const { examinations } = useExaminations();

  const [org, setOrg] = useState("UPSC");
  const [portalName, setPortalName] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [checkInterval, setCheckInterval] = useState<number>(60);
  const [selectedExamId, setSelectedExamId] = useState("");
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!portalName.trim() || !targetUrl.trim()) return;

    addMonitoredSource({
      examId: selectedExamId || undefined,
      org: org.trim(),
      portalName: portalName.trim(),
      targetUrl: targetUrl.trim(),
      category: org.trim(),
      checkIntervalMinutes: checkInterval,
      healthStatus: "healthy",
      isPaused: false,
      notes: notes.trim() || undefined,
    });

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
      <div className="relative w-full max-w-lg bg-[#0d1017] border border-[#232a3e] rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#1e2536] bg-[#121622]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Add Custom Website Target
              </h2>
              <p className="text-xs text-slate-400">
                Automated worker will periodically check this portal for notices
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
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Recruiting Organization *
              </label>
              <Input
                required
                value={org}
                onChange={(e) => setOrg(e.target.value)}
                placeholder="e.g. BPSC, KPSC, ISRO, IBPS"
                className="bg-[#121620] border-[#1e2536] text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Linked Examination (Optional)
              </label>
              <select
                value={selectedExamId}
                onChange={(e) => setSelectedExamId(e.target.value)}
                className="flex h-9 w-full rounded-lg border border-[#1e2536] bg-[#121620] px-3 py-1 text-xs text-slate-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
              >
                <option value="">General Recruitment Portal</option>
                {examinations.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.examName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Portal / Notice Board Name *
            </label>
            <Input
              required
              value={portalName}
              onChange={(e) => setPortalName(e.target.value)}
              placeholder="e.g. State PSC Active Notifications Page"
              className="bg-[#121620] border-[#1e2536] text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Official Target URL *
            </label>
            <Input
              required
              type="url"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="https://..."
              className="bg-[#121620] border-[#1e2536] text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Check Frequency
            </label>
            <select
              value={checkInterval}
              onChange={(e) => setCheckInterval(Number(e.target.value))}
              className="flex h-9 w-full rounded-lg border border-[#1e2536] bg-[#121620] px-3 py-1 text-xs text-slate-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
            >
              <option value={15}>Every 15 minutes (High frequency)</option>
              <option value={30}>Every 30 minutes (Standard)</option>
              <option value={60}>Every 1 hour (Recommended)</option>
              <option value={120}>Every 2 hours</option>
              <option value={360}>Every 6 hours</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Monitoring Notes / Target Keywords (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Look for keyword 'Assistant Engineer Interview' or 'Admit Card'"
              className="w-full rounded-lg border border-[#1e2536] bg-[#121620] p-2 text-xs text-slate-200 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#1a2133]">
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
              className="text-xs h-9 px-5 bg-indigo-600 hover:bg-indigo-500 font-semibold gap-1.5 cursor-pointer shadow-lg shadow-indigo-950/40"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Portal Target
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
