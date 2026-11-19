import React from "react";
import Link from "next/link";
import { ExamActivity } from "@/types/examination";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Activity, FileText, KeyRound, Sparkles, ChevronRight } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

interface RecentActivityProps {
  activities: ExamActivity[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  const getActivityIcon = (type: ExamActivity["type"]) => {
    switch (type) {
      case "document_added":
        return <FileText className="w-3.5 h-3.5 text-blue-400" />;
      case "credential_added":
        return <KeyRound className="w-3.5 h-3.5 text-emerald-400" />;
      case "monitoring_alert":
        return <Sparkles className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return <Activity className="w-3.5 h-3.5 text-indigo-400" />;
    }
  };

  return (
    <Card className="bg-[#121620] border-[#1e2536]">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <CardTitle className="text-sm font-semibold text-slate-100">
              Recent Activity & Alerts
            </CardTitle>
            <p className="text-xs text-slate-400">Application milestones & automated monitoring</p>
          </div>
        </div>
        <Link
          href="/notifications"
          className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
        >
          Notifications <ChevronRight className="w-3 h-3" />
        </Link>
      </CardHeader>

      <CardContent className="space-y-3 pt-1">
        {activities.map((act) => (
          <div
            key={act.id}
            className="flex items-start gap-3 p-2.5 rounded-lg bg-[#0e121a]/60 border border-[#1b2233]/70 hover:border-[#27324a] transition-all"
          >
            <div className="p-2 rounded-lg bg-[#141a27] border border-[#20293d] mt-0.5 flex-shrink-0">
              {getActivityIcon(act.type)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-200 truncate">
                  {act.action}
                </span>
                <span className="text-[10px] text-slate-500 flex-shrink-0">
                  {formatDateTime(act.timestamp)}
                </span>
              </div>
              <p className="text-[11px] text-indigo-300 font-medium mt-0.5">
                {act.examName}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                {act.details}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
