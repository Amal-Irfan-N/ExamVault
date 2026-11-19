export interface VaultCredential {
  id: string;
  examId?: string;
  examName: string;
  org: string; // e.g. UPSC, SSC, NTA, ISRO, IBPS, State PSC
  portalName: string;
  portalUrl: string;
  username: string;
  password: string;
  registrationNumber?: string;
  applicationNumber?: string;
  registeredEmail?: string;
  registeredMobile?: string;
  securityNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EncryptedCredentialRecord {
  id: string;
  examId?: string;
  org: string;
  portalName: string;
  portalUrl: string;
  ciphertext: string; // Base64 AES-GCM ciphertext
  iv: string; // Base64 12-byte IV
  salt: string; // Base64 16-byte salt
  createdAt: string;
  updatedAt: string;
}

export interface VaultSecurityConfig {
  isSetup: boolean;
  salt: string; // Base64 salt for master password
  verifier: string; // Base64 verification hash of master password
  autoLockMinutes: number; // 5, 10, 15, 30
  biometricEnabled?: boolean;
}
