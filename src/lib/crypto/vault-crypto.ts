/**
 * ExamVault - Client-Side Cryptographic Engine
 *
 * Implements authenticated AES-GCM 256-bit encryption with PBKDF2 key derivation
 * using the standard Web Crypto API (SubtleCrypto).
 *
 * Security Architecture:
 * - PBKDF2 with SHA-256 and 100,000 iterations for key derivation from Master Password
 * - Cryptographically secure 16-byte random salts (window.crypto.getRandomValues)
 * - Cryptographically secure 12-byte random Initialization Vectors (IV) per encryption
 * - Authenticated AES-GCM 256-bit encryption guaranteeing confidentiality and integrity
 * - Zero plaintext credentials ever transmitted over network or written to unencrypted storage
 */

export const PBKDF2_ITERATIONS = 100000;
export const HASH_ALGO = "SHA-256";
export const KEY_LENGTH = 256;
export const IV_LENGTH = 12; // 96 bits for AES-GCM
export const SALT_LENGTH = 16; // 128 bits

// Utility: ArrayBuffer <-> Base64
export function bufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export function base64ToBuffer(base64: string): ArrayBuffer {
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

// Generate cryptographically secure random bytes
export function getRandomBytes(length: number): Uint8Array {
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return array;
}

/**
 * Derives an AES-GCM CryptoKey from a user-supplied Master Password and a salt
 */
export async function deriveKeyFromPassword(
  password: string,
  salt: Uint8Array
): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);

  // Import raw password as key material
  const baseKey = await window.crypto.subtle.importKey(
    "raw",
    passwordBuffer,
    "PBKDF2",
    false,
    ["deriveKey", "deriveBits"]
  );

  // Derive AES-GCM encryption key
  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt as BufferSource,
      iterations: PBKDF2_ITERATIONS,
      hash: HASH_ALGO,
    },
    baseKey,
    {
      name: "AES-GCM",
      length: KEY_LENGTH,
    },
    false,
    ["encrypt", "decrypt"]
  );
}

/**
 * Creates a verification hash of the Master Password to confirm unlock validity
 */
export async function createPasswordVerifier(
  password: string,
  salt: Uint8Array
): Promise<string> {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);

  const baseKey = await window.crypto.subtle.importKey(
    "raw",
    passwordBuffer,
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const derivedBits = await window.crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt as BufferSource,
      iterations: PBKDF2_ITERATIONS,
      hash: HASH_ALGO,
    },
    baseKey,
    256
  );

  return bufferToBase64(derivedBits);
}

export interface EncryptedPayload {
  ciphertext: string; // Base64
  iv: string; // Base64
  salt: string; // Base64
}

/**
 * Encrypts an arbitrary JSON-serializable object using AES-GCM
 */
export async function encryptData<T>(
  data: T,
  masterKey: CryptoKey,
  salt: Uint8Array
): Promise<EncryptedPayload> {
  const encoder = new TextEncoder();
  const plaintextBuffer = encoder.encode(JSON.stringify(data));

  const iv = getRandomBytes(IV_LENGTH);

  const ciphertextBuffer = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv as BufferSource,
    },
    masterKey,
    plaintextBuffer
  );

  return {
    ciphertext: bufferToBase64(ciphertextBuffer),
    iv: bufferToBase64(iv),
    salt: bufferToBase64(salt),
  };
}

/**
 * Decrypts an encrypted payload using AES-GCM with masterKey
 */
export async function decryptData<T>(
  payload: { ciphertext: string; iv: string },
  masterKey: CryptoKey
): Promise<T> {
  const ciphertextBuffer = base64ToBuffer(payload.ciphertext);
  const ivBuffer = base64ToBuffer(payload.iv);

  const decryptedBuffer = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: new Uint8Array(ivBuffer),
    },
    masterKey,
    ciphertextBuffer
  );

  const decoder = new TextDecoder();
  const jsonString = decoder.decode(decryptedBuffer);
  return JSON.parse(jsonString) as T;
}

/**
 * Generates a cryptographically secure random password with customized complexity
 */
export function generateSecurePassword(
  length: number = 16,
  options: {
    numbers?: boolean;
    symbols?: boolean;
    uppercase?: boolean;
    lowercase?: boolean;
  } = { numbers: true, symbols: true, uppercase: true, lowercase: true }
): string {
  let charset = "";
  if (options.lowercase !== false) charset += "abcdefghjkmnpqrstuvwxyz";
  if (options.uppercase !== false) charset += "ABCDEFGHJKMNPQRSTUVWXYZ";
  if (options.numbers !== false) charset += "23456789";
  if (options.symbols !== false) charset += "!@#$%^&*-_=+?";

  if (!charset) charset = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789!@#$%^&*";

  const randomValues = getRandomBytes(length);
  let result = "";
  for (let i = 0; i < length; i++) {
    result += charset[randomValues[i] % charset.length];
  }
  return result;
}
