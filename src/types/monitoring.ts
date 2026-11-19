export type MonitoringUpdateType =
  | "new_notification"
  | "deadline_extension"
  | "admit_card_released"
  | "city_intimation_released"
  | "exam_date_rescheduled"
  | "answer_key_published"
  | "result_announced";

export type UpdateReviewStatus = "pending_review" | "applied" | "dismissed";

export interface DetectedUpdate {
  id: string;
  sourceId: string;
  examId?: string;
  examName: string;
  org: string;
  updateType: MonitoringUpdateType;
  headline: string;
  summary: string;
  sourceUrl: string;
  detectedAt: string;
  status: UpdateReviewStatus;
  confidenceScore: number; // 0 to 100%
  extractedChanges?: {
    field: "applicationClosingDate" | "feePaymentDeadline" | "examDate" | "hallTicketDownloadUrl" | "answerKeyReleaseDate" | "resultPublicationDate" | "status";
    oldValue?: string;
    newValue: string;
  }[];
}

export interface MonitoredPortalSource {
  id: string;
  examId?: string;
  org: string;
  portalName: string;
  targetUrl: string;
  category: string;
  checkIntervalMinutes: number;
  lastCheckedAt?: string;
  lastStatusCode?: number;
  lastContentHash?: string;
  healthStatus: "healthy" | "warning" | "offline";
  isPaused: boolean;
  notes?: string;
}

export interface MonitoringWorkerStats {
  isScanning: boolean;
  activeSourcesCount: number;
  totalChecksCount: number;
  pendingReviewsCount: number;
  lastScanTimestamp: string;
  rateLimitMs: number;
}
