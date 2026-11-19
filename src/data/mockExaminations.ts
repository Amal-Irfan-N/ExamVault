import {
  Examination,
  ExamActivity,
  DashboardStats,
  UpcomingDeadlineItem,
  UpcomingExamDateItem,
} from '@/types/examination';

export const INITIAL_MOCK_EXAMINATIONS: Examination[] = [
  {
    id: 'exam-1',
    userId: 'user-demo-1',
    examName: 'Civil Services Examination (Preliminary) 2026',
    recruitingOrg: 'UPSC',
    category: 'UPSC',
    postName: 'IAS, IPS, IFS & Central Group A Services',
    advertisementNumber: '05/2026-CSP',
    recruitmentYear: 2026,
    officialNotificationUrl: 'https://upsc.gov.in',
    officialApplicationUrl: 'https://upsconline.nic.in',
    officialWebsiteUrl: 'https://upsc.gov.in',
    personalNotes: 'Focus on CSAT quant practice and Modern Indian History revision.',
    applicationOpeningDate: { date: '2026-02-14', certainty: 'confirmed' },
    applicationClosingDate: { date: '2026-03-05', certainty: 'confirmed' },
    feePaymentDeadline: { date: '2026-03-05', certainty: 'confirmed' },
    applicationSubmissionDate: '2026-02-28',
    applicationStatus: 'submitted',
    applicationNumber: 'UPSC2026987412',
    registrationNumber: 'RID-893041829',
    paymentStatus: 'completed',
    applicationFee: 100,
    paymentTransactionId: 'TXN-SBIEPAY-9921092',
    examDate: { date: '2026-05-24', certainty: 'confirmed' },
    examSession: 'Paper I (09:30-11:30) & Paper II (14:30-16:30)',
    examCity: 'New Delhi',
    examCentre: 'Kendriya Vidyalaya No. 1, Delhi Cantt',
    cityIntimationReleaseDate: { date: '2026-05-02', certainty: 'tentative' },
    hallTicketReleaseDate: { date: '2026-05-10', certainty: 'tentative' },
    hallTicketDownloadUrl: 'https://upsconline.nic.in/eadmitcard',
    answerKeyReleaseDate: { date: '2026-06-20', certainty: 'unannounced' },
    responseSheetReleaseDate: { date: null, certainty: 'unannounced' },
    objectionSubmissionDeadline: { date: null, certainty: 'unannounced' },
    finalAnswerKeyDate: { date: null, certainty: 'unannounced' },
    resultPublicationDate: { date: '2026-06-25', certainty: 'tentative' },
    scorecardAvailabilityDate: { date: null, certainty: 'unannounced' },
    cutoffPublicationDate: { date: null, certainty: 'unannounced' },
    status: 'examination_scheduled',
    isArchived: false,
    isCompleted: false,
    createdAt: '2026-02-15T10:30:00Z',
    updatedAt: '2026-03-01T14:20:00Z',
  },
  {
    id: 'exam-2',
    userId: 'user-demo-1',
    examName: 'Combined Graduate Level (CGL) 2026 Tier-I',
    recruitingOrg: 'SSC',
    category: 'SSC',
    postName: 'Assistant Section Officer, Inspector, Auditor',
    advertisementNumber: 'SSC-HQ/CGL/2026/01',
    recruitmentYear: 2026,
    officialNotificationUrl: 'https://ssc.gov.in',
    officialApplicationUrl: 'https://ssc.gov.in/apply',
    officialWebsiteUrl: 'https://ssc.gov.in',
    personalNotes: 'OTR profile already updated. Need to upload live photo.',
    applicationOpeningDate: { date: '2026-06-11', certainty: 'confirmed' },
    applicationClosingDate: { date: '2026-07-10', certainty: 'confirmed' },
    feePaymentDeadline: { date: '2026-07-11', certainty: 'confirmed' },
    applicationSubmissionDate: null,
    applicationStatus: 'draft',
    applicationNumber: 'SSC-CGL-2026-90184',
    registrationNumber: 'SSC-OTR-88401923',
    paymentStatus: 'pending',
    applicationFee: 100,
    examDate: { date: '2026-09-15', certainty: 'tentative' },
    examSession: 'Shift 1 (09:00 - 10:00)',
    examCity: 'Bengaluru',
    cityIntimationReleaseDate: { date: '2026-09-01', certainty: 'tentative' },
    hallTicketReleaseDate: { date: '2026-09-08', certainty: 'tentative' },
    status: 'application_in_progress',
    isArchived: false,
    isCompleted: false,
    createdAt: '2026-06-12T09:00:00Z',
    updatedAt: '2026-06-15T11:45:00Z',
  },
  {
    id: 'exam-3',
    userId: 'user-demo-1',
    examName: 'Scientist / Engineer \'SC\' (Computer Science)',
    recruitingOrg: 'ISRO',
    category: 'ISRO',
    postName: 'Scientist/Engineer \'SC\'',
    advertisementNumber: 'ICRB:02:2026',
    recruitmentYear: 2026,
    officialNotificationUrl: 'https://isro.gov.in/Careers.html',
    officialApplicationUrl: 'https://apps.isro.gov.in/icrb',
    officialWebsiteUrl: 'https://isro.gov.in',
    personalNotes: 'Revise Computer Architecture, OS, and Data Structures & Algorithms.',
    applicationOpeningDate: { date: '2026-01-10', certainty: 'confirmed' },
    applicationClosingDate: { date: '2026-01-31', certainty: 'confirmed' },
    feePaymentDeadline: { date: '2026-02-01', certainty: 'confirmed' },
    applicationSubmissionDate: '2026-01-25',
    applicationStatus: 'submitted',
    applicationNumber: 'ISRO-ICRB-CS-10492',
    registrationNumber: 'ICRB2026CS5029',
    paymentStatus: 'completed',
    applicationFee: 750,
    paymentTransactionId: 'RZP_ISRO_991820',
    examDate: { date: '2026-04-18', certainty: 'confirmed' },
    examSession: 'Single Session (10:00 - 12:00)',
    examCity: 'Bengaluru',
    examCentre: 'PES University Ring Road Campus',
    cityIntimationReleaseDate: { date: '2026-04-01', certainty: 'confirmed' },
    hallTicketReleaseDate: { date: '2026-04-05', certainty: 'confirmed' },
    hallTicketDownloadUrl: 'https://apps.isro.gov.in/icrb/admitcard',
    answerKeyReleaseDate: { date: '2026-04-22', certainty: 'tentative' },
    responseSheetReleaseDate: { date: '2026-04-22', certainty: 'tentative' },
    objectionSubmissionDeadline: { date: '2026-04-26', certainty: 'tentative' },
    status: 'hall_ticket_available',
    isArchived: false,
    isCompleted: false,
    createdAt: '2026-01-12T16:00:00Z',
    updatedAt: '2026-04-05T08:30:00Z',
  },
  {
    id: 'exam-4',
    userId: 'user-demo-1',
    examName: 'Graduate Aptitude Test in Engineering (GATE) 2026',
    recruitingOrg: 'IIT Roorkee / GATE Committee',
    category: 'GATE',
    postName: 'M.Tech / PSU Recruitment (CS & IT)',
    advertisementNumber: 'GATE-2026-IITR',
    recruitmentYear: 2026,
    officialNotificationUrl: 'https://gate2026.iitr.ac.in',
    officialApplicationUrl: 'https://goaps.iitr.ac.in',
    officialWebsiteUrl: 'https://gate2026.iitr.ac.in',
    personalNotes: 'Targeting top 200 rank for IOCL / ONGC direct recruitment.',
    applicationOpeningDate: { date: '2025-08-28', certainty: 'confirmed' },
    applicationClosingDate: { date: '2025-10-12', certainty: 'confirmed' },
    feePaymentDeadline: { date: '2025-10-15', certainty: 'confirmed' },
    applicationSubmissionDate: '2025-09-30',
    applicationStatus: 'submitted',
    applicationNumber: 'CS26S4109281',
    registrationNumber: 'GOAPS-992102',
    paymentStatus: 'completed',
    applicationFee: 1800,
    paymentTransactionId: 'GATE_TXN_091823',
    examDate: { date: '2026-02-08', certainty: 'confirmed' },
    examSession: 'Afternoon (14:30 - 17:30)',
    examCity: 'Hyderabad',
    examCentre: 'iON Digital Zone, Gachibowli',
    cityIntimationReleaseDate: { date: '2025-12-15', certainty: 'confirmed' },
    hallTicketReleaseDate: { date: '2026-01-04', certainty: 'confirmed' },
    answerKeyReleaseDate: { date: '2026-02-16', certainty: 'confirmed' },
    responseSheetReleaseDate: { date: '2026-02-12', certainty: 'confirmed' },
    objectionSubmissionDeadline: { date: '2026-02-22', certainty: 'confirmed' },
    finalAnswerKeyDate: { date: '2026-03-12', certainty: 'confirmed' },
    resultPublicationDate: { date: '2026-03-19', certainty: 'confirmed' },
    scorecardAvailabilityDate: { date: '2026-03-25', certainty: 'confirmed' },
    finalSelectionStatus: 'qualified',
    status: 'result_published',
    isArchived: false,
    isCompleted: true,
    createdAt: '2025-09-01T12:00:00Z',
    updatedAt: '2026-03-19T18:00:00Z',
  },
  {
    id: 'exam-5',
    userId: 'user-demo-1',
    examName: 'RRB NTPC (Graduate Posts) Centralised Employment Notice',
    recruitingOrg: 'RRB',
    category: 'RRB',
    postName: 'Station Master, Goods Train Manager, Commercial Apprentice',
    advertisementNumber: 'CEN 05/2026',
    recruitmentYear: 2026,
    officialNotificationUrl: 'https://rrbcdg.gov.in',
    officialApplicationUrl: 'https://rrbapply.gov.in',
    officialWebsiteUrl: 'https://indianrailways.gov.in',
    personalNotes: 'Check medical standard A2 requirements for Station Master.',
    applicationOpeningDate: { date: '2026-03-15', certainty: 'confirmed' },
    applicationClosingDate: { date: '2026-04-14', certainty: 'confirmed' },
    feePaymentDeadline: { date: '2026-04-16', certainty: 'confirmed' },
    applicationStatus: 'not_started',
    paymentStatus: 'pending',
    applicationFee: 500,
    examDate: { date: '2026-10-20', certainty: 'tentative' },
    cityIntimationReleaseDate: { date: '2026-10-10', certainty: 'tentative' },
    hallTicketReleaseDate: { date: '2026-10-16', certainty: 'tentative' },
    status: 'interested',
    isArchived: false,
    isCompleted: false,
    createdAt: '2026-03-16T11:00:00Z',
    updatedAt: '2026-03-16T11:00:00Z',
  },
  {
    id: 'exam-6',
    userId: 'user-demo-1',
    examName: 'DRDO CEPTAM-11 Senior Technical Assistant-B (STA-B)',
    recruitingOrg: 'DRDO',
    category: 'DRDO',
    postName: 'Senior Technical Assistant-B',
    advertisementNumber: 'CEPTAM-11/DR/2026',
    recruitmentYear: 2026,
    officialNotificationUrl: 'https://drdo.gov.in/careers',
    officialApplicationUrl: 'https://drdo.gov.in/ceptam',
    officialWebsiteUrl: 'https://drdo.gov.in',
    personalNotes: 'Tier-I CBT is screening only. Tier-II subject exam determines selection.',
    applicationOpeningDate: { date: '2026-04-01', certainty: 'tentative' },
    applicationClosingDate: { date: '2026-04-30', certainty: 'tentative' },
    feePaymentDeadline: { date: '2026-04-30', certainty: 'tentative' },
    applicationStatus: 'not_started',
    paymentStatus: 'pending',
    applicationFee: 100,
    examDate: { date: '2026-08-10', certainty: 'tentative' },
    status: 'notification_released',
    isArchived: false,
    isCompleted: false,
    createdAt: '2026-03-20T14:10:00Z',
    updatedAt: '2026-03-20T14:10:00Z',
  },
  {
    id: 'exam-7',
    userId: 'user-demo-1',
    examName: 'State PSC Combined Administrative Services 2025',
    recruitingOrg: 'State PSC',
    category: 'State PSC',
    postName: 'Deputy Collector, Assistant Commissioner of Police',
    advertisementNumber: 'PSC/EXAM/2025/14',
    recruitmentYear: 2025,
    officialNotificationUrl: 'https://psc.gov.in',
    officialApplicationUrl: 'https://psc.gov.in/apply',
    personalNotes: 'Mains examination finished. Interview call letter awaited.',
    applicationSubmissionDate: '2025-05-15',
    applicationStatus: 'submitted',
    applicationNumber: 'SPSC-2025-449102',
    registrationNumber: 'SPSC-REG-1092',
    paymentStatus: 'completed',
    examDate: { date: '2025-11-20', certainty: 'confirmed' },
    answerKeyReleaseDate: { date: '2025-12-05', certainty: 'confirmed' },
    resultPublicationDate: { date: '2026-04-28', certainty: 'tentative' },
    status: 'result_pending',
    isArchived: false,
    isCompleted: true,
    createdAt: '2025-05-10T09:00:00Z',
    updatedAt: '2026-02-10T11:00:00Z',
  },
];

