import Dexie, { type Table } from "dexie";
import { Examination } from "@/types/examination";
import { VaultDocument } from "@/types/document";
import { EncryptedCredentialRecord } from "@/types/credential";

export interface LocalExamination {
  id: string;
  examName: string;
  recruitingOrg: string;
  category: string;
  postName?: string;
  advertisementNumber?: string;
  recruitmentYear?: number;
  applicationStatus: string;
  paymentStatus?: string;
  examDate?: string;
  dateCertainty?: string;
  isArchived: boolean;
  updatedAt: string;
  syncStatus: "synced" | "pending" | "conflict";
  fullData: Examination;
}

export interface LocalDocument {
  id: string;
  examId?: string;
  category: string;
  title: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileSizeFormatted: string;
  fileUrl: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  syncStatus: "synced" | "pending";
  fullData: VaultDocument;
}

export interface LocalEncryptedCredential {
  id: string;
  iv: string;
  salt: string;
  ciphertext: string;
  updatedAt: string;
  syncStatus: "synced" | "pending";
}

export interface OfflineMutation {
  id: string;
  entity: "examination" | "document" | "credential";
  entityId: string;
  action: "create" | "update" | "delete";
  payload?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  timestamp: number;
  status: "pending" | "syncing" | "failed";
  retryCount: number;
}

export interface CachedBlob {
  id: string; // document id
  documentId: string;
  fileName: string;
  mimeType: string;
  size: number;
  dataBase64?: string;
  cachedAt: number;
}

export interface AppSettingRecord {
  key: string;
  value: string;
  updatedAt: string;
}

export class ExamVaultDatabase extends Dexie {
  examinations!: Table<LocalExamination, string>;
  documents!: Table<LocalDocument, string>;
  credentials!: Table<LocalEncryptedCredential, string>;
  offlineMutations!: Table<OfflineMutation, string>;
  cachedBlobs!: Table<CachedBlob, string>;
  appSettings!: Table<AppSettingRecord, string>;

  constructor() {
    super("ExamVaultDB");

    this.version(1).stores({
      examinations: "id, examName, recruitingOrg, category, applicationStatus, examDate, isArchived, updatedAt, syncStatus",
      documents: "id, examId, category, title, fileName, fileType, updatedAt, syncStatus",
      credentials: "id, updatedAt, syncStatus",
      offlineMutations: "id, entity, entityId, action, status, timestamp",
      cachedBlobs: "id, documentId, cachedAt",
      appSettings: "key, updatedAt",
    });
  }
}

// Singleton database instance
export const examVaultDB = new ExamVaultDatabase();

/**
 * Storage quota and metrics helper
 */
export async function getStorageMetrics(): Promise<{
  usageBytes: number;
  quotaBytes: number;
  percentUsed: number;
  examCount: number;
  documentCount: number;
  credentialCount: number;
  pendingMutationCount: number;
  cachedBlobCount: number;
}> {
  let usageBytes = 0;
  let quotaBytes = 0;

  if (typeof window !== "undefined" && navigator.storage && navigator.storage.estimate) {
    try {
      const estimate = await navigator.storage.estimate();
      usageBytes = estimate.usage || 0;
      quotaBytes = estimate.quota || 0;
    } catch (e) {
      console.warn("Storage estimate not available:", e);
    }
  }

  try {
    const [examCount, documentCount, credentialCount, pendingMutationCount, cachedBlobCount] = await Promise.all([
      examVaultDB.examinations.count(),
      examVaultDB.documents.count(),
      examVaultDB.credentials.count(),
      examVaultDB.offlineMutations.where("status").equals("pending").count(),
      examVaultDB.cachedBlobs.count(),
    ]);

    const percentUsed = quotaBytes > 0 ? (usageBytes / quotaBytes) * 100 : 0;

    return {
      usageBytes,
      quotaBytes,
      percentUsed,
      examCount,
      documentCount,
      credentialCount,
      pendingMutationCount,
      cachedBlobCount,
    };
  } catch (err) {
    console.warn("Error reading Dexie counts:", err);
    return {
      usageBytes: 0,
      quotaBytes: 0,
      percentUsed: 0,
      examCount: 0,
      documentCount: 0,
      credentialCount: 0,
      pendingMutationCount: 0,
      cachedBlobCount: 0,
    };
  }
}

/**
 * Seed initial examinations into IndexedDB if table is empty
 */
export async function seedDatabaseIfEmpty(
  initialExams: Examination[],
  initialDocs: VaultDocument[],
  initialCreds: EncryptedCredentialRecord[]
): Promise<void> {
  try {
    const examCount = await examVaultDB.examinations.count();
    if (examCount === 0 && initialExams.length > 0) {
      const localExams: LocalExamination[] = initialExams.map((exam) => ({
        id: exam.id,
        examName: exam.examName,
        recruitingOrg: exam.recruitingOrg,
        category: exam.category,
        postName: exam.postName,
        advertisementNumber: exam.advertisementNumber,
        recruitmentYear: exam.recruitmentYear,
        applicationStatus: exam.status,
        paymentStatus: exam.paymentStatus,
        examDate: exam.examDate?.date || undefined,
        dateCertainty: exam.examDate?.certainty || undefined,
        isArchived: exam.isArchived || false,
        updatedAt: exam.updatedAt || new Date().toISOString(),
        syncStatus: "synced",
        fullData: exam,
      }));
      await examVaultDB.examinations.bulkPut(localExams);
    }

    const docCount = await examVaultDB.documents.count();
    if (docCount === 0 && initialDocs.length > 0) {
      const localDocs: LocalDocument[] = initialDocs.map((doc) => ({
        id: doc.id,
        examId: doc.examId,
        category: doc.category,
        title: doc.title,
        fileName: doc.fileName,
        fileType: doc.fileType,
        fileSize: doc.fileSize,
        fileSizeFormatted: doc.fileSizeFormatted,
        fileUrl: doc.fileUrl,
        notes: doc.notes,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
        syncStatus: "synced",
        fullData: doc,
      }));
      await examVaultDB.documents.bulkPut(localDocs);
    }

    const credCount = await examVaultDB.credentials.count();
    if (credCount === 0 && initialCreds.length > 0) {
      const localCreds: LocalEncryptedCredential[] = initialCreds.map((cred) => ({
        id: cred.id,
        iv: cred.iv,
        salt: cred.salt,
        ciphertext: cred.ciphertext,
        updatedAt: cred.updatedAt,
        syncStatus: "synced",
      }));
      await examVaultDB.credentials.bulkPut(localCreds);
    }
  } catch (err) {
    console.warn("Error seeding IndexedDB:", err);
  }
}
