import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { OfflineStatusBanner } from "@/components/offline/offline-status-banner";
import { PWAInstallPrompt } from "@/components/pwa/pwa-install-prompt";

export const metadata: Metadata = {
  title: "ExamVault — Examination Lifecycle & Management Platform",
  description:
    "Personal examination management platform for competitive, government and recruitment examinations. Track notifications, deadlines, hall tickets, credentials, and results.",
  applicationName: "ExamVault",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icons/icon-192.svg",
    apple: "/icons/icon-192.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ExamVault",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0d13",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full bg-[#0b0d13] text-slate-100 flex flex-col font-sans">
        <Providers>
          <OfflineStatusBanner />
          {children}
          <PWAInstallPrompt />
        </Providers>
      </body>
    </html>
  );
}
