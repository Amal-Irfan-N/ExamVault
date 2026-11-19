export type ExamStatus =
  | 'interested'
  | 'notification_released'
  | 'application_not_started'
  | 'application_in_progress'
  | 'payment_pending'
  | 'application_submitted'
  | 'application_rejected'
  | 'examination_scheduled'
  | 'hall_ticket_available'
  | 'examination_completed'
  | 'answer_key_pending'
  | 'answer_key_published'
  | 'result_pending'
  | 'result_published'
  | 'qualified'
  | 'not_qualified'
  | 'selected'
  | 'not_selected'
  | 'archived';

export type DateCertainty = 'confirmed' | 'tentative' | 'unannounced';

export interface DateWithCertainty {
  date: string | null; // ISO YYYY-MM-DD
  certainty: DateCertainty;
}

export type ExamCategory =
  | 'UPSC'
  | 'SSC'
  | 'RRB'
  | 'ISRO'
  | 'DRDO'
  | 'GATE'
  | 'State PSC'
  | 'Banking'
  | 'Defence'
  | 'PSU'
  | 'Other';

export interface Examination {
  id: string;
  userId: string;
  // A. Basic Information
  examName: string;
  recruitingOrg: string;
  category: ExamCategory;
  postName: string;
  advertisementNumber?: string;
  recruitmentYear: number;
  officialNotificationUrl?: string;
  officialApplicationUrl?: string;
  officialWebsiteUrl?: string;
  personalNotes?: string;

  // B. Application Information
  applicationOpeningDate?: DateWithCertainty;
  applicationClosingDate?: DateWithCertainty;
  feePaymentDeadline?: DateWithCertainty;
  applicationSubmissionDate?: string | null;
  applicationStatus: 'not_started' | 'draft' | 'submitted' | 'rejected' | 'payment_pending';
  applicationNumber?: string;
  registrationNumber?: string;
  paymentStatus: 'pending' | 'completed' | 'exempted' | 'failed';
  applicationFee?: number;
  paymentTransactionId?: string;

  // C. Examination Information
  examDate?: DateWithCertainty;
  examSession?: string; // e.g. "Morning 09:00 - 12:00"
  examCity?: string;
  examCentre?: string;
  cityIntimationReleaseDate?: DateWithCertainty;
  hallTicketReleaseDate?: DateWithCertainty;
  hallTicketDownloadUrl?: string;

  // D. Post-Examination Information
  answerKeyReleaseDate?: DateWithCertainty;
  responseSheetReleaseDate?: DateWithCertainty;
  objectionSubmissionDeadline?: DateWithCertainty;
  finalAnswerKeyDate?: DateWithCertainty;
  resultPublicationDate?: DateWithCertainty;
  scorecardAvailabilityDate?: DateWithCertainty;
  cutoffPublicationDate?: DateWithCertainty;
  finalSelectionStatus?: 'pending' | 'qualified' | 'not_qualified' | 'selected' | 'not_selected';

  // Overall status & timestamps
  status: ExamStatus;
  isArchived: boolean;
  isCompleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ExamActivity {
  id: string;
  examId: string;
  examName: string;
  action: string;
  details: string;
  timestamp: string;
  type: 'status_change' | 'document_added' | 'credential_added' | 'date_updated' | 'monitoring_alert';
}

export interface UpcomingDeadlineItem {
  id: string;
  examId: string;
  examName: string;
  org: string;
  title: string;
  type: 'application_close' | 'payment_deadline' | 'objection_close' | 'correction_window';
  date: string;
  certainty: DateCertainty;
}

export interface UpcomingExamDateItem {
  id: string;
  examId: string;
  examName: string;
  org: string;
  session?: string;
  city?: string;
  date: string;
  certainty: DateCertainty;
  hallTicketAvailable: boolean;
}

export interface DashboardStats {
  totalExaminations: number;
  activeApplications: number;
  upcomingExaminations: number;
  pendingResults: number;
  pendingAnswerKeys: number;
  availableHallTickets: number;
  upcomingApplicationDeadlines: number;
}

export function isExamCompleted(exam: Examination): boolean {
  if (typeof exam.isCompleted === 'boolean') {
    return exam.isCompleted;
  }
  const completedStatuses: ExamStatus[] = [
    'examination_completed',
    'result_published',
    'qualified',
    'not_qualified',
    'selected',
    'not_selected',
  ];
  return completedStatuses.includes(exam.status);
}
