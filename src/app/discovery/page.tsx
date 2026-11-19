"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { useExaminations } from "@/context/ExaminationContext";
import { ExamCategory } from "@/types/examination";
import {
  Search,
  Plus,
  Check,
  ExternalLink,
  GraduationCap,
  Users,
  RotateCcw,
} from "lucide-react";

interface DiscoverableExam {
  id: string;
  name: string;
  org: string;
  category: ExamCategory;
  sector: "Central Govt" | "State Govt" | "PSU / Autonomous" | "Defence" | "Banking";
  qualification: "Graduate" | "Engineering" | "10+2" | "Post Graduate" | "Diploma";
  qualificationDetail: string;
  postName: string;
  advertisementNumber: string;
  recruitmentYear: number;
  totalVacancies?: number;
  openingDate: string;
  closingDate: string;
  examDateTentative?: string;
  status: "open" | "upcoming" | "closing_soon";
  officialNotificationUrl: string;
  officialApplicationUrl: string;
  notes?: string;
}

const DISCOVERY_CATALOG: DiscoverableExam[] = [
  {
    id: "disc-1",
    name: "Civil Services Examination 2027",
    org: "UPSC",
    category: "UPSC",
    sector: "Central Govt",
    qualification: "Graduate",
    qualificationDetail: "Bachelor's Degree in any discipline from a recognized University",
    postName: "IAS, IPS, IFS, IRS and Central Group 'A' Services",
    advertisementNumber: "02/2027-CSP",
    recruitmentYear: 2027,
    totalVacancies: 1120,
    openingDate: "2027-02-10",
    closingDate: "2027-03-05",
    examDateTentative: "2027-05-23",
    status: "upcoming",
    officialNotificationUrl: "https://upsc.gov.in",
    officialApplicationUrl: "https://upsconline.nic.in",
    notes: "Preliminary examination date tentative as per annual calendar.",
  },
  {
    id: "disc-2",
    name: "Combined Defence Services (CDS) Examination-II 2026",
    org: "UPSC",
    category: "UPSC",
    sector: "Defence",
    qualification: "Graduate",
    qualificationDetail: "Degree in Engineering / Any discipline for IMA, INA, AFA, OTA",
    postName: "Commissioned Officers (Army, Navy, Air Force)",
    advertisementNumber: "10/2026-CDS-II",
    recruitmentYear: 2026,
    totalVacancies: 459,
    openingDate: "2026-05-15",
    closingDate: "2026-06-04",
    examDateTentative: "2026-09-06",
    status: "open",
    officialNotificationUrl: "https://upsc.gov.in",
    officialApplicationUrl: "https://upsconline.nic.in",
    notes: "Both men and women candidates eligible for Officers Training Academy (OTA).",
  },
  {
    id: "disc-3",
    name: "SBI Probationary Officers (PO) Recruitment 2026",
    org: "State Bank of India",
    category: "Banking",
    sector: "Banking",
    qualification: "Graduate",
    qualificationDetail: "Graduation in any discipline from a recognized university",
    postName: "Probationary Officer (Scale-I)",
    advertisementNumber: "CRPD/PO/2026-27/08",
    recruitmentYear: 2026,
    totalVacancies: 2000,
    openingDate: "2026-06-20",
    closingDate: "2026-07-15",
    examDateTentative: "2026-10-18",
    status: "open",
    officialNotificationUrl: "https://sbi.co.in/careers",
    officialApplicationUrl: "https://bank.sbi/careers",
    notes: "Preliminary and Main examination followed by Psychometric Evaluation and Interview.",
  },
  {
    id: "disc-4",
    name: "Assistant Central Intelligence Officer (ACIO-II/Exe)",
    org: "Intelligence Bureau (MHA)",
    category: "DRDO",
    sector: "Central Govt",
    qualification: "Graduate",
    qualificationDetail: "Graduation in any stream with basic computer operation knowledge",
    postName: "Assistant Central Intelligence Officer Grade-II/Executive",
    advertisementNumber: "IB/ACIO-II/2026",
    recruitmentYear: 2026,
    totalVacancies: 995,
    openingDate: "2026-07-01",
    closingDate: "2026-07-28",
    examDateTentative: "2026-10-25",
    status: "upcoming",
    officialNotificationUrl: "https://mha.gov.in",
    officialApplicationUrl: "https://cdn.digialm.com/mha",
    notes: "Tier-I Written Exam, Tier-II Descriptive Paper and Interview.",
  },
  {
    id: "disc-5",
    name: "Graduate Executive Trainee (GET) via GATE 2026",
    org: "NTPC Limited",
    category: "GATE",
    sector: "PSU / Autonomous",
    qualification: "Engineering",
    qualificationDetail: "Full time B.E. / B.Tech in Electrical, Mechanical, Civil, CS or Mining",
    postName: "Executive Trainee (E-1 Grade)",
    advertisementNumber: "04/2026-ET",
    recruitmentYear: 2026,
    totalVacancies: 280,
    openingDate: "2026-04-01",
    closingDate: "2026-04-30",
    status: "closing_soon",
    officialNotificationUrl: "https://careers.ntpc.co.in",
    officialApplicationUrl: "https://careers.ntpc.co.in",
    notes: "Shortlisting based on GATE 2026 performance followed by document verification.",
  },
  {
    id: "disc-6",
    name: "DRDO CEPTAM-11 Senior Technical Assistant (STA-B)",
    org: "DRDO",
    category: "DRDO",
    sector: "Central Govt",
    qualification: "Engineering",
    qualificationDetail: "B.Sc or 3-Year Diploma in Engineering / CS / Electronics / Mechanical",
    postName: "Senior Technical Assistant 'B'",
    advertisementNumber: "CEPTAM-11/2026",
    recruitmentYear: 2026,
    totalVacancies: 1920,
    openingDate: "2026-04-10",
    closingDate: "2026-05-05",
    examDateTentative: "2026-07-20",
    status: "open",
    officialNotificationUrl: "https://drdo.gov.in/ceptam",
    officialApplicationUrl: "https://drdo.gov.in/ceptam-application",
    notes: "Tier-I CBT for screening followed by Tier-II CBT for final selection.",
  },
  {
    id: "disc-7",
    name: "Railway Recruitment Board Assistant Loco Pilot (ALP) 2026",
    org: "Railway (RRB)",
    category: "RRB",
    sector: "Central Govt",
    qualification: "Diploma",
    qualificationDetail: "Matriculation + ITI in specified trades or 3-year Diploma in Engineering",
    postName: "Assistant Loco Pilot (Level-2)",
    advertisementNumber: "CEN 01/2026",
    recruitmentYear: 2026,
    totalVacancies: 5696,
    openingDate: "2026-01-20",
    closingDate: "2026-02-19",
    examDateTentative: "2026-08-15",
    status: "upcoming",
    officialNotificationUrl: "https://indianrailways.gov.in",
    officialApplicationUrl: "https://rrbapply.gov.in",
    notes: "CBT-1, CBT-2, Computer Based Aptitude Test (CBAT) and Document Verification.",
  },
  {
    id: "disc-8",
    name: "RBI Grade 'B' Officers Recruitment 2026",
    org: "Reserve Bank of India",
    category: "Banking",
    sector: "Banking",
    qualification: "Graduate",
    qualificationDetail: "Graduation in any discipline with minimum 60% marks (50% for SC/ST)",
    postName: "Officers in Grade 'B' (General / DEPR / DSIM)",
    advertisementNumber: "RBI/2026-27/02",
    recruitmentYear: 2026,
    totalVacancies: 291,
    openingDate: "2026-05-20",
    closingDate: "2026-06-18",
    examDateTentative: "2026-09-12",
    status: "upcoming",
    officialNotificationUrl: "https://rbi.org.in/careers",
    officialApplicationUrl: "https://rbi.org.in",
    notes: "Phase-I Online Exam, Phase-II Descriptive Papers, followed by Interview.",
  },
];

