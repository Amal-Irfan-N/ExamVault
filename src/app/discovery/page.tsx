"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  Plus,
  Check,
  ExternalLink,
} from "lucide-react";

interface DiscoverableExam {
  id: string;
  name: string;
  org: string;
  category: string;
  qualification: string;
  totalVacancies?: number;
  deadline: string;
  notificationDate: string;
  status: "open" | "upcoming" | "closing_soon";
  sourceUrl: string;
  isAdded: boolean;
}

const DISCOVERY_RECORDS: DiscoverableExam[] = [
  {
    id: "disc-1",
    name: "Civil Services Examination 2027",
    org: "UPSC",
    category: "UPSC",
    qualification: "Bachelor's Degree in any discipline",
    totalVacancies: 1050,
    deadline: "2027-03-02",
    notificationDate: "2027-02-10",
    status: "upcoming",
    sourceUrl: "https://upsc.gov.in",
    isAdded: false,
  },
  {
    id: "disc-2",
    name: "Combined Defence Services (CDS) Examination-II",
    org: "UPSC",
    category: "Defence",
    qualification: "Degree / B.Tech (as per academy)",
    totalVacancies: 459,
    deadline: "2026-06-04",
    notificationDate: "2026-05-15",
    status: "open",
    sourceUrl: "https://upsc.gov.in",
    isAdded: false,
  },
  {
    id: "disc-3",
    name: "SBI Probationary Officers (PO) Recruitment 2026",
    org: "State Bank of India",
    category: "Banking",
    qualification: "Graduation in any discipline",
    totalVacancies: 2000,
    deadline: "2026-07-15",
    notificationDate: "2026-06-20",
    status: "open",
    sourceUrl: "https://sbi.co.in/careers",
    isAdded: false,
  },
  {
    id: "disc-4",
    name: "Assistant Central Intelligence Officer (ACIO-II/Exe)",
    org: "Intelligence Bureau (MHA)",
    category: "Defence",
    qualification: "Graduation or equivalent",
    totalVacancies: 995,
    deadline: "2026-08-10",
    notificationDate: "2026-07-01",
    status: "upcoming",
    sourceUrl: "https://mha.gov.in",
    isAdded: false,
  },
  {
    id: "disc-5",
    name: "Graduate Executive Trainee (GET) via GATE 2026",
    org: "NTPC Limited",
    category: "PSU",
    qualification: "B.E. / B.Tech in relevant engineering discipline",
    totalVacancies: 280,
    deadline: "2026-04-30",
    notificationDate: "2026-04-01",
    status: "closing_soon",
    sourceUrl: "https://careers.ntpc.co.in",
    isAdded: false,
  },
];

export default function DiscoveryPage() {
  const [exams, setExams] = useState(DISCOVERY_RECORDS);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = ["all", "UPSC", "Defence", "Banking", "PSU", "SSC", "ISRO"];

  const handleToggleAdd = (id: string) => {
    setExams((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isAdded: !item.isAdded } : item
      )
    );
  };

  const filtered = exams.filter((e) => {
    const matchesSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.org.toLowerCase().includes(search.toLowerCase()) ||
      e.qualification.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || e.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              Exam Discovery Hub
            </h1>
            <Badge variant="outline" className="text-indigo-300 border-indigo-500/30">
              Verified Sources Only
            </Badge>
          </div>
          <p className="text-xs md:text-sm text-slate-400">
            Browse verified competitive exam notifications from official recruitment boards and PSU portals.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-4 rounded-xl bg-[#121620] border border-[#1e2536] space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative w-full md:flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <Input
              type="text"
              placeholder="Search by exam, organization, or minimum qualification..."
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
                {cat === "all" ? "All Sectors" : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Discovery List */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <Card
            key={item.id}
            className="bg-[#121620] border-[#1e2536] hover:border-[#27344d] transition-all"
          >
            <CardContent className="p-4 md:p-5">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-white bg-[#1a2133] px-2 py-0.5 rounded border border-[#27324a]">
                      {item.org}
                    </span>
                    <Badge variant="outline" className="text-slate-400 border-[#242e47] text-[11px]">
                      {item.category}
                    </Badge>
                    {item.status === "closing_soon" && (
                      <Badge variant="destructive" className="text-[10px]">
                        Closing Soon
                      </Badge>
                    )}
                    {item.status === "open" && (
                      <Badge variant="success" className="text-[10px]">
                        Applications Open
                      </Badge>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white tracking-tight">
                    {item.name}
                  </h3>

                  <p className="text-xs text-slate-300">
                    <span className="text-slate-500 font-medium">Eligibility: </span>
                    {item.qualification}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 pt-1">
                    {item.totalVacancies && (
                      <span>Vacancies: <strong className="text-slate-200">{item.totalVacancies}</strong></span>
                    )}
                    <span>Deadline: <strong className="text-amber-400">{item.deadline}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-3 lg:flex-col lg:items-end flex-shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#1a2133]">
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                  >
                    Official Portal <ExternalLink className="w-3 h-3" />
                  </a>

                  <Button
                    size="sm"
                    variant={item.isAdded ? "secondary" : "default"}
                    onClick={() => handleToggleAdd(item.id)}
                    className="text-xs h-8 px-3 gap-1.5"
                  >
                    {item.isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        Added to My Exams
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        Track Exam
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppLayout>
  );
}
