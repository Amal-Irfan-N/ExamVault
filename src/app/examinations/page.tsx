"use client";

import React, { useState, useMemo } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { INITIAL_MOCK_EXAMINATIONS } from "@/data/mockExaminations";
import { StatusBadge, CertaintyBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import {
  GraduationCap,
  Plus,
  Search,
  Calendar,
  ExternalLink,
  Hash,
} from "lucide-react";

export default function ExaminationsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredExams = useMemo(() => {
    return INITIAL_MOCK_EXAMINATIONS.filter((exam) => {
      const matchesSearch =
        exam.examName.toLowerCase().includes(search.toLowerCase()) ||
        exam.recruitingOrg.toLowerCase().includes(search.toLowerCase()) ||
        exam.postName.toLowerCase().includes(search.toLowerCase()) ||
        (exam.registrationNumber &&
          exam.registrationNumber.toLowerCase().includes(search.toLowerCase()));

      const matchesCategory =
        selectedCategory === "all" || exam.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  const categories = ["all", "UPSC", "SSC", "ISRO", "GATE", "RRB", "DRDO", "State PSC"];

  return (
    <AppLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              My Examinations
            </h1>
            <Badge variant="outline" className="text-slate-400 border-[#232a3e]">
              {filteredExams.length} Total
            </Badge>
          </div>
          <p className="text-xs md:text-sm text-slate-400">
            Track and manage your applications, test dates, registration credentials, and results.
          </p>
        </div>

        <Button size="sm" className="gap-2 bg-indigo-600 hover:bg-indigo-500 font-semibold shadow-sm w-fit">
          <Plus className="w-4 h-4" />
          Add Examination
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-[#121620] border border-[#1e2536] space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative w-full md:flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <Input
              type="text"
              placeholder="Search by exam name, post, registration number or organization..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-[#0d1017] border-[#20283c] text-xs"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? "bg-indigo-600 text-white"
                    : "bg-[#0d1017] text-slate-400 hover:text-white border border-[#1e2536]"
                }`}
              >
                {cat === "all" ? "All Categories" : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Examinations List View */}
      <div className="space-y-3">
        {filteredExams.length === 0 ? (
          <div className="p-12 text-center rounded-xl bg-[#121620] border border-[#1e2536]">
            <GraduationCap className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-300">No examinations found</h3>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your search or category filter.</p>
          </div>
        ) : (
          filteredExams.map((exam) => (
            <Card
              key={exam.id}
              className="bg-[#121620] border-[#1e2536] hover:border-indigo-500/40 hover:bg-[#131825] transition-all"
            >
              <CardContent className="p-4 md:p-5">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left Column: Core details */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-white bg-indigo-500/15 border border-indigo-500/30 px-2 py-0.5 rounded">
                        {exam.recruitingOrg}
                      </span>
                      <Badge variant="outline" className="text-slate-400 border-[#252f47] text-[11px]">
                        {exam.category}
                      </Badge>
                      <span className="text-xs text-slate-500">Year {exam.recruitmentYear}</span>
                      <StatusBadge status={exam.status} />
                    </div>

                    <h3 className="text-base font-bold text-white tracking-tight">
                      {exam.examName}
                    </h3>

                    <p className="text-xs text-slate-300 font-medium">
                      Post: {exam.postName}
                    </p>

                    {exam.personalNotes && (
                      <p className="text-xs text-slate-400 italic line-clamp-1 bg-[#0b0e14]/50 p-1.5 rounded border border-[#1a2133] mt-1">
                        Note: {exam.personalNotes}
                      </p>
                    )}
                  </div>

                  {/* Middle Column: Key Dates & Identifiers */}
                  <div className="flex flex-wrap lg:flex-col items-start gap-2 text-xs text-slate-400 lg:border-l lg:border-[#1e2536] lg:pl-6 min-w-[200px]">
                    {exam.registrationNumber && (
                      <div className="flex items-center gap-1.5 font-mono text-slate-200">
                        <Hash className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-[11px] text-slate-400">Reg:</span>
                        <span>{exam.registrationNumber}</span>
                      </div>
                    )}

                    {exam.examDate?.date && (
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="text-slate-200 font-medium">
                          {formatDate(exam.examDate.date)}
                        </span>
                        <CertaintyBadge certainty={exam.examDate.certainty} />
                      </div>
                    )}

                    {exam.applicationClosingDate?.date && (
                      <div className="text-[11px] text-amber-400">
                        Deadline: {formatDate(exam.applicationClosingDate.date)}
                      </div>
                    )}
                  </div>

                  {/* Right Column: Actions */}
                  <div className="flex items-center gap-2 lg:flex-col lg:items-end flex-shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#1a2133]">
                    {exam.officialApplicationUrl && (
                      <a
                        href={exam.officialApplicationUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                      >
                        Official Portal <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    <Button size="sm" variant="secondary" className="text-xs h-8 px-3">
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </AppLayout>
  );
}
