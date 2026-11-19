"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { STAGES_DATA } from "@/components/progress/live-progress-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function ProgressPage() {
  const [selectedFilter, setSelectedFilter] = useState("all");

  const totalStages = STAGES_DATA.length;
  const completedStages = STAGES_DATA.filter((s) => s.status === "completed").length;
  const readyStages = STAGES_DATA.filter((s) => s.status === "ready").length;
  const progressPercent = Math.round((completedStages / totalStages) * 100);

  const filteredStages = STAGES_DATA.filter((stage) => {
    if (selectedFilter === "completed") return stage.status === "completed";
    if (selectedFilter === "in_progress") return stage.status === "ready" || stage.status === "in_progress";
    if (selectedFilter === "pending") return stage.status === "pending";
    return true;
  });

  return (
    <AppLayout>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              ExamVault Live Progress Tracker
            </h1>
            <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 gap-1 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live In-App Roadmap
            </Badge>
          </div>
          <p className="text-xs md:text-sm text-slate-400">
            Real-time verification status across all 14 architectural implementation stages.
          </p>
        </div>

        <Link href="/">
          <Button size="sm" variant="outline" className="text-xs h-8 gap-1.5">
            Back to Dashboard <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>

      {/* Velocity Card */}
      <Card className="bg-[#121620] border-[#1e2536]">
        <CardContent className="p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-semibold text-slate-200">
                Implementation Velocity:
              </span>
              <span className="text-xs text-slate-400 ml-2">
                <strong className="text-emerald-400">{completedStages}</strong> of {totalStages} Stages Completed (
                <strong className="text-indigo-400">{readyStages}</strong> Next Stage Ready)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-extrabold text-white">{progressPercent}%</span>
              <span className="text-xs text-slate-400">Overall Progress</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 bg-[#0d1017] rounded-full overflow-hidden p-0.5 border border-[#1e2536]">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-blue-500 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(progressPercent, 8)}%` }}
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#182030] text-xs">
            <span className="text-slate-500 mr-1">Filter by status:</span>
            <button
              onClick={() => setSelectedFilter("all")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                selectedFilter === "all"
                  ? "bg-indigo-600 text-white"
                  : "bg-[#0d1017] text-slate-400 hover:text-white border border-[#1e2536]"
              }`}
            >
              All Stages ({totalStages})
            </button>
            <button
              onClick={() => setSelectedFilter("completed")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                selectedFilter === "completed"
                  ? "bg-emerald-600 text-white"
                  : "bg-[#0d1017] text-emerald-400 hover:text-white border border-[#1e2536]"
              }`}
            >
              Completed ({completedStages})
            </button>
            <button
              onClick={() => setSelectedFilter("in_progress")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                selectedFilter === "in_progress"
                  ? "bg-amber-600 text-white"
                  : "bg-[#0d1017] text-amber-400 hover:text-white border border-[#1e2536]"
              }`}
            >
              Ready / Up Next ({readyStages})
            </button>
            <button
              onClick={() => setSelectedFilter("pending")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                selectedFilter === "pending"
                  ? "bg-slate-700 text-white"
                  : "bg-[#0d1017] text-slate-400 hover:text-white border border-[#1e2536]"
              }`}
            >
              Pending ({totalStages - completedStages - readyStages})
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Stage Cards */}
      <div className="space-y-4">
        {filteredStages.map((stage) => {
          const Icon = stage.icon;
          const isCompleted = stage.status === "completed";
          const isReady = stage.status === "ready";

          return (
            <Card
              key={stage.id}
              className={`border transition-all ${
                isCompleted
                  ? "bg-[#111724] border-emerald-500/30"
                  : isReady
                  ? "bg-[#141a28] border-indigo-500/40"
                  : "bg-[#121620] border-[#1e2536]"
              }`}
            >
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2.5 rounded-xl border ${
                        isCompleted
                          ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                          : isReady
                          ? "bg-indigo-500/15 border-indigo-500/30 text-indigo-400"
                          : "bg-[#0e121a] border-[#20293d] text-slate-500"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white">
                          {stage.name}
                        </h3>
                        <Badge variant="outline" className="text-[10px] py-0 text-slate-400 border-[#242f47]">
                          {stage.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {stage.description}
                      </p>
                    </div>
                  </div>

                  <div>
                    {isCompleted && (
                      <Badge variant="success" className="text-xs font-semibold gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Completed & Verified
                      </Badge>
                    )}
                    {isReady && (
                      <Badge variant="default" className="text-xs font-semibold gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        Ready to Execute
                      </Badge>
                    )}
                    {stage.status === "pending" && (
                      <Badge variant="secondary" className="text-xs font-medium">
                        Upcoming Phase
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Completed Tasks Checklist */}
                {stage.completedTasks.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-[#1a2133]">
                    <div className="text-[11px] font-semibold text-emerald-400 mb-2 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Completed & Verified Deliverables ({stage.completedTasks.length}):
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {stage.completedTasks.map((task, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 text-xs text-slate-300 bg-[#0a0d14]/60 p-2 rounded-lg border border-[#161d2b]"
                        >
                          <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                          <span>{task}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Target Tasks */}
                {stage.pendingTasks.length > 0 && (
                  <div className="mt-3 pt-2">
                    <div className="text-[11px] font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      Target Deliverables for this Stage ({stage.pendingTasks.length}):
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {stage.pendingTasks.map((task, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 text-xs text-slate-400 bg-[#0a0d14]/30 p-2 rounded-lg border border-[#161d2b]"
                        >
                          <span className="text-indigo-400 mt-0.5">•</span>
                          <span>{task}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </AppLayout>
  );
}
