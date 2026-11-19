"use client";

import React, { useState, useMemo } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useVault } from "@/context/VaultContext";
import { VaultLockScreen } from "@/components/vault/vault-lock-screen";
import { CredentialCard } from "@/components/vault/credential-card";
import { AddCredentialModal } from "@/components/vault/add-credential-modal";
import { EditCredentialModal } from "@/components/vault/edit-credential-modal";
import { DeleteCredentialModal } from "@/components/vault/delete-credential-modal";
import { VaultCredential } from "@/types/credential";
import {
  Lock,
  Plus,
  Search,
  KeyRound,
  RotateCcw,
  Clock,
} from "lucide-react";

export default function VaultPage() {
  const {
    isUnlocked,
    credentials,
    remainingSeconds,
    lockVault,
    deleteCredential,
  } = useVault();

  const [search, setSearch] = useState("");
  const [selectedOrg, setSelectedOrg] = useState("all");

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingCred, setEditingCred] = useState<VaultCredential | null>(null);
  const [deletingCred, setDeletingCred] = useState<VaultCredential | null>(null);

  // Format countdown mm:ss
  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const orgs = ["all", "UPSC", "SSC", "ISRO", "GATE / GOAPS", "NTA", "State PSC", "IBPS / Banking"];

  const filteredCredentials = useMemo(() => {
    return credentials.filter((cred) => {
      // Org filter
      if (selectedOrg !== "all" && !cred.org.toLowerCase().includes(selectedOrg.toLowerCase())) {
        return false;
      }
      // Search filter
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchOrg = cred.org.toLowerCase().includes(q);
        const matchPortal = cred.portalName.toLowerCase().includes(q);
        const matchUser = cred.username.toLowerCase().includes(q);
        const matchReg = cred.registrationNumber?.toLowerCase().includes(q);
        const matchApp = cred.applicationNumber?.toLowerCase().includes(q);
        const matchNotes = cred.securityNotes?.toLowerCase().includes(q);
        if (!matchOrg && !matchPortal && !matchUser && !matchReg && !matchApp && !matchNotes) {
          return false;
        }
      }
      return true;
    });
  }, [credentials, selectedOrg, search]);

  return (
    <AppLayout>
      {!isUnlocked ? (
        <VaultLockScreen />
      ) : (
        <div className="space-y-6">
          {/* Unlocked Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-[#121622] border border-[#232b3f] shadow-xl">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Vault Unlocked (AES-GCM 256)
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {credentials.length} credentials stored
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Password & Credential Vault
              </h1>
              <p className="text-xs text-slate-400">
                End-to-end client encrypted portal logins, OTR credentials and registration keys
              </p>
            </div>

            {/* Auto-lock countdown & Lock Button */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <div className="flex items-center gap-1.5 bg-[#0b0e14] px-3 py-1.5 rounded-xl border border-[#1e2536] text-xs">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] text-slate-400">Auto-lock:</span>
                <span className="font-mono font-bold text-amber-300">
                  {formatCountdown(remainingSeconds)}
                </span>
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={lockVault}
                className="text-xs h-9 px-3 gap-1.5 border-[#28334b] text-slate-300 hover:text-white cursor-pointer"
                title="Immediately Lock Vault and Purge Keys"
              >
                <Lock className="w-3.5 h-3.5 text-indigo-400" />
                Lock Vault
              </Button>

              <Button
                size="sm"
                onClick={() => setIsAddOpen(true)}
                className="text-xs h-9 px-4 bg-indigo-600 hover:bg-indigo-500 font-semibold gap-1.5 cursor-pointer shadow-lg shadow-indigo-950/40"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Credential
              </Button>
            </div>
          </div>

          {/* Search and Organization Filters */}
          <div className="p-4 rounded-xl bg-[#121620] border border-[#1e2536] space-y-3">
            <div className="flex flex-col md:flex-row items-center gap-3">
              {/* Search Bar */}
              <div className="relative w-full md:flex-1">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <Input
                  type="text"
                  placeholder="Search credentials by portal, organization, username, registration ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 bg-[#0d1017] border-[#20283c] text-xs"
                />
              </div>

              {/* Filter Chips */}
              <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                {orgs.map((org) => (
                  <button
                    key={org}
                    onClick={() => setSelectedOrg(org)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                      selectedOrg === org
                        ? "bg-indigo-600 text-white"
                        : "bg-[#0d1017] text-slate-400 hover:text-white border border-[#1e2536]"
                    }`}
                  >
                    {org === "all" ? "All Portals" : org}
                  </button>
                ))}

                {(search || selectedOrg !== "all") && (
                  <button
                    onClick={() => {
                      setSearch("");
                      setSelectedOrg("all");
                    }}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-amber-300 bg-[#0d1017] border border-[#1e2536] text-xs transition-colors"
                    title="Reset filters"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Credentials Grid */}
          {filteredCredentials.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[#121620] border border-[#1e2536]">
              <KeyRound className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-slate-300">No credentials found</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                {search || selectedOrg !== "all"
                  ? "Try adjusting your search query or organization filter."
                  : "Save your first examination portal login, registration credentials, and recovery keys."}
              </p>
              <Button
                size="sm"
                onClick={() => setIsAddOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-500 gap-1.5 text-xs font-semibold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add New Credential
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCredentials.map((cred) => (
                <CredentialCard
                  key={cred.id}
                  credential={cred}
                  onEdit={(c) => setEditingCred(c)}
                  onDelete={(c) => setDeletingCred(c)}
                />
              ))}
            </div>
          )}

          {/* Modals */}
          <AddCredentialModal
            isOpen={isAddOpen}
            onClose={() => setIsAddOpen(false)}
          />

          <EditCredentialModal
            isOpen={Boolean(editingCred)}
            credential={editingCred}
            onClose={() => setEditingCred(null)}
          />

          <DeleteCredentialModal
            isOpen={Boolean(deletingCred)}
            portalName={deletingCred?.portalName || ""}
            username={deletingCred?.username || ""}
            onConfirm={async () => {
              if (deletingCred) {
                await deleteCredential(deletingCred.id);
                setDeletingCred(null);
              }
            }}
            onClose={() => setDeletingCred(null)}
          />
        </div>
      )}
    </AppLayout>
  );
}
