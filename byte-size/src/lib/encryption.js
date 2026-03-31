/**
 * AES-GCM field-level encryption for Firestore data.
 * Uses Web Crypto API (browser-compatible).
 *
 * Requires NEXT_PUBLIC_ENCRYPTION_KEY env var — a base64-encoded 256-bit key.
 * Generate one with: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
 */

const ENCRYPTION_KEY_B64 = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;

async function getKey() {
  if (!ENCRYPTION_KEY_B64) return null;
  const raw = Uint8Array.from(atob(ENCRYPTION_KEY_B64), (c) => c.charCodeAt(0));
  return crypto.subtle.importKey("raw", raw, "AES-GCM", false, ["encrypt", "decrypt"]);
}

/**
 * Encrypt a plaintext string. Returns a base64 string (iv + ciphertext).
 * If no encryption key is configured, returns the plaintext unchanged.
 */
export async function encryptField(plaintext) {
  if (!plaintext || !ENCRYPTION_KEY_B64) return plaintext;
  const key = await getKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(plaintext);
  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoded);
  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(ciphertext), iv.length);
  return "enc:" + btoa(String.fromCharCode(...combined));
}

/**
 * Decrypt a string produced by encryptField. Returns the original plaintext.
 * If the value doesn't start with "enc:" or no key is set, returns as-is.
 */
export async function decryptField(encrypted) {
  if (!encrypted || !ENCRYPTION_KEY_B64 || !encrypted.startsWith("enc:")) return encrypted;
  try {
    const key = await getKey();
    const combined = Uint8Array.from(atob(encrypted.slice(4)), (c) => c.charCodeAt(0));
    const iv = combined.slice(0, 12);
    const ciphertext = combined.slice(12);
    const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ciphertext);
    return new TextDecoder().decode(decrypted);
  } catch {
    return encrypted;
  }
}
