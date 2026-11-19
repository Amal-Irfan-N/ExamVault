"use client";

import React from "react";
import { AuthProvider } from "@/context/AuthContext";
import { ExaminationProvider } from "@/context/ExaminationContext";
import { DocumentProvider } from "@/context/DocumentContext";
import { VaultProvider } from "@/context/VaultContext";
import { MonitoringProvider } from "@/context/MonitoringContext";
import { OfflineProvider } from "@/context/OfflineContext";
import { CommandPalette } from "@/components/navigation/command-palette";
import { QuickAddModal } from "@/components/examinations/quick-add-modal";
import { AuthModal } from "@/components/auth/auth-modal";
import { OfflineStorageModal } from "@/components/offline/offline-storage-modal";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <OfflineProvider>
      <AuthProvider>
        <ExaminationProvider>
          <DocumentProvider>
            <VaultProvider>
              <MonitoringProvider>
                {children}
                <CommandPalette />
                <QuickAddModal />
                <AuthModal />
                <OfflineStorageModal />
              </MonitoringProvider>
            </VaultProvider>
          </DocumentProvider>
        </ExaminationProvider>
      </AuthProvider>
    </OfflineProvider>
  );
}
