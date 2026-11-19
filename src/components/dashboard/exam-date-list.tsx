import React from "react";
import Link from "next/link";
import { UpcomingExamDateItem } from "@/types/examination";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CertaintyBadge } from "@/components/ui/status-badge";
import { formatDate, getDaysRemaining } from "@/lib/utils";
import { Calendar, MapPin, Download, ChevronRight, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ExamDateListProps {
  examDates: UpcomingExamDateItem[];
}

export function ExamDateList({ examDates }: ExamDateListProps) {
  return (
    <Card className="bg-[#121620] border-[#1e2536]">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/15 text-indigo-400">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <CardTitle className="text-sm font-semibold text-slate-100">
              Upcoming Examination Dates
            </CardTitle>
            <p className="text-xs text-slate-400">Target test days & admit card status</p>
          </div>
        </div>
        <Link
          href="/calendar"
          className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
        >
          Timeline <ChevronRight className="w-3 h-3" />
        </Link>
      </CardHeader>

      <CardContent className="space-y-2.5 pt-1">
        {examDates.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-500">
            No upcoming exam dates scheduled.
          </div>
        ) : (
          examDates.map((item) => {
            const countdown = getDaysRemaining(item.date);

            return (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-lg bg-[#0e121a] border border-[#1b2233] hover:border-[#27324a] transition-all"
              >
                <div className="flex-1 min-w-0 pr-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-semibold text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded border border-sky-500/20">
                      {item.org}
                    </span>
                    <CertaintyBadge certainty={item.certainty} />
                    {item.hallTicketAvailable && (
                      <Badge variant="success" className="text-[10px] px-1.5 py-0 gap-1">
                        <Award className="w-2.5 h-2.5" />
                        Admit Card Out
                      </Badge>
                    )}
                  </div>

                  <h4 className="text-xs font-medium text-slate-200 truncate">
                    {item.examName}
                  </h4>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[11px] text-slate-400">
                    <span className="text-slate-200 font-medium flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-indigo-400" />
                      {formatDate(item.date)}
                    </span>
                    {item.city && (
                      <span className="flex items-center gap-1 text-slate-400">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        {item.city}
                      </span>
                    )}
                    {item.session && (
                      <span className="text-slate-500 truncate max-w-[200px]">
                        {item.session}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end flex-shrink-0">
                  <Badge
                    variant={
                      countdown.isPast
                        ? "secondary"
                        : countdown.days <= 14
                        ? "destructive"
                        : "info"
                    }
                    className="text-[10px] px-2 py-0.5 font-semibold"
                  >
                    {countdown.label}
                  </Badge>

                  {item.hallTicketAvailable ? (
                    <Link href={`/documents?examId=${item.examId}&category=HALL_TICKET`}>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-6 px-2 text-[10px] gap-1 mt-1.5 text-emerald-400 hover:text-emerald-300 border-emerald-500/30"
                      >
                        <Download className="w-2.5 h-2.5" />
                        Hall Ticket
                      </Button>
                    </Link>
                  ) : (
                    <Link
                      href={`/examinations?id=${item.examId}`}
                      className="text-[10px] text-slate-500 hover:text-indigo-400 mt-1.5 transition-colors"
                    >
                      Details
                    </Link>
                  )}
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
