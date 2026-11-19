import React from "react";
import Link from "next/link";
import { Plus, Upload, KeyRound, Compass, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export function QuickActions() {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <Link href="/examinations?action=new">
        <Button size="sm" className="gap-2 text-xs bg-indigo-600 hover:bg-indigo-500 font-semibold shadow-sm">
          <Plus className="w-3.5 h-3.5" />
          Add Examination
        </Button>
      </Link>

      <Link href="/documents?action=upload">
        <Button size="sm" variant="outline" className="gap-2 text-xs">
          <Upload className="w-3.5 h-3.5 text-blue-400" />
          Store Document
        </Button>
      </Link>

      <Link href="/vault?action=new">
        <Button size="sm" variant="outline" className="gap-2 text-xs">
          <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
          Save Portal Credentials
        </Button>
      </Link>

      <Link href="/discovery">
        <Button size="sm" variant="outline" className="gap-2 text-xs">
          <Compass className="w-3.5 h-3.5 text-indigo-400" />
          Browse Exams
        </Button>
      </Link>

      <Link href="/calendar">
        <Button size="sm" variant="outline" className="gap-2 text-xs">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          View Timeline
        </Button>
      </Link>
    </div>
  );
}