export default function DiscoveryPage() {
  const { examinations, addExamination } = useExaminations();

  const [search, setSearch] = useState("");
  const [selectedQualification, setSelectedQualification] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSector, setSelectedSector] = useState("all");
  const [importingId, setImportingId] = useState<string | null>(null);

  const qualifications = [
    { id: "all", label: "All Qualifications" },
    { id: "Graduate", label: "Any Graduate" },
    { id: "Engineering", label: "B.Tech / Engineering" },
    { id: "Diploma", label: "Diploma / Technical" },
    { id: "10+2", label: "10+2 / Intermediate" },
    { id: "Post Graduate", label: "Post Graduate" },
  ];

  const categories = ["all", "UPSC", "SSC", "Banking", "DRDO", "GATE", "RRB"];
  const sectors = ["all", "Central Govt", "State Govt", "PSU / Autonomous", "Defence", "Banking"];

  // Filtered Discovery Catalog
  const filteredExams = useMemo(() => {
    return DISCOVERY_CATALOG.filter((item) => {
      // Qualification filter
      if (selectedQualification !== "all" && item.qualification !== selectedQualification) {
        return false;
      }
      // Category filter
      if (selectedCategory !== "all" && item.category !== selectedCategory) {
        return false;
      }
      // Sector filter
      if (selectedSector !== "all" && item.sector !== selectedSector) {
        return false;
      }
      // Search filter
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchOrg = item.org.toLowerCase().includes(q);
        const matchPost = item.postName.toLowerCase().includes(q);
        const matchQual = item.qualificationDetail.toLowerCase().includes(q);
        if (!matchName && !matchOrg && !matchPost && !matchQual) {
          return false;
        }
      }
      return true;
    });
  }, [selectedQualification, selectedCategory, selectedSector, search]);

  // Check if an exam is already in user's vault
  const isAlreadyInVault = (item: DiscoverableExam): boolean => {
    return examinations.some(
      (e) =>
        e.examName.toLowerCase() === item.name.toLowerCase() ||
        (e.advertisementNumber && e.advertisementNumber === item.advertisementNumber)
    );
  };

  // Find the existing exam in vault if already tracked
  const getExistingExam = (item: DiscoverableExam) => {
    return examinations.find(
      (e) =>
        e.examName.toLowerCase() === item.name.toLowerCase() ||
        (e.advertisementNumber && e.advertisementNumber === item.advertisementNumber)
    );
  };

  // One-click import into Vault
  const handleImportToVault = (item: DiscoverableExam) => {
    if (isAlreadyInVault(item)) return;

    setImportingId(item.id);

    addExamination({
      examName: item.name,
      recruitingOrg: item.org,
      category: item.category,
      postName: item.postName,
      advertisementNumber: item.advertisementNumber,
      recruitmentYear: item.recruitmentYear,
      officialNotificationUrl: item.officialNotificationUrl,
      officialApplicationUrl: item.officialApplicationUrl,
      applicationClosingDate: {
        date: item.closingDate,
        certainty: "confirmed",
      },
      examDate: item.examDateTentative
        ? {
            date: item.examDateTentative,
            certainty: "tentative",
          }
        : undefined,
      status: item.status === "open" ? "notification_released" : "interested",
      applicationStatus: "not_started",
      paymentStatus: "pending",
      isArchived: false,
      personalNotes: `Imported from Exam Discovery Hub. Required Qualification: ${item.qualificationDetail}`,
    });

    setTimeout(() => {
      setImportingId(null);
    }, 600);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
                Exam Discovery Hub
              </h1>
              <Badge variant="outline" className="text-indigo-300 border-indigo-500/30">
                Verified Notifications
              </Badge>
            </div>
            <p className="text-xs text-slate-400">
              Discover official UPSC, SSC, Banking, Defence, Railway and PSU recruitment notices and add them to your vault with one click.
            </p>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="p-4 rounded-xl bg-[#121620] border border-[#1e2536] space-y-3">
          <div className="flex flex-col md:flex-row items-center gap-3">
            {/* Search */}
            <div className="relative w-full md:flex-1">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <Input
                type="text"
                placeholder="Search by exam name, post, organization or qualification..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-[#0d1017] border-[#20283c] text-xs"
              />
            </div>

            {/* Category Filter */}
            <div className="w-full md:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="flex h-9 w-full rounded-lg border border-[#20283c] bg-[#0d1017] px-3 py-1 text-xs text-slate-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "all" ? "All Categories" : cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Sector Filter */}
            <div className="w-full md:w-48">
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="flex h-9 w-full rounded-lg border border-[#20283c] bg-[#0d1017] px-3 py-1 text-xs text-slate-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
              >
                {sectors.map((sec) => (
                  <option key={sec} value={sec}>
                    {sec === "all" ? "All Sectors" : sec}
                  </option>
                ))}
              </select>
            </div>

            {(search || selectedCategory !== "all" || selectedSector !== "all" || selectedQualification !== "all") && (
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("all");
                  setSelectedSector("all");
                  setSelectedQualification("all");
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-amber-300 bg-[#0d1017] border border-[#20283c] text-xs transition-colors self-end md:self-auto"
                title="Reset filters"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            )}
          </div>

          {/* Qualification Filters Scrollable Row */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none">
            {qualifications.map((q) => (
              <button
                key={q.id}
                onClick={() => setSelectedQualification(q.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  selectedQualification === q.id
                    ? "bg-indigo-600 text-white"
                    : "bg-[#0d1017] text-slate-400 hover:text-white border border-[#1e2536]"
                }`}
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>

        {/* Discovery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredExams.length === 0 ? (
            <div className="col-span-full p-12 text-center rounded-2xl bg-[#121620] border border-[#1e2536]">
              <Search className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-slate-300">No examinations found</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Try selecting different qualification criteria or resetting your search filters.
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSearch("");
                  setSelectedQualification("all");
                  setSelectedCategory("all");
                  setSelectedSector("all");
                }}
                className="text-xs"
              >
                Reset All Filters
              </Button>
            </div>
          ) : (
            filteredExams.map((item) => {
              const inVault = isAlreadyInVault(item);
              const existingRecord = inVault ? getExistingExam(item) : null;
              const isImporting = importingId === item.id;

              return (
                <Card
                  key={item.id}
                  className="bg-[#121620] border-[#1e2536] hover:border-indigo-500/40 hover:bg-[#131825] transition-all flex flex-col justify-between group"
                >
                  <CardContent className="p-4 sm:p-5 space-y-3.5">
                    {/* Header Badges */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white bg-indigo-500/15 border border-indigo-500/30 px-2 py-0.5 rounded">
                          {item.org}
                        </span>
                        <Badge variant="outline" className="text-[10px] text-slate-400 border-[#242e47]">
                          {item.sector}
                        </Badge>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          item.status === "open"
                            ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                            : item.status === "closing_soon"
                            ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                            : "bg-blue-500/15 text-blue-300 border border-blue-500/30"
                        }`}
                      >
                        {item.status.replace("_", " ")}
                      </span>
                    </div>

                    {/* Examination Title & Post */}
                    <div>
                      <h3 className="text-base font-bold text-white tracking-tight leading-snug group-hover:text-indigo-300 transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-xs text-slate-300 font-medium mt-1">
                        Post: <span className="text-indigo-300">{item.postName}</span>
                      </p>
                    </div>

                    {/* Vacancies & Qualification */}
                    <div className="p-3 rounded-xl bg-[#0b0e14] border border-[#1e2536] space-y-2 text-xs">
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="flex items-center gap-1.5 text-slate-400">
                          <Users className="w-3.5 h-3.5 text-indigo-400" />
                          Total Vacancies:
                        </span>
                        <span className="font-bold text-white font-mono">
                          {item.totalVacancies ? item.totalVacancies.toLocaleString() : "Not specified"}
                        </span>
                      </div>

                      <div className="flex items-start gap-1.5 text-slate-300 pt-1 border-t border-[#182030]">
                        <GraduationCap className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="text-[11px] leading-relaxed text-slate-300">
                          {item.qualificationDetail}
                        </span>
                      </div>
                    </div>

                    {/* Deadlines & Tentative Dates */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                      <div>
                        <span className="text-slate-500 block">Application Deadline</span>
                        <span className="text-amber-400 font-medium">
                          {formatDate(item.closingDate)}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-500 block">Tentative Exam Date</span>
                        <span className="text-slate-200 font-medium">
                          {item.examDateTentative ? formatDate(item.examDateTentative) : "To be notified"}
                        </span>
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="pt-2 border-t border-[#1a2133] flex flex-wrap items-center justify-between gap-2">
                      <a
                        href={item.officialNotificationUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white font-medium"
                      >
                        Official Notice <ExternalLink className="w-3 h-3" />
                      </a>

                      {inVault ? (
                        <div className="flex items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                            <Check className="w-3 h-3" /> Tracked in Vault
                          </span>

                          {existingRecord && (
                            <Link href={`/examinations/${existingRecord.id}`}>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs h-7 px-2 border-[#242f47] text-indigo-400 hover:text-indigo-300"
                              >
                                View
                              </Button>
                            </Link>
                          )}
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          disabled={isImporting}
                          onClick={() => handleImportToVault(item)}
                          className="text-xs h-8 px-3.5 bg-indigo-600 hover:bg-indigo-500 font-semibold gap-1.5 cursor-pointer shadow-lg shadow-indigo-950/40"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          {isImporting ? "Adding to Vault..." : "Track Examination"}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </AppLayout>
  );
}
