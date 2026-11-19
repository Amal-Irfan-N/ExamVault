"use client";

import React, { useState, useEffect } from "react";
import { Download, X, Smartphone, CheckCircle2 } from "lucide-react";
import { registerServiceWorker } from "@/lib/notifications/push-notification-service";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return (
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true
      );
    }
    return false;
  });
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return Boolean(sessionStorage.getItem("examvault_pwa_dismissed"));
    }
    return false;
  });
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Register Service Worker
    registerServiceWorker();

    // Capture beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    // Capture appinstalled
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setTimeout(() => setIsInstalled(false), 5000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setIsInstalled(true);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("examvault_pwa_dismissed", "true");
    }
  };

  if (isStandalone || isDismissed) {
    return null;
  }

  // Show installation notification after successful installation
  if (isInstalled) {
    return (
      <aside
        aria-label="App installed confirmation"
        className="fixed bottom-20 md:bottom-6 right-4 z-50 p-3 bg-emerald-950/90 border border-emerald-500/40 rounded-2xl text-emerald-200 text-xs shadow-2xl flex items-center gap-2.5 backdrop-blur-md animate-fadeIn"
      >
        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
        <span>ExamVault successfully installed on your device!</span>
      </aside>
    );
  }

  // Show install banner if prompt is available
  if (!deferredPrompt) {
    return null;
  }

  return (
    <aside
      aria-label="Install App Prompt"
      className="fixed bottom-20 md:bottom-6 right-4 left-4 sm:left-auto sm:max-w-md z-50 bg-[#121620]/95 border border-indigo-500/40 rounded-2xl p-4 shadow-2xl backdrop-blur-md text-slate-100 animate-fadeIn"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white shrink-0 shadow-md">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              Install ExamVault App
              <span className="text-[10px] font-mono font-normal px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                PWA
              </span>
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
              Install on Samsung / Android or Desktop for instant offline access and notification alerts.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors shrink-0"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-slate-800">
        <button
          type="button"
          onClick={handleDismiss}
          className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
        >
          Not Now
        </button>
        <button
          type="button"
          onClick={handleInstallClick}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          Install App
        </button>
      </div>
    </aside>
  );
}
