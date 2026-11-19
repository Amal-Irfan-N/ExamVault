"use client";

import React from "react";
import { ExaminationProvider } from "@/context/ExaminationContext";
import { CommandPalette } from "@/components/navigation/command-palette";
import { QuickAddModal } from "@/components/examinations/quick-add-modal";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ExaminationProvider>
      {children}
      <CommandPalette />
      <QuickAddModal />
    </ExaminationProvider>
  );
}