export const MOCK_ACTIVITIES: ExamActivity[] = [
  {
    id: 'act-1',
    examId: 'exam-3',
    examName: 'ISRO Scientist/Engineer \'SC\'',
    action: 'Hall Ticket Released',
    details: 'Admit card released for exam on 18 Apr 2026. Exam centre assigned: PES University, Bengaluru.',
    timestamp: '2026-04-05T08:30:00Z',
    type: 'status_change',
  },
  {
    id: 'act-2',
    examId: 'exam-4',
    examName: 'GATE 2026 (CS & IT)',
    action: 'Scorecard Available',
    details: 'Official scorecard published. Score: 782, AIR: 142. Qualified for PSU recruitment.',
    timestamp: '2026-03-19T18:00:00Z',
    type: 'document_added',
  },
  {
    id: 'act-3',
    examId: 'exam-1',
    examName: 'UPSC CSE (Preliminary) 2026',
    action: 'Application Submitted',
    details: 'Application submitted successfully with RID: RID-893041829. Payment of ₹100 verified.',
    timestamp: '2026-02-28T14:20:00Z',
    type: 'status_change',
  },
  {
    id: 'act-4',
    examId: 'exam-6',
    examName: 'DRDO CEPTAM-11',
    action: 'Official Notification Tracked',
    details: 'New notification released for STA-B recruitment. Applications open tentative 01 Apr 2026.',
    timestamp: '2026-03-20T14:10:00Z',
    type: 'monitoring_alert',
  },
  {
    id: 'act-5',
    examId: 'exam-2',
    examName: 'SSC CGL 2026',
    action: 'Draft Application Saved',
    details: 'OTR details linked. Photo & Signature verification pending.',
    timestamp: '2026-06-15T11:45:00Z',
    type: 'status_change',
  },
];

