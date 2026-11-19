"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Shield,
  Copy,
  Check,
  Lock,
  Plus,
  ExternalLink,
  Search,
} from "lucide-react";

interface VaultCredential {
  id: string;
  org: string;
  portalName: string;
  portalUrl: string;
  username: string;
  maskedPassword: string;
  registrationNumber: string;
  applicationNumber: string;
  registeredEmail: string;
  registeredMobile: string;
  notes: string;
}

const MOCK_CREDENTIALS: VaultCredential[] = [
  {
    id: "cred-1",
    org: "UPSC",
    portalName: "UPSC OTR & Online Application",
    portalUrl: "https://upsconline.nic.in",
    username: "OTR-IND-88401920",
    maskedPassword: "••••••••••••••••",
    registrationNumber: "RID-893041829",
    applicationNumber: "UPSC2026987412",
    registeredEmail: "aman.verma.exam@gmail.com",
    registeredMobile: "+91 98765 43210",
    notes: "OTR security question: First school attended.",
  },
  {
    id: "cred-2",
    org: "SSC",
    portalName: "SSC One Time Registration Portal",
    portalUrl: "https://ssc.gov.in",
    username: "SSC-OTR-88401923",
    maskedPassword: "••••••••••••••••",
    registrationNumber: "SSC-OTR-88401923",
    applicationNumber: "SSC-CGL-2026-90184",
    registeredEmail: "aman.verma.exam@gmail.com",
    registeredMobile: "+91 98765 43210",
    notes: "Requires mandatory live face verification during login.",
  },
  {
    id: "cred-3",
    org: "IIT GATE / GOAPS",
    portalName: "GOAPS 2026 Candidate Portal",
    portalUrl: "https://goaps.iitr.ac.in",
    username: "CS26S4109281",
    maskedPassword: "••••••••••••••••",
    registrationNumber: "GOAPS-992102",
    applicationNumber: "CS26S4109281",
    registeredEmail: "aman.verma.exam@gmail.com",
    registeredMobile: "+91 98765 43210",
    notes: "Password changed in Dec 2025.",
  },
];

export default function VaultPage() {
  const [credentials] = useState(MOCK_CREDENTIALS);
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = credentials.filter(
    (c) =>
      c.org.toLowerCase().includes(search.toLowerCase()) ||
      c.portalName.toLowerCase().includes(search.toLowerCase()) ||
      c.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              Password & Credential Vault
            </h1>
            <Badge variant="outline" className="text-emerald-400 border-emerald-500/30">
              Zero-Knowledge AES-GCM
            </Badge>
          </div>
          <p className="text-xs md:text-sm text-slate-400">
            Client-side encrypted vault for official examination recruitment portals, OTR IDs, and passwords.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="text-xs h-9 gap-1.5 text-amber-400 border-amber-500/30">
            <Lock className="w-3.5 h-3.5" />
            Lock Vault
          </Button>
          <Button size="sm" className="gap-2 bg-indigo-600 hover:bg-indigo-500 font-semibold text-xs h-9">
            <Plus className="w-4 h-4" />
            Save New Portal Login
          </Button>
        </div>
      </div>

      {/* Security Info Card */}
      <Card className="bg-[#121620] border-[#1e2536]">
        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3 text-slate-300">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-white">End-to-End Client Encryption: </span>
              <span className="text-slate-400">
                Credentials never leave your device in plaintext. Encrypted via Web Crypto API with PBKDF2 salt.
              </span>
            </div>
          </div>
          <Badge variant="outline" className="text-indigo-300 border-indigo-500/30">
            Auto-lock: 15 min
          </Badge>
        </CardContent>
      </Card>

      {/* Search Bar */}
      <div className="p-4 rounded-xl bg-[#121620] border border-[#1e2536]">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <Input
            type="text"
            placeholder="Search saved portal credentials by organization, username, or portal name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-[#0d1017] border-[#20283c] text-xs"
          />
        </div>
      </div>

      {/* Credentials List */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <Card
            key={item.id}
            className="bg-[#121620] border-[#1e2536] hover:border-[#27344d] transition-all"
          >
            <CardContent className="p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-bold text-white bg-indigo-500/15 border border-indigo-500/30 px-2 py-0.5 rounded">
                    {item.org}
                  </span>
                  <h3 className="text-sm font-semibold text-white">
                    {item.portalName}
                  </h3>
                </div>

                <a
                  href={item.portalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                >
                  Open Portal <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Credential Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                {/* Username */}
                <div className="p-3 rounded-lg bg-[#0e121a] border border-[#1b2233]">
                  <span className="text-slate-500 block mb-1">Username / OTR ID</span>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-slate-200 font-medium truncate pr-2">
                      {item.username}
                    </span>
                    <button
                      onClick={() => handleCopy(item.username, `user-${item.id}`)}
                      className="text-slate-400 hover:text-white"
                      title="Copy Username"
                    >
                      {copiedId === `user-${item.id}` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Password */}
                <div className="p-3 rounded-lg bg-[#0e121a] border border-[#1b2233]">
                  <span className="text-slate-500 block mb-1">Encrypted Password</span>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-slate-300 tracking-wider">
                      {item.maskedPassword}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleCopy("DemoSecret#2026", `pass-${item.id}`)}
                        className="text-slate-400 hover:text-white"
                        title="Copy Password"
                      >
                        {copiedId === `pass-${item.id}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Registration / App Number */}
                <div className="p-3 rounded-lg bg-[#0e121a] border border-[#1b2233]">
                  <span className="text-slate-500 block mb-1">Reg / App ID</span>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-slate-200 truncate pr-2">
                      {item.registrationNumber}
                    </span>
                    <button
                      onClick={() => handleCopy(item.registrationNumber, `reg-${item.id}`)}
                      className="text-slate-400 hover:text-white"
                      title="Copy ID"
                    >
                      {copiedId === `reg-${item.id}` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Registered Mobile & Email */}
                <div className="p-3 rounded-lg bg-[#0e121a] border border-[#1b2233]">
                  <span className="text-slate-500 block mb-1">Linked Contact</span>
                  <div className="text-[11px] text-slate-300 truncate">
                    {item.registeredEmail}
                  </div>
                </div>
              </div>

              {item.notes && (
                <div className="text-xs text-slate-400 bg-[#0d1017] p-2.5 rounded-lg border border-[#1b2233]">
                  <span className="text-slate-500 font-medium">Security Note: </span>
                  {item.notes}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </AppLayout>
  );
}
