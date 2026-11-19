import React from "react";
import Link from "next/link";
import { UpcomingDeadlineItem } from "@/types/examination";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CertaintyBadge } from "@/components/ui/status-badge";
import { formatDate, getDaysRemaining } from "@/lib/utils";
import { AlertCircle, Clock, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DeadlineListProps {
  deadlines: UpcomingDeadlineItem[];
}

export function DeadlineList({ deadlines }: DeadlineListProps) {
  return (
    <Card className="bg-[#121620] border-[#1e2536]">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/15 text-amber-400">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div>
            <CardTitle className="text-sm font-semibold text-slate-100">
              Upcoming Deadlines
            </CardTitle>
            <p className="text-xs text-slate-400">Application & fee payment targets</p>
          </div>
        </div>
        <Link
          href="/calendar"
          className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
        >
          Calendar <ChevronRight className="w-3 h-3" />
        </Link>
      </CardHeader>

      <CardContent className="space-y-2.5 pt-1">
        {deadlines.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-500">
            No pending application deadlines currently tracked.
          </div>
        ) : (
          deadlines.map((item) => {
            const countdown = getDaysRemaining(item.date);

            return (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-lg bg-[#0e121a] border border-[#1b2233] hover:border-[#27324a] transition-all"
              >
                <div className="flex-1 min-w-0 pr-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-semibold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">
                      {item.org}
                    </span>
                    <CertaintyBadge certainty={item.certainty} />
                  </div>
                  <h4 className="text-xs font-medium text-slate-200 truncate">
                    {item.examName}
                  </h4>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{item.title}</span>
                    <span>•</span>
                    <span className="text-slate-300 font-medium">
                      {formatDate(item.date)}
                    </span>
                  </p>
                </div>

                <div className="flex flex-col items-end flex-shrink-0">
                  <Badge
                    variant={
                      countdown.isPast
                        ? "secondary"
                        : countdown.isUrgent
                        ? "destructive"
                        : "warning"
                    }
                    className="text-[10px] px-2 py-0.5 font-semibold"
                  >
                    {countdown.label}
                  </Badge>
                  <Link
                    href={`/examinations?id=${item.examId}`}
                    className="text-[10px] text-slate-500 hover:text-indigo-400 mt-1.5 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
