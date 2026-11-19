"use client";

import React, { useState } from "react";
import {
  X,
  KeyRound,
  Shield,
  Eye,
  EyeOff,
  Wand2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useVault } from "@/context/VaultContext";
import { useExaminations } from "@/context/ExaminationContext";
import { generateSecurePassword } from "@/lib/crypto/vault-crypto";

interface AddCredentialModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultExamId?: string;
}

const COMMON_ORGS = [
  "UPSC",
  "SSC",
  "ISRO",
  "GATE / GOAPS",
  "NTA",
  "IBPS / Banking",
  "Railway (RRB)",
  "State PSC",
  "DRDO",
  "Defence / AFCAT",
  "Other",
];

export function AddCredentialModal({
  isOpen,
  onClose,
  defaultExamId,
}: AddCredentialModalProps) {
  const { addCredential } = useVault();
  const { examinations } = useExaminations();

  const [org, setOrg] = useState("UPSC");
  const [portalName, setPortalName] = useState("");
  const [portalUrl, setPortalUrl] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [applicationNumber, setApplicationNumber] = useState("");
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [registeredMobile, setRegisteredMobile] = useState("");
  const [securityNotes, setSecurityNotes] = useState("");
  const [selectedExamId, setSelectedExamId] = useState<string>(defaultExamId || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleGeneratePassword = () => {
    const strong = generateSecurePassword(16, {
      numbers: true,
      symbols: true,
      uppercase: true,
      lowercase: true,
    });
    setPassword(strong);
    setShowPassword(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!portalName.trim() || !username.trim() || !password.trim()) return;

    setIsSubmitting(true);
    const linkedExam = examinations.find((x) => x.id === selectedExamId);

    await addCredential({
      examId: selectedExamId || undefined,
      examName: linkedExam?.examName || `${org} Portal Login`,
      org: org.trim(),
      portalName: portalName.trim(),
      portalUrl: portalUrl.trim(),
      username: username.trim(),
      password: password.trim(),
      registrationNumber: registrationNumber.trim() || undefined,
      applicationNumber: applicationNumber.trim() || undefined,
      registeredEmail: registeredEmail.trim() || undefined,
      registeredMobile: registeredMobile.trim() || undefined,
      securityNotes: securityNotes.trim() || undefined,
    });

    setIsSubmitting(false);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setPortalName("");
    setPortalUrl("");
    setUsername("");
    setPassword("");
    setRegistrationNumber("");
    setApplicationNumber("");
    setRegisteredEmail("");
    setRegisteredMobile("");
    setSecurityNotes("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl bg-[#0d1017] border border-[#232a3e] rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col my-8 max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#1e2536] bg-[#121622]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Add Examination Credentials
              </h2>
              <p className="text-xs text-slate-400">
                Encrypted with AES-GCM 256-bit before saving to storage
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1a2133] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* Linked Exam & Organization */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Recruiting Organization *
              </label>
              <select
                value={org}
                onChange={(e) => setOrg(e.target.value)}
                className="flex h-9 w-full rounded-lg border border-[#1e2536] bg-[#121620] px-3 py-1 text-xs text-slate-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
              >
                {COMMON_ORGS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Linked Examination (Optional)
              </label>
              <select
                value={selectedExamId}
                onChange={(e) => setSelectedExamId(e.target.value)}
                className="flex h-9 w-full rounded-lg border border-[#1e2536] bg-[#121620] px-3 py-1 text-xs text-slate-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
              >
                <option value="">Standalone / Unlinked Portal</option>
                {examinations.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.examName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Portal Name & URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Portal / Platform Name *
              </label>
              <Input
                required
                value={portalName}
                onChange={(e) => setPortalName(e.target.value)}
                placeholder="e.g. UPSC OTR Portal"
                className="bg-[#121620] border-[#1e2536] text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Portal Login URL
              </label>
              <Input
                value={portalUrl}
                onChange={(e) => setPortalUrl(e.target.value)}
                placeholder="https://upsconline.nic.in"
                className="bg-[#121620] border-[#1e2536] text-xs"
              />
            </div>
          </div>

          {/* Username & Password */}
          <div className="p-3.5 rounded-xl bg-[#0b0e14] border border-[#1e2536] space-y-3">
            <span className="font-semibold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-indigo-400" />
              Login Credentials
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Username / User ID *
                </label>
                <Input
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. OTR-IND-884102"
                  className="bg-[#121620] border-[#1e2536] text-xs font-mono"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-300 font-medium">
                    Password *
                  </label>
                  <button
                    type="button"
                    onClick={handleGeneratePassword}
                    className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Wand2 className="w-3 h-3" />
                    Generate Strong
                  </button>
                </div>

                <div className="relative">
                  <Input
                    required
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter portal password"
                    className="bg-[#121620] border-[#1e2536] text-xs font-mono pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Registration & Application IDs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Registration / Roll Number
              </label>
              <Input
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
                placeholder="e.g. RID-092841"
                className="bg-[#121620] border-[#1e2536] text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Application Number
              </label>
              <Input
                value={applicationNumber}
                onChange={(e) => setApplicationNumber(e.target.value)}
                placeholder="e.g. UPSC2026849"
                className="bg-[#121620] border-[#1e2536] text-xs font-mono"
              />
            </div>
          </div>

          {/* Contact Verification Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Registered Email Address
              </label>
              <Input
                type="email"
                value={registeredEmail}
                onChange={(e) => setRegisteredEmail(e.target.value)}
                placeholder="candidate@gmail.com"
                className="bg-[#121620] border-[#1e2536] text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Registered Mobile Number
              </label>
              <Input
                value={registeredMobile}
                onChange={(e) => setRegisteredMobile(e.target.value)}
                placeholder="+91 98765 43210"
                className="bg-[#121620] border-[#1e2536] text-xs"
              />
            </div>
          </div>

          {/* Recovery Notes */}
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Security / Recovery Notes (Questions, 2FA info)
            </label>
            <textarea
              rows={2}
              value={securityNotes}
              onChange={(e) => setSecurityNotes(e.target.value)}
              placeholder="e.g. Security question answer: Blue. 2FA sent via SMS to registered mobile."
              className="w-full rounded-lg border border-[#1e2536] bg-[#121620] p-2.5 text-xs text-slate-200 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-[#1a2133]">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="text-xs h-9 px-4 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="text-xs h-9 px-5 bg-indigo-600 hover:bg-indigo-500 font-semibold gap-1.5 cursor-pointer shadow-lg shadow-indigo-950/40"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isSubmitting ? "Encrypting..." : "Save Credential"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
