"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tags, Plus, Trash2, RotateCcw, Check, AlertCircle } from "lucide-react";
import { useExaminations } from "@/context/ExaminationContext";

interface CategoryManagerDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CategoryManagerDialog({ isOpen, onClose }: CategoryManagerDialogProps) {
  const { categories, addCategory, removeCategory, resetCategories, examinations } = useExaminations();
  const [newCatName, setNewCatName] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Calculate number of examinations per category
  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    for (const cat of categories) {
      counts[cat] = 0;
    }
    for (const exam of examinations) {
      if (exam.category) {
        counts[exam.category] = (counts[exam.category] || 0) + 1;
      }
    }
    return counts;
  }, [categories, examinations]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const trimmed = newCatName.trim();
    if (!trimmed) {
      setErrorMsg("Please enter a category name");
      return;
    }

    if (categories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      setErrorMsg(`Category "${trimmed}" already exists`);
      return;
    }

    const success = addCategory(trimmed);
    if (success) {
      setNewCatName("");
      setSuccessMsg(`Category "${trimmed}" added!`);
      setTimeout(() => setSuccessMsg(null), 3000);
    }
  };

  const handleRemove = (cat: string) => {
    setErrorMsg(null);
    removeCategory(cat);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md bg-[#0f131c] border-[#1e2536] text-white p-6 shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
              <Tags className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-white tracking-tight">
                Manage Categories
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400">
                Add custom categories or remove tags to organize your recruitment targets.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Add Category Form */}
        <form onSubmit={handleAdd} className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="e.g. UPSC Mains, Railway RRB, Defence..."
              value={newCatName}
              onChange={(e) => {
                setNewCatName(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              className="bg-[#0b0e14] border-[#1e2536] text-xs h-9"
              autoFocus
            />
            <Button
              type="submit"
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs h-9 px-3 gap-1.5 shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add
            </Button>
          </div>

          {errorMsg && (
            <div className="flex items-center gap-1.5 text-rose-400 text-xs">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs">
              <Check className="w-3.5 h-3.5" />
              <span>{successMsg}</span>
            </div>
          )}
        </form>

        {/* Categories List */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Current Categories ({categories.length})</span>
            <button
              type="button"
              onClick={resetCategories}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-indigo-400 transition-colors cursor-pointer"
              title="Restore standard competitive examination categories"
            >
              <RotateCcw className="w-3 h-3" />
              Reset to Defaults
            </button>
          </div>

          <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1 divide-y divide-[#182030] rounded-xl border border-[#1e2536] bg-[#0b0e14] p-2">
            {categories.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500">
                No categories available. Add one above or reset to defaults.
              </div>
            ) : (
              categories.map((cat) => {
                const count = categoryCounts[cat] || 0;
                return (
                  <div
                    key={cat}
                    className="flex items-center justify-between py-2 px-2.5 rounded-lg hover:bg-[#121620] transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-slate-200">{cat}</span>
                      <Badge
                        variant="outline"
                        className="text-[10px] py-0 px-1.5 text-slate-500 border-[#222b40]"
                      >
                        {count} {count === 1 ? "exam" : "exams"}
                      </Badge>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemove(cat)}
                      className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors opacity-70 group-hover:opacity-100 cursor-pointer"
                      title={`Remove "${cat}" category`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-3 border-t border-[#1e2536]">
          <Button
            type="button"
            onClick={onClose}
            className="text-xs h-8 px-4 bg-indigo-600 hover:bg-indigo-500 font-semibold cursor-pointer"
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
