"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  X,
  Lock,
  Mail,
  User,
  ShieldCheck,
  ArrowRight,
  Database,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function AuthModal() {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    isConfigured,
    signInWithEmail,
    signUpWithEmail,
    enableDemoUser,
  } = useAuth();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (mode === "signin") {
      const res = await signInWithEmail(email, password);
      if (res.error) {
        setError(res.error);
        setIsSubmitting(false);
      } else {
        setSuccess(true);
        setTimeout(() => {
          setIsSubmitting(false);
          setIsAuthModalOpen(false);
        }, 800);
      }
    } else {
      const res = await signUpWithEmail(email, password, fullName);
      if (res.error) {
        setError(res.error);
        setIsSubmitting(false);
      } else {
        setSuccess(true);
        setTimeout(() => {
          setIsSubmitting(false);
          setIsAuthModalOpen(false);
        }, 800);
      }
    }
  };

  const handleUseDemo = () => {
    enableDemoUser();
    setIsAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={() => setIsAuthModalOpen(false)}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-[#0d1017] border border-[#232a3e] rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col animate-in fade-in zoom-in-95 duration-100">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#1e2536] bg-[#121622]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                {mode === "signin" ? "Candidate Portal Sign In" : "Create Candidate Account"}
              </h2>
              <p className="text-xs text-slate-400">
                {isConfigured ? "Supabase Cloud Authentication" : "ExamVault Authentication"}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1a2133] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Pill */}
        <div className="px-5 py-2.5 bg-[#0f131f] border-b border-[#1b2233] flex items-center justify-between text-xs">
          <span className="text-slate-400">Backend Status:</span>
          {isConfigured ? (
            <Badge variant="success" className="text-[10px] gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              Supabase Connected
            </Badge>
          ) : (
            <Badge variant="outline" className="text-[10px] text-indigo-300 border-indigo-500/30 gap-1">
              <Database className="w-3 h-3 text-indigo-400" />
              Stage 3 Architecture
            </Badge>
          )}
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#1e2536] text-xs">
          <button
            type="button"
            onClick={() => {
              setMode("signin");
              setError(null);
            }}
            className={`flex-1 py-2.5 font-semibold text-center border-b-2 transition-colors cursor-pointer ${
              mode === "signin"
                ? "border-indigo-500 text-white bg-[#141a28]/60"
                : "border-transparent text-slate-400 hover:text-white hover:bg-[#121622]"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setError(null);
            }}
            className={`flex-1 py-2.5 font-semibold text-center border-b-2 transition-colors cursor-pointer ${
              mode === "signup"
                ? "border-indigo-500 text-white bg-[#141a28]/60"
                : "border-transparent text-slate-400 hover:text-white hover:bg-[#121622]"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {error && (
            <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
              {error}
            </div>
          )}

          {success && (
            <div className="p-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              {mode === "signin" ? "Signed in successfully!" : "Account created successfully!"}
            </div>
          )}

          {mode === "signup" && (
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Candidate Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <Input
                  required
                  placeholder="e.g. Aman Verma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-9 bg-[#0b0e14] border-[#1e2536] text-xs"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <Input
                required
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9 bg-[#0b0e14] border-[#1e2536] text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <Input
                required
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 bg-[#0b0e14] border-[#1e2536] text-xs"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold h-9 gap-1.5 mt-2"
          >
            {isSubmitting
              ? "Authenticating..."
              : mode === "signin"
              ? "Sign In to ExamVault"
              : "Register Account"}
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>

          {/* Quick Demo Switcher */}
          <div className="pt-3 border-t border-[#1e2536]">
            <button
              type="button"
              onClick={handleUseDemo}
              className="w-full py-2 px-3 rounded-lg bg-[#141a27] hover:bg-[#192233] border border-[#20293d] text-[11px] text-slate-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-emerald-400" />
              Continue as Demo Candidate (Aman Verma)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
