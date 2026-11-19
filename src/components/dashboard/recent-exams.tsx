import React from "react";
import Link from "next/link";
import { Examination } from "@/types/examination";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate } from "@/lib/utils";
import { GraduationCap, ArrowUpRight, Calendar, Hash } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RecentExamsProps {
  exams: Examination[];
}

export function RecentExams({ exams }: RecentExamsProps) {
  return (
    <Card className="bg-[#121620] border-[#1e2536]">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-500/15 text-blue-400">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <CardTitle className="text-sm font-semibold text-slate-100">
              Tracked Examinations
            </CardTitle>
            <p className="text-xs text-slate-400">Recently managed competitive recruitments</p>
          </div>
        </div>
        <Link
          href="/examinations"
          className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
        >
          View All ({exams.length}) <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </CardHeader>

      <CardContent className="space-y-3 pt-1">
        {exams.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-500">
            No examinations match the selected filter criteria.
          </div>
        ) : (
          exams.slice(0, 5).map((exam) => (
            <Link
              key={exam.id}
              href={`/examinations?id=${exam.id}`}
              className="block group"
            >
              <div className="p-3.5 rounded-lg bg-[#0e121a] border border-[#1b2233] hover:border-indigo-500/40 hover:bg-[#111722] transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-bold text-white bg-[#1a2133] px-2 py-0.5 rounded border border-[#27324a]">
                      {exam.recruitingOrg}
                    </span>
                    <Badge variant="outline" className="text-[10px] text-slate-400">
                      {exam.category}
                    </Badge>
                    <span className="text-[11px] text-slate-500">
                      {exam.recruitmentYear}
                    </span>
                  </div>
                  <div>
                    <StatusBadge status={exam.status} />
                  </div>
                </div>

                <h4 className="text-sm font-medium text-slate-200 group-hover:text-indigo-300 transition-colors">
                  {exam.examName}
                </h4>

                <p className="text-xs text-slate-400 mt-0.5 truncate">
                  {exam.postName}
                </p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2.5 pt-2 border-t border-[#182030] text-[11px] text-slate-400">
                  {exam.registrationNumber && (
                    <span className="flex items-center gap-1 font-mono text-slate-300">
                      <Hash className="w-3 h-3 text-slate-500" />
                      {exam.registrationNumber}
                    </span>
                  )}

                  {exam.examDate?.date && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-indigo-400" />
                      Exam: {formatDate(exam.examDate.date)}
                    </span>
                  )}

                  {exam.applicationClosingDate?.date && exam.applicationStatus !== "submitted" && (
                    <span className="text-amber-400/90 font-medium">
                      Closes: {formatDate(exam.applicationClosingDate.date)}
                    </span>
                  )}

                  {exam.paymentStatus === "completed" && (
                    <span className="text-emerald-400 font-medium">
                      Paid ₹{exam.applicationFee}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  );
}
