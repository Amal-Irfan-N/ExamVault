import { DetectedUpdate, MonitoredPortalSource } from "@/types/monitoring";

/**
 * ExamVault - Automated Website Monitoring Engine
 *
 * Modular change-detection worker designed to check official recruitment portals
 * with respectful rate-limiting, conditional request caching, and intelligent pattern extraction.
 */

export interface SimulationResult {
  sourceId: string;
  isChanged: boolean;
  detectedUpdate?: DetectedUpdate;
}

// Built-in verified official recruitment portal sources
export const INITIAL_MONITORED_SOURCES: MonitoredPortalSource[] = [
  {
    id: "source-upsc",
    org: "UPSC",
    portalName: "UPSC What's New & Active Examinations",
    targetUrl: "https://upsc.gov.in/whats-new",
    category: "UPSC",
    checkIntervalMinutes: 30,
    lastCheckedAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    lastStatusCode: 200,
    healthStatus: "healthy",
    isPaused: false,
    notes: "Monitors Civil Services, Engineering Services, and NDA active announcements.",
  },
  {
    id: "source-isro",
    org: "ISRO",
    portalName: "ISRO Centralised Recruitment Board (ICRB)",
    targetUrl: "https://www.isro.gov.in/Careers.html",
    category: "ISRO",
    checkIntervalMinutes: 60,
    lastCheckedAt: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
    lastStatusCode: 200,
    healthStatus: "healthy",
    isPaused: false,
    notes: "Monitors Scientist/Engineer 'SC' CBT dates, answer keys, and merit lists.",
  },
  {
    id: "source-ssc",
    org: "SSC",
    portalName: "Staff Selection Commission Official Notice Board",
    targetUrl: "https://ssc.gov.in/notice-board",
    category: "SSC",
    checkIntervalMinutes: 45,
    lastCheckedAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    lastStatusCode: 200,
    healthStatus: "healthy",
    isPaused: false,
    notes: "Monitors CGL, CHSL, and CPO Tier-I admit card notices and date extensions.",
  },
  {
    id: "source-gate",
    org: "GATE",
    portalName: "GATE IIT Official Portal Announcements",
    targetUrl: "https://gate2026.iitr.ac.in",
    category: "GATE",
    checkIntervalMinutes: 120,
    lastCheckedAt: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
    lastStatusCode: 200,
    healthStatus: "healthy",
    isPaused: false,
    notes: "Scorecard availability, cutoff percentiles, and scorecard downloads.",
  },
  {
    id: "source-drdo",
    org: "DRDO",
    portalName: "DRDO CEPTAM Recruitment Notices",
    targetUrl: "https://drdo.gov.in/ceptam-advertisement",
    category: "DRDO",
    checkIntervalMinutes: 60,
    lastCheckedAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    lastStatusCode: 200,
    healthStatus: "healthy",
    isPaused: false,
    notes: "CEPTAM-11 STA-B technical posts advertisement releases.",
  },
];

// Preloaded detected updates for realistic verification and confirmation flows
export const INITIAL_DETECTED_UPDATES: DetectedUpdate[] = [
  {
    id: "update-1",
    sourceId: "source-isro",
    examId: "exam-2",
    examName: "ISRO Scientist/Engineer 'SC' 2026",
    org: "ISRO",
    updateType: "admit_card_released",
    headline: "Admit Card Download Link Activated on ICRB Portal",
    summary:
      "ICRB Notice Board published notification stating admit cards for Scientist/Engineer 'SC' (Computer Science) Computer Based Test are released with centre address details.",
    sourceUrl: "https://apps.isro.gov.in/icrb/admitcard",
    detectedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    status: "pending_review",
    confidenceScore: 98,
    extractedChanges: [
      {
        field: "status",
        oldValue: "examination_scheduled",
        newValue: "hall_ticket_available",
      },
      {
        field: "hallTicketDownloadUrl",
        oldValue: "",
        newValue: "https://apps.isro.gov.in/icrb/admitcard-cbt-2026.pdf",
      },
    ],
  },
  {
    id: "update-2",
    sourceId: "source-upsc",
    examId: "exam-1",
    examName: "UPSC Civil Services Examination 2026",
    org: "UPSC",
    updateType: "city_intimation_released",
    headline: "City Intimation Allotment Slip Published for Prelims 2026",
    summary:
      "UPSC Examination Division uploaded examination city slip. Preliminary exam remains confirmed for 24 May 2026 across 79 nationwide test centres.",
    sourceUrl: "https://upsconline.nic.in/cityintimation",
    detectedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    status: "pending_review",
    confidenceScore: 94,
    extractedChanges: [
      {
        field: "examDate",
        oldValue: "2026-05-24 (tentative)",
        newValue: "2026-05-24 (confirmed)",
      },
    ],
  },
  {
    id: "update-3",
    sourceId: "source-drdo",
    org: "DRDO",
    examName: "DRDO CEPTAM-11 Recruitment",
    updateType: "new_notification",
    headline: "CEPTAM-11 Official Employment Notice No. 01/2026 Uploaded",
    summary:
      "Recruitment advertisement for 1,920 Senior Technical Assistant-B (STA-B) and Technician-A vacancies confirmed. Registration opens 01 April 2026.",
    sourceUrl: "https://drdo.gov.in/ceptam-advertisement",
    detectedAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    status: "applied",
    confidenceScore: 99,
  },
];
