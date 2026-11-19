export type DocumentCategory =
  | "official_notification"
  | "application_form"
  | "payment_receipt"
  | "application_confirmation"
  | "hall_ticket"
  | "city_intimation"
  | "answer_key"
  | "response_sheet"
  | "objection_receipt"
  | "final_answer_key"
  | "scorecard"
  | "result_pdf"
  | "certificate"
  | "other";

export interface DocumentCategoryMeta {
  id: DocumentCategory;
  label: string;
  shortLabel: string;
  iconName: string;
  color: string;
}

export const DOCUMENT_CATEGORIES: DocumentCategoryMeta[] = [
  {
    id: "official_notification",
    label: "Official Notification",
    shortLabel: "Notification",
    iconName: "Bell",
    color: "indigo",
  },
  {
    id: "application_form",
    label: "Application Form",
    shortLabel: "Application",
    iconName: "FileCheck2",
    color: "blue",
  },
  {
    id: "payment_receipt",
    label: "Payment Receipt",
    shortLabel: "Fee Receipt",
    iconName: "Receipt",
    color: "emerald",
  },
  {
    id: "application_confirmation",
    label: "Application Confirmation Slip",
    shortLabel: "Confirmation",
    iconName: "CheckSquare",
    color: "cyan",
  },
  {
    id: "hall_ticket",
    label: "Hall Ticket / Admit Card",
    shortLabel: "Admit Card",
    iconName: "Ticket",
    color: "violet",
  },
  {
    id: "city_intimation",
    label: "City Intimation Slip",
    shortLabel: "City Slip",
    iconName: "MapPin",
    color: "amber",
  },
  {
    id: "answer_key",
    label: "Provisional Answer Key",
    shortLabel: "Answer Key",
    iconName: "Key",
    color: "orange",
  },
  {
    id: "response_sheet",
    label: "Candidate Response Sheet",
    shortLabel: "Response Sheet",
    iconName: "FileText",
    color: "blue",
  },
  {
    id: "objection_receipt",
    label: "Objection Submission Receipt",
    shortLabel: "Objection",
    iconName: "AlertCircle",
    color: "rose",
  },
  {
    id: "final_answer_key",
    label: "Final Answer Key",
    shortLabel: "Final Key",
    iconName: "KeyRound",
    color: "purple",
  },
  {
    id: "scorecard",
    label: "Official Scorecard / Marks Sheet",
    shortLabel: "Scorecard",
    iconName: "Award",
    color: "emerald",
  },
  {
    id: "result_pdf",
    label: "Merit List / Result PDF",
    shortLabel: "Result PDF",
    iconName: "FileCheck",
    color: "green",
  },
  {
    id: "certificate",
    label: "Category / Eligibility Certificate",
    shortLabel: "Certificate",
    iconName: "ShieldCheck",
    color: "teal",
  },
  {
    id: "other",
    label: "Other Examination Document",
    shortLabel: "Other",
    iconName: "File",
    color: "slate",
  },
];

export interface VaultDocument {
  id: string;
  userId?: string;
  examId?: string;
  examName: string;
  title: string;
  category: DocumentCategory;
  fileName: string;
  fileType: "pdf" | "image";
  mimeType: string;
  fileSize: number; // in bytes
  fileSizeFormatted: string;
  fileUrl: string; // Object URL or base64 data URI
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
