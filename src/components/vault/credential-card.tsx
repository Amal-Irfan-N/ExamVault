"use client";

import React, { useState } from "react";
import {
  Copy,
  Check,
  Eye,
  EyeOff,
  ExternalLink,
  Edit,
  Trash2,
  Mail,
  Phone,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { VaultCredential } from "@/types/credential";

interface CredentialCardProps {
  credential: VaultCredential;
  onEdit: (cred: VaultCredential) => void;
  onDelete: (cred: VaultCredential) => void;
}

export function CredentialCard({
  credential: cred,
  onEdit,
  onDelete,
}: CredentialCardProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 1500);
  };

  return (
    <Card className="bg-[#121620] border-[#1e2536] hover:border-indigo-500/40 hover:bg-[#131825] transition-all flex flex-col justify-between">
      <CardContent className="p-4 sm:p-5 space-y-4">
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-white bg-indigo-500/15 border border-indigo-500/30 px-2 py-0.5 rounded">
                {cred.org}
              </span>
              {cred.examId && (
                <Badge variant="outline" className="text-[10px] text-slate-400 border-[#222c42]">
                  Linked Exam
                </Badge>
              )}
            </div>

            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
              {cred.portalName}
            </h3>

            {cred.portalUrl && (
              <a
                href={cred.portalUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-medium"
              >
                <span>Visit Portal</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(cred)}
              className="text-xs h-7 px-2 text-slate-400 hover:text-white cursor-pointer"
              title="Edit Credential"
            >
              <Edit className="w-3.5 h-3.5" />
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(cred)}
              className="text-xs h-7 px-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer"
              title="Delete Credential"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Credentials Grid: Username & Password */}
        <div className="p-3 rounded-xl bg-[#0b0e14] border border-[#1e2536] space-y-2.5">
          {/* Username Row */}
          <div className="flex items-center justify-between gap-2 text-xs">
            <div className="min-w-0">
              <span className="text-[10px] text-slate-500 block uppercase font-semibold">
                Username / User ID
              </span>
              <span className="font-mono text-slate-200 font-medium truncate block">
                {cred.username}
              </span>
            </div>

            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleCopy(cred.username, "user")}
              className="text-xs h-7 px-2 text-slate-400 hover:text-white hover:bg-[#1a2133] gap-1 cursor-pointer"
              title="Copy Username"
            >
              {copiedField === "user" ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[10px] text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="text-[10px] text-slate-400">Copy</span>
                </>
              )}
            </Button>
          </div>

          <div className="border-t border-[#182030]" />

          {/* Password Row */}
          <div className="flex items-center justify-between gap-2 text-xs">
            <div className="min-w-0">
              <span className="text-[10px] text-slate-500 block uppercase font-semibold">
                Portal Password
              </span>
              <span className="font-mono text-slate-200 font-medium truncate block">
                {showPassword ? cred.password : "••••••••••••••••"}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1a2133] transition-colors cursor-pointer"
                title={showPassword ? "Hide Password" : "Show Password"}
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>

              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleCopy(cred.password, "pass")}
                className="text-xs h-7 px-2 text-slate-400 hover:text-white hover:bg-[#1a2133] gap-1 cursor-pointer"
                title="Copy Password"
              >
                {copiedField === "pass" ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[10px] text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span className="text-[10px] text-slate-400">Copy</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Secondary Identifiers: Reg No & App No */}
        {(cred.registrationNumber || cred.applicationNumber) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {cred.registrationNumber && (
              <div className="p-2 rounded-lg bg-[#0b0e14]/60 border border-[#1a2133] flex items-center justify-between">
                <div className="min-w-0 pr-1">
                  <span className="text-[10px] text-slate-500 block">Registration ID</span>
                  <span className="font-mono text-slate-300 font-medium truncate block">
                    {cred.registrationNumber}
                  </span>
                </div>
                <button
                  onClick={() => handleCopy(cred.registrationNumber!, "reg")}
                  className="p-1 rounded text-slate-500 hover:text-white cursor-pointer"
                  title="Copy Registration ID"
                >
                  {copiedField === "reg" ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
            )}

            {cred.applicationNumber && (
              <div className="p-2 rounded-lg bg-[#0b0e14]/60 border border-[#1a2133] flex items-center justify-between">
                <div className="min-w-0 pr-1">
                  <span className="text-[10px] text-slate-500 block">Application No.</span>
                  <span className="font-mono text-slate-300 font-medium truncate block">
                    {cred.applicationNumber}
                  </span>
                </div>
                <button
                  onClick={() => handleCopy(cred.applicationNumber!, "app")}
                  className="p-1 rounded text-slate-500 hover:text-white cursor-pointer"
                  title="Copy Application No"
                >
                  {copiedField === "app" ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Contact Info: Email & Mobile */}
        {(cred.registeredEmail || cred.registeredMobile) && (
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1">
            {cred.registeredEmail && (
              <span className="flex items-center gap-1.5 truncate">
                <Mail className="w-3 h-3 text-slate-500" />
                <span className="truncate">{cred.registeredEmail}</span>
              </span>
            )}
            {cred.registeredMobile && (
              <span className="flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-slate-500" />
                <span>{cred.registeredMobile}</span>
              </span>
            )}
          </div>
        )}

        {/* Security / Recovery Notes */}
        {cred.securityNotes && (
          <div className="p-2 rounded-lg bg-[#0b0e14]/50 border border-[#192233] text-[11px] text-slate-400 flex items-start gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
            <p className="line-clamp-2 leading-relaxed">{cred.securityNotes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