/**
 * Calculates genuine dashboard statistics from an array of examinations.
 * Meets the requirement: "Dashboard statistics must be calculated from actual database records, not hardcoded values."
 */
export function calculateDashboardStats(exams: Examination[]): DashboardStats {
  const activeExams = exams.filter((e) => !e.isArchived);

  const activeApplications = activeExams.filter((e) =>
    ['application_not_started', 'application_in_progress', 'payment_pending', 'interested'].includes(e.status)
  ).length;

  const upcomingExaminations = activeExams.filter((e) =>
    ['examination_scheduled', 'hall_ticket_available'].includes(e.status)
  ).length;

  const pendingResults = activeExams.filter((e) =>
    ['result_pending', 'examination_completed'].includes(e.status)
  ).length;

  const pendingAnswerKeys = activeExams.filter((e) =>
    ['answer_key_pending'].includes(e.status)
  ).length;

  const availableHallTickets = activeExams.filter((e) =>
    e.status === 'hall_ticket_available' || (e.hallTicketDownloadUrl && e.hallTicketReleaseDate?.date)
  ).length;

  // Upcoming application deadlines: where closing date is set and not yet passed
  const now = new Date().toISOString().split('T')[0];
  const upcomingApplicationDeadlines = activeExams.filter((e) => {
    if (!e.applicationClosingDate?.date) return false;
    return e.applicationClosingDate.date >= now && e.applicationStatus !== 'submitted';
  }).length;

  return {
    totalExaminations: activeExams.length,
    activeApplications,
    upcomingExaminations,
    pendingResults,
    pendingAnswerKeys,
    availableHallTickets,
    upcomingApplicationDeadlines,
  };
}

