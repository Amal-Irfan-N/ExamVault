"use client";

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import {
  VaultCredential,
  EncryptedCredentialRecord,
  VaultSecurityConfig,
} from "@/types/credential";
import {
  deriveKeyFromPassword,
  createPasswordVerifier,
  encryptData,
  decryptData,
  getRandomBytes,
  base64ToBuffer,
  bufferToBase64,
} from "@/lib/crypto/vault-crypto";
import { examVaultDB, LocalEncryptedCredential } from "@/lib/db/indexed-db";

interface VaultContextType {
  isVaultSetup: boolean;
  isUnlocked: boolean;
  credentials: VaultCredential[];
  autoLockMinutes: number;
  remainingSeconds: number;
  setupMasterPassword: (password: string) => Promise<boolean>;
  unlockVault: (password: string) => Promise<boolean>;
  lockVault: () => void;
  resetAutoLockTimer: () => void;
  setAutoLockMinutes: (minutes: number) => void;
  addCredential: (cred: Omit<VaultCredential, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  updateCredential: (id: string, updates: Partial<VaultCredential>) => Promise<void>;
  deleteCredential: (id: string) => Promise<void>;
}

const CONFIG_STORAGE_KEY = "examvault_security_config_v1";
const RECORDS_STORAGE_KEY = "examvault_encrypted_records_v1";

const VaultContext = createContext<VaultContextType | undefined>(undefined);

// Initial sample credentials encrypted with default password 'ExamVault@2026'
const INITIAL_SAMPLE_CREDENTIALS: Omit<VaultCredential, "id" | "createdAt" | "updatedAt">[] = [
  {
    examId: "exam-1",
    examName: "UPSC Civil Services Examination 2026",
    org: "UPSC",
    portalName: "UPSC One Time Registration (OTR)",
    portalUrl: "https://upsconline.nic.in",
    username: "OTR-IND-88401920",
    password: "UPSC#Aman$2026!",
    registrationNumber: "RID-893041829",
    applicationNumber: "UPSC2026987412",
    registeredEmail: "aman.verma.exam@gmail.com",
    registeredMobile: "+91 98765 43210",
    securityNotes: "OTR Security Question: Primary School Name. 2FA sent via SMS & Email.",
  },
  {
    examId: "exam-4",
    examName: "SSC Combined Graduate Level (CGL) 2026",
    org: "SSC",
    portalName: "Staff Selection Commission Portal",
    portalUrl: "https://ssc.gov.in",
    username: "SSC-OTR-88401923",
    password: "SSC#AmanVault@26",
    registrationNumber: "SSC-OTR-88401923",
    applicationNumber: "SSC-CGL-2026-90184",
    registeredEmail: "aman.verma.exam@gmail.com",
    registeredMobile: "+91 98765 43210",
    securityNotes: "Requires live selfie capture during login. OTR registration completed in Jan 2026.",
  },
  {
    examId: "exam-3",
    examName: "GATE 2026 (CS & IT)",
    org: "GATE",
    portalName: "GOAPS 2026 Candidate Login",
    portalUrl: "https://goaps.iitr.ac.in",
    username: "CS26S4109281",
    password: "GATE#GoapsPass99*",
    registrationNumber: "GOAPS-992102",
    applicationNumber: "CS26S4109281",
    registeredEmail: "aman.verma.exam@gmail.com",
    registeredMobile: "+91 98765 43210",
    securityNotes: "Enrollment ID CS26S4109281 for admit card and scorecard access.",
  },
];

export function VaultProvider({ children }: { children: React.ReactNode }) {
  // Vault state
  const [config, setConfig] = useState<VaultSecurityConfig | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem(CONFIG_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [credentials, setCredentials] = useState<VaultCredential[]>([]);
  const [autoLockMinutes, setAutoLockMinutesState] = useState<number>(15);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(15 * 60);

  // Active derived CryptoKey kept in memory only while unlocked
  const activeKeyRef = useRef<CryptoKey | null>(null);
  const autoLockTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Lock Vault: immediately purge decrypted memory & CryptoKey
  const lockVault = useCallback(() => {
    activeKeyRef.current = null;
    setCredentials([]);
    setIsUnlocked(false);
    if (autoLockTimerRef.current) {
      clearInterval(autoLockTimerRef.current);
      autoLockTimerRef.current = null;
    }
  }, []);

  // Reset auto-lock timer
  const resetAutoLockTimer = useCallback(() => {
    setRemainingSeconds(autoLockMinutes * 60);
  }, [autoLockMinutes]);

  // Tick countdown timer when unlocked
  useEffect(() => {
    if (!isUnlocked) return;

    autoLockTimerRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          lockVault();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (autoLockTimerRef.current) {
        clearInterval(autoLockTimerRef.current);
      }
    };
  }, [isUnlocked, lockVault]);

  // Listen to user activity to reset auto-lock
  useEffect(() => {
    if (!isUnlocked) return;

    const handleUserActivity = () => {
      resetAutoLockTimer();
    };

    window.addEventListener("keydown", handleUserActivity);
    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("touchstart", handleUserActivity);

    return () => {
      window.removeEventListener("keydown", handleUserActivity);
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("touchstart", handleUserActivity);
    };
  }, [isUnlocked, resetAutoLockTimer]);

  // Setup Master Password
  const setupMasterPassword = async (password: string): Promise<boolean> => {
    try {
      const salt = getRandomBytes(16);
      const verifier = await createPasswordVerifier(password, salt);
      const masterKey = await deriveKeyFromPassword(password, salt);

      const newConfig: VaultSecurityConfig = {
        isSetup: true,
        salt: bufferToBase64(salt),
        verifier,
        autoLockMinutes: 15,
      };

      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(newConfig));
      setConfig(newConfig);

      // Encrypt initial sample credentials into storage
      const encryptedRecords: EncryptedCredentialRecord[] = [];
      const now = new Date().toISOString();

      for (const sample of INITIAL_SAMPLE_CREDENTIALS) {
        const credId = `cred-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        const recSalt = getRandomBytes(16);
        const encrypted = await encryptData(
          {
            username: sample.username,
            password: sample.password,
            registrationNumber: sample.registrationNumber,
            applicationNumber: sample.applicationNumber,
            registeredEmail: sample.registeredEmail,
            registeredMobile: sample.registeredMobile,
            securityNotes: sample.securityNotes,
          },
          masterKey,
          recSalt
        );

        encryptedRecords.push({
          id: credId,
          examId: sample.examId,
          org: sample.org,
          portalName: sample.portalName,
          portalUrl: sample.portalUrl,
          ciphertext: encrypted.ciphertext,
          iv: encrypted.iv,
          salt: encrypted.salt,
          createdAt: now,
          updatedAt: now,
        });
      }

      localStorage.setItem(RECORDS_STORAGE_KEY, JSON.stringify(encryptedRecords));

      // Persist encrypted records into IndexedDB
      const dexieCreds: LocalEncryptedCredential[] = encryptedRecords.map((r) => ({
        id: r.id,
        iv: r.iv,
        salt: r.salt,
        ciphertext: r.ciphertext,
        updatedAt: r.updatedAt,
        syncStatus: "synced",
      }));
      examVaultDB.credentials.bulkPut(dexieCreds).catch((e) => console.warn("Dexie credentials put error:", e));

      // Unlock immediately
      activeKeyRef.current = masterKey;
      setCredentials(
        INITIAL_SAMPLE_CREDENTIALS.map((s, idx) => ({
          ...s,
          id: encryptedRecords[idx].id,
          createdAt: now,
          updatedAt: now,
        }))
      );
      setIsUnlocked(true);
      resetAutoLockTimer();
      return true;
    } catch (e) {
      console.error("Failed to setup master password:", e);
      return false;
    }
  };

  // Unlock Vault
  const unlockVault = async (password: string): Promise<boolean> => {
    if (!config) return false;

    try {
      const saltBuffer = new Uint8Array(base64ToBuffer(config.salt));
      const testVerifier = await createPasswordVerifier(password, saltBuffer);

      if (testVerifier !== config.verifier) {
        return false;
      }

      // Password matches! Derive CryptoKey
      const masterKey = await deriveKeyFromPassword(password, saltBuffer);
      activeKeyRef.current = masterKey;

      // Load and decrypt stored records
      const stored = localStorage.getItem(RECORDS_STORAGE_KEY);
      const encryptedList: EncryptedCredentialRecord[] = stored ? JSON.parse(stored) : [];

      const decryptedList: VaultCredential[] = [];

      for (const rec of encryptedList) {
        try {
          const sensitive = await decryptData<{
            username: string;
            password: string;
            registrationNumber?: string;
            applicationNumber?: string;
            registeredEmail?: string;
            registeredMobile?: string;
            securityNotes?: string;
          }>({ ciphertext: rec.ciphertext, iv: rec.iv }, masterKey);

          decryptedList.push({
            id: rec.id,
            examId: rec.examId,
            examName: rec.org + " Examination Portal",
            org: rec.org,
            portalName: rec.portalName,
            portalUrl: rec.portalUrl,
            username: sensitive.username,
            password: sensitive.password,
            registrationNumber: sensitive.registrationNumber,
            applicationNumber: sensitive.applicationNumber,
            registeredEmail: sensitive.registeredEmail,
            registeredMobile: sensitive.registeredMobile,
            securityNotes: sensitive.securityNotes,
            createdAt: rec.createdAt,
            updatedAt: rec.updatedAt,
          });
        } catch (decryptErr) {
          console.warn(`Failed to decrypt record ${rec.id}:`, decryptErr);
        }
      }

      setCredentials(decryptedList);
      setIsUnlocked(true);
      resetAutoLockTimer();
      return true;
    } catch (e) {
      console.error("Unlock error:", e);
      return false;
    }
  };

  const addCredential = async (
    credData: Omit<VaultCredential, "id" | "createdAt" | "updatedAt">
  ) => {
    if (!activeKeyRef.current) throw new Error("Vault is locked");

    const now = new Date().toISOString();
    const id = `cred-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const salt = getRandomBytes(16);

    const encrypted = await encryptData(
      {
        username: credData.username,
        password: credData.password,
        registrationNumber: credData.registrationNumber,
        applicationNumber: credData.applicationNumber,
        registeredEmail: credData.registeredEmail,
        registeredMobile: credData.registeredMobile,
        securityNotes: credData.securityNotes,
      },
      activeKeyRef.current,
      salt
    );

    const newRecord: EncryptedCredentialRecord = {
      id,
      examId: credData.examId,
      org: credData.org,
      portalName: credData.portalName,
      portalUrl: credData.portalUrl,
      ciphertext: encrypted.ciphertext,
      iv: encrypted.iv,
      salt: encrypted.salt,
      createdAt: now,
      updatedAt: now,
    };

    // Update storage
    const stored = localStorage.getItem(RECORDS_STORAGE_KEY);
    const list: EncryptedCredentialRecord[] = stored ? JSON.parse(stored) : [];
    list.unshift(newRecord);
    localStorage.setItem(RECORDS_STORAGE_KEY, JSON.stringify(list));

    // Save encrypted record into IndexedDB
    examVaultDB.credentials
      .put({
        id: newRecord.id,
        iv: newRecord.iv,
        salt: newRecord.salt,
        ciphertext: newRecord.ciphertext,
        updatedAt: newRecord.updatedAt,
        syncStatus: "synced",
      })
      .catch((e) => console.warn("Dexie put credential error:", e));

    if (typeof window !== "undefined" && !navigator.onLine) {
      examVaultDB.offlineMutations
        .add({
          id: `mut-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          entity: "credential",
          entityId: newRecord.id,
          action: "create",
          payload: { id: newRecord.id, org: newRecord.org, portalName: newRecord.portalName },
          timestamp: Date.now(),
          status: "pending",
          retryCount: 0,
        })
        .catch((e) => console.warn("Failed to queue offline credential mutation:", e));
    }

    // Update decrypted state
    const newDecrypted: VaultCredential = {
      ...credData,
      id,
      createdAt: now,
      updatedAt: now,
    };
    setCredentials((prev) => [newDecrypted, ...prev]);
    resetAutoLockTimer();
  };

  const updateCredential = async (id: string, updates: Partial<VaultCredential>) => {
    if (!activeKeyRef.current) throw new Error("Vault is locked");

    const target = credentials.find((c) => c.id === id);
    if (!target) return;

    const merged = { ...target, ...updates, updatedAt: new Date().toISOString() };
    const salt = getRandomBytes(16);

    const encrypted = await encryptData(
      {
        username: merged.username,
        password: merged.password,
        registrationNumber: merged.registrationNumber,
        applicationNumber: merged.applicationNumber,
        registeredEmail: merged.registeredEmail,
        registeredMobile: merged.registeredMobile,
        securityNotes: merged.securityNotes,
      },
      activeKeyRef.current,
      salt
    );

    // Update storage
    const stored = localStorage.getItem(RECORDS_STORAGE_KEY);
    const list: EncryptedCredentialRecord[] = stored ? JSON.parse(stored) : [];
    const updatedList = list.map((item) =>
      item.id === id
        ? {
            ...item,
            examId: merged.examId,
            org: merged.org,
            portalName: merged.portalName,
            portalUrl: merged.portalUrl,
            ciphertext: encrypted.ciphertext,
            iv: encrypted.iv,
            salt: encrypted.salt,
            updatedAt: merged.updatedAt,
          }
        : item
    );
    localStorage.setItem(RECORDS_STORAGE_KEY, JSON.stringify(updatedList));

    // Update in IndexedDB
    examVaultDB.credentials
      .update(id, {
        ciphertext: encrypted.ciphertext,
        iv: encrypted.iv,
        salt: encrypted.salt,
        updatedAt: merged.updatedAt,
      })
      .catch((e) => console.warn("Dexie update credential error:", e));

    if (typeof window !== "undefined" && !navigator.onLine) {
      examVaultDB.offlineMutations
        .add({
          id: `mut-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          entity: "credential",
          entityId: id,
          action: "update",
          payload: { id, org: merged.org, portalName: merged.portalName },
          timestamp: Date.now(),
          status: "pending",
          retryCount: 0,
        })
        .catch((e) => console.warn("Failed to queue offline credential update:", e));
    }

    // Update decrypted state
    setCredentials((prev) => prev.map((c) => (c.id === id ? merged : c)));
    resetAutoLockTimer();
  };

  const deleteCredential = async (id: string) => {
    const stored = localStorage.getItem(RECORDS_STORAGE_KEY);
    const list: EncryptedCredentialRecord[] = stored ? JSON.parse(stored) : [];
    const filtered = list.filter((item) => item.id !== id);
    localStorage.setItem(RECORDS_STORAGE_KEY, JSON.stringify(filtered));

    examVaultDB.credentials.delete(id).catch((e) => console.warn("Dexie delete credential error:", e));

    if (typeof window !== "undefined" && !navigator.onLine) {
      examVaultDB.offlineMutations
        .add({
          id: `mut-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          entity: "credential",
          entityId: id,
          action: "delete",
          payload: { id },
          timestamp: Date.now(),
          status: "pending",
          retryCount: 0,
        })
        .catch((e) => console.warn("Failed to queue offline credential delete:", e));
    }

    setCredentials((prev) => prev.filter((c) => c.id !== id));
    resetAutoLockTimer();
  };

  const setAutoLockMinutes = (minutes: number) => {
    setAutoLockMinutesState(minutes);
    setRemainingSeconds(minutes * 60);
  };

  return (
    <VaultContext.Provider
      value={{
        isVaultSetup: Boolean(config?.isSetup),
        isUnlocked,
        credentials,
        autoLockMinutes,
        remainingSeconds,
        setupMasterPassword,
        unlockVault,
        lockVault,
        resetAutoLockTimer,
        setAutoLockMinutes,
        addCredential,
        updateCredential,
        deleteCredential,
      }}
    >
      {children}
    </VaultContext.Provider>
  );
}

export function useVault() {
  const context = useContext(VaultContext);
  if (!context) {
    throw new Error("useVault must be used within a VaultProvider");
  }
  return context;
}
