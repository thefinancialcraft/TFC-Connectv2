import SHA256 from 'crypto-js/sha256';

/**
 * Utility for phone number encryption and decryption
 * Uses a simple XOR + Base64 scheme with a prefix for identification.
 * This allows both encrypted and plain text numbers to coexist.
 */

const SECRET_KEY = process.env.NEXT_PUBLIC_PHONE_ENCRYPTION_KEY || "TFC_CONNECT_SECURE_PHONE_VAULT";

/**
 * Computes a SHA-256 hash of the phone number for searching purposes.
 * This allows searching for a phone number without decrypting all records.
 */
export const computePhoneHash = (phone: string | null | undefined): string | null => {
    if (!phone) return null;
    // Normalize phone number if needed (e.g. remove spaces, dashes)
    // For now, we assume the input is the raw phone string as user types it.
    // We should probably strip common non-digit characters to make search more robust.
    const normalized = phone.replace(/[^0-9]/g, '');
    if (!normalized) return null;
    
    return SHA256(normalized).toString();
};

/**
 * Encrypts a phone number if it's not already encrypted
 */
export const encryptPhone = (phone: string | null | undefined): string => {
    if (!phone) return "";
    
    // Safety check: Don't encrypt if already encrypted
    if (phone.startsWith("__enc__")) return phone;

    try {
        // Simple symmetric XOR cipher
        const encrypted = phone.split('').map((char, i) => 
            String.fromCharCode(char.charCodeAt(0) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length))
        ).join('');
        
        // Convert to Base64 for DB storage
        return `__enc__${btoa(encrypted)}`;
    } catch (e) {
        console.error("Shield Encryption Failed:", e);
        return phone; // Fallback to plain text
    }
};

/**
 * Decrypts a phone number if it has the encryption prefix
 */
export const decryptPhone = (phone: string | null | undefined): string => {
    if (!phone) return "";
    
    // If it doesn't have our prefix, it's plain text (legacy data)
    if (!phone.startsWith("__enc__")) return phone;

    try {
        const base64Data = phone.substring(7); // Remove "__enc__"
        const encrypted = atob(base64Data);
        
        const decrypted = encrypted.split('').map((char, i) => 
            String.fromCharCode(char.charCodeAt(0) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length))
        ).join('');
        
        return decrypted;
    } catch (e) {
        console.warn("Shield Decryption Failed (possible corrupted data):", e);
        return phone; // Return as-is
    }
};

/**
 * Formats a phone number for display (can be used to mask numbers in UI)
 */
export const formatMaskedPhone = (phone: string | null | undefined): string => {
    const realPhone = decryptPhone(phone);
    if (!realPhone) return "—";
    
    if (realPhone.length < 4) return realPhone;
    
    // Show first 2 and last 2, mask the middle
    return realPhone.substring(0, 2) + "******" + realPhone.substring(realPhone.length - 2);
};
