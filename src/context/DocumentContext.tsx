"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { VaultDocument } from "@/types/document";
import { examVaultDB, seedDatabaseIfEmpty, LocalDocument } from "@/lib/db/indexed-db";

interface DocumentContextType {
  documents: VaultDocument[];
  addDocument: (doc: Omit<VaultDocument, "id" | "createdAt" | "updatedAt">) => void;
  updateDocument: (id: string, updates: Partial<VaultDocument>) => void;
  renameDocument: (id: string, newTitle: string) => void;
  deleteDocument: (id: string) => void;
  getDocumentsByExam: (examId: string) => VaultDocument[];
  totalStorageBytes: number;
}

const STORAGE_KEY = "examvault_documents_v1";

const INITIAL_MOCK_DOCUMENTS: VaultDocument[] = [
  {
    id: "doc-1",
    examId: "exam-1",
    examName: "UPSC Civil Services Examination 2026",
    title: "UPSC CSE 2026 Confirmation & Application Form",
    category: "application_form",
    fileName: "UPSC_CSE_2026_Application_Form.pdf",
    fileType: "pdf",
    mimeType: "application/pdf",
    fileSize: 1468006, // ~1.4 MB
    fileSizeFormatted: "1.4 MB",
    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    notes: "Submitted on UPSC OTR portal with registration ID UPSC2026884102.",
    createdAt: "2026-02-28T14:32:00Z",
    updatedAt: "2026-02-28T14:32:00Z",
  },
  {
    id: "doc-2",
    examId: "exam-1",
    examName: "UPSC Civil Services Examination 2026",
    title: "SBI e-Pay Transaction Receipt (₹100)",
    category: "payment_receipt",
    fileName: "SBI_Payment_Challan_UPSC_₹100.pdf",
    fileType: "pdf",
    mimeType: "application/pdf",
    fileSize: 430080, // ~420 KB
    fileSizeFormatted: "420 KB",
    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    notes: "Transaction Reference DU481928472. Status: Success.",
    createdAt: "2026-02-28T14:35:10Z",
    updatedAt: "2026-02-28T14:35:10Z",
  },
  {
    id: "doc-3",
    examId: "exam-2",
    examName: "ISRO Scientist/Engineer 'SC' 2026",
    title: "ICRB Scientist/Engineer Official Admit Card",
    category: "hall_ticket",
    fileName: "ISRO_ICRB_HallTicket_ScientistSC.pdf",
    fileType: "pdf",
    mimeType: "application/pdf",
    fileSize: 870400, // ~850 KB
    fileSizeFormatted: "850 KB",
    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    notes: "Reporting time: 08:00 AM at Bengaluru Centre 04.",
    createdAt: "2026-04-05T10:15:00Z",
    updatedAt: "2026-04-05T10:15:00Z",
  },
  {
    id: "doc-4",
    examId: "exam-3",
    examName: "GATE 2026 (CS & IT)",
    title: "GATE 2026 Official Scorecard (AIR 482)",
    category: "scorecard",
    fileName: "GATE_2026_Official_Scorecard_CS.pdf",
    fileType: "pdf",
    mimeType: "application/pdf",
    fileSize: 626688, // ~612 KB
    fileSizeFormatted: "612 KB",
    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    notes: "Marks: 72.33 / 100. Normalized Score: 782. Qualified for PSU recruitment.",
    createdAt: "2026-03-25T16:00:00Z",
    updatedAt: "2026-03-25T16:00:00Z",
  },
  {
    id: "doc-5",
    examId: "exam-6",
    examName: "State PSC Combined Services Examination",
    title: "Signed Admit Card & Verification Photo",
    category: "hall_ticket",
    fileName: "State_PSC_Mains_Admit_Card_Signed.jpg",
    fileType: "image",
    mimeType: "image/jpeg",
    fileSize: 2202009, // ~2.1 MB
    fileSizeFormatted: "2.1 MB",
    fileUrl: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=1200&q=80",
    notes: "Scanned photo of hall ticket with invigilator signature and seal.",
    createdAt: "2025-11-10T09:20:00Z",
    updatedAt: "2025-11-10T09:20:00Z",
  },
  {
    id: "doc-6",
    examId: "exam-2",
    examName: "ISRO Scientist/Engineer 'SC' 2026",
    title: "ICRB Official Recruitment Notification 2026",
    category: "official_notification",
    fileName: "ISRO_ICRB_Advt_01_2026_Scientist.pdf",
    fileType: "pdf",
    mimeType: "application/pdf",
    fileSize: 3145728, // ~3.0 MB
    fileSizeFormatted: "3.0 MB",
    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    notes: "Official notification with syllabus and eligibility criteria.",
    createdAt: "2026-01-15T08:00:00Z",
    updatedAt: "2026-01-15T08:00:00Z",
  },
];

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export function DocumentProvider({ children }: { children: React.ReactNode }) {
  const [documents, setDocuments] = useState<VaultDocument[]>(() => {
    if (typeof window === "undefined") return INITIAL_MOCK_DOCUMENTS;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Failed to read documents from localStorage:", e);
    }
    return INITIAL_MOCK_DOCUMENTS;
  });

  // Load from IndexedDB on initial mount
  useEffect(() => {
    async function loadDocumentsFromIndexedDB() {
      try {
        const stored = await examVaultDB.documents.toArray();
        if (stored.length > 0) {
          const list = stored.map((item) => (item.fullData ? item.fullData : item));
          setDocuments(list as unknown as VaultDocument[]);
        } else {
          await seedDatabaseIfEmpty([], INITIAL_MOCK_DOCUMENTS, []);
        }
      } catch (err) {
        console.warn("IndexedDB document load error, fallback to localStorage:", err);
      }
    }
    loadDocumentsFromIndexedDB();
  }, []);

  // Save to localStorage and IndexedDB (Dexie) whenever documents change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
      const localDocs: LocalDocument[] = documents.map((doc) => ({
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
      examVaultDB.documents.bulkPut(localDocs).catch((e) => console.warn("Dexie bulkPut documents error:", e));
    } catch (e) {
      console.warn("Failed to persist documents:", e);
    }
  }, [documents]);

  const addDocument = (docData: Omit<VaultDocument, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString();
    const newDoc: VaultDocument = {
      ...docData,
      id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: now,
      updatedAt: now,
    };
    setDocuments((prev) => [newDoc, ...prev]);

    if (typeof window !== "undefined" && !navigator.onLine) {
      examVaultDB.offlineMutations
        .add({
          id: `mut-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          entity: "document",
          entityId: newDoc.id,
          action: "create",
          payload: newDoc,
          timestamp: Date.now(),
          status: "pending",
          retryCount: 0,
        })
        .catch((e) => console.warn("Failed to queue offline document mutation:", e));
    }
  };

  const updateDocument = (id: string, updates: Partial<VaultDocument>) => {
    const now = new Date().toISOString();
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updates, updatedAt: now } : d))
    );

    if (typeof window !== "undefined" && !navigator.onLine) {
      examVaultDB.offlineMutations
        .add({
          id: `mut-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          entity: "document",
          entityId: id,
          action: "update",
          payload: updates,
          timestamp: Date.now(),
          status: "pending",
          retryCount: 0,
        })
        .catch((e) => console.warn("Failed to queue offline document update mutation:", e));
    }
  };

  const renameDocument = (id: string, newTitle: string) => {
    if (!newTitle.trim()) return;
    updateDocument(id, { title: newTitle.trim() });
  };

  const deleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    examVaultDB.documents.delete(id).catch((e) => console.warn("Dexie delete document error:", e));
    examVaultDB.cachedBlobs.delete(id).catch(() => {});

    if (typeof window !== "undefined" && !navigator.onLine) {
      examVaultDB.offlineMutations
        .add({
          id: `mut-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          entity: "document",
          entityId: id,
          action: "delete",
          payload: { id },
          timestamp: Date.now(),
          status: "pending",
          retryCount: 0,
        })
        .catch((e) => console.warn("Failed to queue offline document delete mutation:", e));
    }
  };

  const getDocumentsByExam = (examId: string) => {
    return documents.filter((d) => d.examId === examId);
  };

  const totalStorageBytes = useMemo(() => {
    return documents.reduce((acc, curr) => acc + (curr.fileSize || 0), 0);
  }, [documents]);

  return (
    <DocumentContext.Provider
      value={{
        documents,
        addDocument,
        updateDocument,
        renameDocument,
        deleteDocument,
        getDocumentsByExam,
        totalStorageBytes,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
}

export function useDocuments() {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error("useDocuments must be used within a DocumentProvider");
  }
  return context;
}