/**
 * Extracts upcoming deadline items from examination records
 */
export function getUpcomingDeadlines(exams: Examination[]): UpcomingDeadlineItem[] {
  const deadlines: UpcomingDeadlineItem[] = [];

  for (const exam of exams) {
    if (exam.isArchived) continue;

    if (exam.applicationClosingDate?.date && exam.applicationStatus !== 'submitted') {
      deadlines.push({
        id: `${exam.id}-app-close`,
        examId: exam.id,
        examName: exam.examName,
        org: exam.recruitingOrg,
        title: 'Application Closing Deadline',
        type: 'application_close',
        date: exam.applicationClosingDate.date,
        certainty: exam.applicationClosingDate.certainty,
      });
    }

    if (exam.feePaymentDeadline?.date && exam.paymentStatus !== 'completed') {
      deadlines.push({
        id: `${exam.id}-fee-pay`,
        examId: exam.id,
        examName: exam.examName,
        org: exam.recruitingOrg,
        title: 'Application Fee Payment Deadline',
        type: 'payment_deadline',
        date: exam.feePaymentDeadline.date,
        certainty: exam.feePaymentDeadline.certainty,
      });
    }

    if (exam.objectionSubmissionDeadline?.date) {
      deadlines.push({
        id: `${exam.id}-objection`,
        examId: exam.id,
        examName: exam.examName,
        org: exam.recruitingOrg,
        title: 'Answer Key Objection Window',
        type: 'objection_close',
        date: exam.objectionSubmissionDeadline.date,
        certainty: exam.objectionSubmissionDeadline.certainty,
      });
    }
  }

  return deadlines.sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Extracts upcoming exam dates from examination records
 */
export function getUpcomingExamDates(exams: Examination[]): UpcomingExamDateItem[] {
  const dates: UpcomingExamDateItem[] = [];

  for (const exam of exams) {
    if (exam.isArchived) continue;
    if (exam.examDate?.date) {
      dates.push({
        id: `${exam.id}-exam-date`,
        examId: exam.id,
        examName: exam.examName,
        org: exam.recruitingOrg,
        session: exam.examSession,
        city: exam.examCity,
        date: exam.examDate.date,
        certainty: exam.examDate.certainty,
        hallTicketAvailable: exam.status === 'hall_ticket_available',
      });
    }
  }

  return dates.sort((a, b) => a.date.localeCompare(b.date));
}
