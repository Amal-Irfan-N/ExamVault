"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import {
  Upload,
  Search,
  FileText,
  Download,
  Eye,
  Camera,
} from "lucide-react";

interface ExamDocument {
  id: string;
  name: string;
  examName: string;
  category: string;
  fileType: "pdf" | "image";
  fileSize: string;
  uploadedAt: string;
}

const INITIAL_DOCS: ExamDocument[] = [
  {
    id: "doc-1",
    name: "UPSC_CSE_2026_Application_Form.pdf",
    examName: "UPSC CSE Preliminary 2026",
    category: "Application Form",
    fileType: "pdf",
    fileSize: "1.4 MB",
    uploadedAt: "2026-02-28",
  },
  {
    id: "doc-2",
    name: "UPSC_Fee_Payment_Challan_₹100.pdf",
    examName: "UPSC CSE Preliminary 2026",
    category: "Payment Receipt",
    fileType: "pdf",
    fileSize: "420 KB",
    uploadedAt: "2026-02-28",
  },
  {
    id: "doc-3",
    name: "ISRO_ICRB_HallTicket_ScientistSC.pdf",
    examName: "ISRO Scientist/Engineer 'SC'",
    category: "Hall Ticket / Admit Card",
    fileType: "pdf",
    fileSize: "850 KB",
    uploadedAt: "2026-04-05",
  },
  {
    id: "doc-4",
    name: "GATE_2026_Official_Scorecard_CS.pdf",
    examName: "GATE 2026 (CS & IT)",
    category: "Scorecard",
    fileType: "pdf",
    fileSize: "612 KB",
    uploadedAt: "2026-03-25",
  },
  {
    id: "doc-5",
    name: "State_PSC_Mains_Admit_Card_Signed.jpg",
    examName: "State PSC Combined 2025",
    category: "Hall Ticket / Admit Card",
    fileType: "image",
    fileSize: "2.1 MB",
    uploadedAt: "2025-11-10",
  },
];

export default function DocumentsPage() {
  const [documents] = useState(INITIAL_DOCS);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    "all",
    "Application Form",
    "Payment Receipt",
    "Hall Ticket / Admit Card",
    "Scorecard",
  ];

  const filtered = documents.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.examName.toLowerCase().includes(search.toLowerCase());
    const matchesCat =
      selectedCategory === "all" || doc.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              Document Vault
            </h1>
            <Badge variant="outline" className="text-emerald-400 border-emerald-500/30">
              Private Encrypted Storage
            </Badge>
          </div>
          <p className="text-xs md:text-sm text-slate-400">
            Securely store official notifications, application confirmations, admit cards, and scorecards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="gap-2 text-xs h-9">
            <Camera className="w-4 h-4 text-slate-400" />
            Scan via Camera
          </Button>
          <Button size="sm" className="gap-2 bg-indigo-600 hover:bg-indigo-500 font-semibold text-xs h-9">
            <Upload className="w-4 h-4" />
            Upload File
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-4 rounded-xl bg-[#121620] border border-[#1e2536] space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative w-full md:flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <Input
              type="text"
              placeholder="Search documents by filename or examination..."
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
                {cat === "all" ? "All Documents" : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Document Grid / Table */}
      <div className="space-y-3">
        {filtered.map((doc) => (
          <Card
            key={doc.id}
            className="bg-[#121620] border-[#1e2536] hover:border-[#28344e] transition-all"
          >
            <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex-shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-white truncate">
                    {doc.name}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs text-slate-400">
                    <span className="text-slate-300 font-medium">{doc.examName}</span>
                    <span>•</span>
                    <Badge variant="outline" className="text-[10px] py-0 border-[#252f47]">
                      {doc.category}
                    </Badge>
                    <span>•</span>
                    <span>{doc.fileSize}</span>
                    <span>•</span>
                    <span>{formatDate(doc.uploadedAt)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#1a2133]">
                <Button size="sm" variant="secondary" className="h-8 px-2.5 text-xs gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  Preview
                </Button>
                <Button size="sm" variant="outline" className="h-8 px-2.5 text-xs gap-1">
                  <Download className="w-3.5 h-3.5" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppLayout>
  );
}
