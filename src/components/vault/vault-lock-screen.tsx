"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Lock,
  Unlock,
  KeyRound,
  Eye,
  EyeOff,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useVault } from "@/context/VaultContext";

export function VaultLockScreen() {
  const { isVaultSetup, setupMasterPassword, unlockVault } = useVault();

  // Unlock state
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [unlockError, setUnlockError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Setup state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [setupError, setSetupError] = useState<string | null>(null);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setUnlockError(null);
    if (!password) return;

    setIsSubmitting(true);
    const success = await unlockVault(password);
    setIsSubmitting(false);

    if (!success) {
      setUnlockError("Incorrect master password. Please verify and try again.");
    }
  };

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSetupError(null);

    if (newPassword.length < 8) {
      setSetupError("Master password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setSetupError("Passwords do not match. Please re-enter.");
      return;
    }

    setIsSubmitting(true);
    const success = await setupMasterPassword(newPassword);
    setIsSubmitting(false);

    if (!success) {
      setSetupError("Failed to initialize vault encryption. Please try again.");
    }
  };

  const handleQuickDemoSetup = async () => {
    setIsSubmitting(true);
    await setupMasterPassword("ExamVault@2026");
    setIsSubmitting(false);
  };

  const handleQuickUnlockDefault = async () => {
    setPassword("ExamVault@2026");
    setIsSubmitting(true);
    await unlockVault("ExamVault@2026");
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-xl mx-auto my-6 sm:my-12 px-4">
      <div className="p-6 sm:p-8 rounded-3xl bg-[#101420] border border-[#222a3e] shadow-2xl space-y-6 relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Icon & Title */}
        <div className="text-center space-y-2 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mx-auto shadow-lg shadow-indigo-950/40">
            {isVaultSetup ? <Lock className="w-8 h-8" /> : <ShieldCheck className="w-8 h-8" />}
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {isVaultSetup ? "Unlock Password Vault" : "Setup Zero-Knowledge Vault"}
          </h2>

          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            {isVaultSetup
              ? "Your examination portal credentials are encrypted with AES-GCM 256-bit on this device. Enter your Master Password to decrypt them."
              : "Create a Master Password to protect your UPSC, SSC, GATE and recruitment portal credentials with client-side AES-GCM encryption."}
          </p>
        </div>

        {/* Mode 1: Unlock Existing Vault */}
        {isVaultSetup ? (
          <form onSubmit={handleUnlock} className="space-y-4 relative z-10">
            {unlockError && (
              <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>{unlockError}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Master Password
              </label>

              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your vault master password"
                  autoFocus
                  required
                  className="bg-[#0b0e14] border-[#222a3e] text-xs pr-10 h-10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-10 bg-indigo-600 hover:bg-indigo-500 font-bold text-xs gap-2 shadow-lg shadow-indigo-950/40 cursor-pointer"
            >
              <Unlock className="w-4 h-4" />
              {isSubmitting ? "Decrypting Vault..." : "Unlock Vault"}
            </Button>

            {/* Quick Demo Unlock Shortcut */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={handleQuickUnlockDefault}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors inline-flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                Unlock with default demo password: <code className="font-mono bg-[#0b0e14] px-1 py-0.5 rounded border border-[#1e2536]">ExamVault@2026</code>
              </button>
            </div>
          </form>
        ) : (
          /* Mode 2: Setup New Vault */
          <form onSubmit={handleSetup} className="space-y-4 relative z-10">
            {setupError && (
              <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>{setupError}</span>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Create Master Password (min. 8 characters) *
                </label>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter a strong master password"
                  autoFocus
                  required
                  className="bg-[#0b0e14] border-[#222a3e] text-xs h-10"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Confirm Master Password *
                </label>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your master password"
                  required
                  className="bg-[#0b0e14] border-[#222a3e] text-xs h-10"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showPassword}
                    onChange={(e) => setShowPassword(e.target.checked)}
                    className="rounded bg-[#0b0e14] border-[#222a3e]"
                  />
                  <span>Show password characters</span>
                </label>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-10 bg-indigo-600 hover:bg-indigo-500 font-bold text-xs gap-2 shadow-lg shadow-indigo-950/40 cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              {isSubmitting ? "Generating AES-GCM Keys..." : "Initialize Encrypted Vault"}
            </Button>

            {/* Quick Demo Onboarding Shortcut */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={handleQuickDemoSetup}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors inline-flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                Initialize with sample credentials (ExamVault@2026)
              </button>
            </div>
          </form>
        )}

        {/* Security Architecture Explainer Note */}
        <div className="p-3.5 rounded-2xl bg-[#0b0e14] border border-[#1e2536] space-y-2 text-xs relative z-10">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-[11px] uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Zero-Knowledge Security Architecture
          </div>

          <ul className="space-y-1 text-slate-400 text-[11px] list-disc list-inside">
            <li>
              Keys derived using <strong className="text-slate-200">PBKDF2</strong> with 100,000 SHA-256 iterations and random salt.
            </li>
            <li>
              Credentials encrypted with <strong className="text-slate-200">AES-GCM 256-bit</strong> directly in your browser.
            </li>
            <li>
              Your master password is never stored or sent across any network.
            </li>
            <li>
              Vault automatically locks after 15 minutes of inactivity for your protection.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
