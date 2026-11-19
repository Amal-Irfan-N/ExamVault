"use client";

import React from "react";
import { AuthProvider } from "@/context/AuthContext";
import { ExaminationProvider } from "@/context/ExaminationContext";
import { DocumentProvider } from "@/context/DocumentContext";
import { VaultProvider } from "@/context/VaultContext";
import { MonitoringProvider } from "@/context/MonitoringContext";
import { CommandPalette } from "@/components/navigation/command-palette";
import { QuickAddModal } from "@/components/examinations/quick-add-modal";
import { AuthModal } from "@/components/auth/auth-modal";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ExaminationProvider>
        <DocumentProvider>
          <VaultProvider>
            <MonitoringProvider>
              {children}
              <CommandPalette />
              <QuickAddModal />
              <AuthModal />
            </MonitoringProvider>
          </VaultProvider>
        </DocumentProvider>
      </ExaminationProvider>
    </AuthProvider>
  );
}
