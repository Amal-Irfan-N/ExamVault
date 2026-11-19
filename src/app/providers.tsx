"use client";

import React from "react";
import { AuthProvider } from "@/context/AuthContext";
import { ExaminationProvider } from "@/context/ExaminationContext";
import { CommandPalette } from "@/components/navigation/command-palette";
import { QuickAddModal } from "@/components/examinations/quick-add-modal";
import { AuthModal } from "@/components/auth/auth-modal";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ExaminationProvider>
        {children}
        <CommandPalette />
        <QuickAddModal />
        <AuthModal />
      </ExaminationProvider>
    </AuthProvider>
  );
}
