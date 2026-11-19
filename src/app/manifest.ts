import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ExamVault — Personal Examination Management Platform",
    short_name: "ExamVault",
    description:
      "Personal examination management platform for competitive, government and entrance examinations. Track notifications, deadlines, hall tickets, credentials, and results.",
    start_url: "/",
    display: "standalone",
    background_color: "#0b0d13",
    theme_color: "#0b0d13",
    orientation: "portrait-primary",
    scope: "/",
    categories: ["education", "productivity", "utilities"],
    icons: [
      {
        src: "/icons/icon-192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
    shortcuts: [
      {
        name: "My Examinations",
        url: "/examinations",
        description: "View active and scheduled examinations",
      },
      {
        name: "Password Vault",
        url: "/vault",
        description: "Unlock secure recruitment credentials",
      },
      {
        name: "Document Vault",
        url: "/documents",
        description: "Access admit cards and application forms",
      },
      {
        name: "Calendar & Deadlines",
        url: "/calendar",
        description: "Check upcoming exam milestones",
      },
    ],
  };
}
