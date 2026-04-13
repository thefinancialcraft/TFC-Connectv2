import SHA256 from 'crypto-js/sha256';
import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';
import { getStoredUserData } from './localStorageUtils';

/**
 * Utility for phone number encryption and decryption
 * Currently Active: v1 (Simple XOR) - prefix "__enc__"
 * Supported for Read: v2 (AES-256) - prefix "__v2__"
 */

const SECRET_KEY = process.env.NEXT_PUBLIC_PHONE_ENCRYPTION_KEY || "RYNXLY_SECURE_PHONE_VAULT";

/**
 * Computes a SHA-256 hash of the phone number for searching purposes.
 * (Simple hash for now)
 */
export const computePhoneHash = (phone: string | null | undefined): string | null => {
    if (!phone) return null;
    const normalized = phone.replace(/[^0-9]/g, '');
    if (!normalized) return null;
    return SHA256(normalized).toString();
};

/**
 * Encrypts a phone number using Simple XOR (v1)
 */
export const encryptPhone = (phone: string | null | undefined): string => {
    if (!phone) return "";
    
    // Safety check: Don't re-encrypt
    if (phone.startsWith("__enc__") || phone.startsWith("__v2__")) return phone;

    try {
        // XOR Cipher Logic
        const encrypted = phone.split('').map((char, i) => 
            String.fromCharCode(char.charCodeAt(0) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length))
        ).join('');
        
        // Convert to Base64 for storage
        return `__enc__${btoa(encrypted)}`;
    } catch (e) {
        console.error("XOR Encryption Failed:", e);
        return phone; 
    }
};

/**
 * Decrypts a phone number supporting both v1 and v2
 */
export const decryptPhone = (phone: string | null | undefined, orgId?: string): string => {
    if (!phone) return "";
    
    // CASE 1: Legacy XOR (v1) - Primary
    if (phone.startsWith("__enc__")) {
        try {
            const base64Data = phone.substring(7);
            const encrypted = atob(base64Data);
            const decrypted = encrypted.split('').map((char, i) => 
                String.fromCharCode(char.charCodeAt(0) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length))
            ).join('');
            return decrypted;
        } catch (e) {
            return phone;
        }
    }

    // CASE 2: AES-256 (v2) - Fallback for newly saved data
    if (phone.startsWith("__v2__")) {
        try {
            const INTERNAL_SALT = "TFC_SMART_SHIELD_V2_2024"; // Support for transition data
            const contextOrgId = orgId || (typeof window !== 'undefined' ? getStoredUserData()?.organization_id : "");
            const dynamicKey = SECRET_KEY + (contextOrgId || "");
            const ciphertext = phone.substring(6);
            
            const bytes = AES.decrypt(ciphertext, dynamicKey);
            let decryptedWithSalt = bytes.toString(Utf8);
            
            if (decryptedWithSalt && decryptedWithSalt.endsWith(INTERNAL_SALT)) {
                return decryptedWithSalt.substring(0, decryptedWithSalt.length - INTERNAL_SALT.length);
            }
            return decryptedWithSalt || phone;
        } catch (e) {
            return phone;
        }
    }

    return phone;
};

/**
 * Formats a phone number for display (can be used to mask numbers in UI)
 */
export const formatMaskedPhone = (phone: string | null | undefined, orgId?: string): string => {
    const realPhone = decryptPhone(phone, orgId);
    if (!realPhone) return "—";
    if (realPhone.length < 4) return realPhone;
    return realPhone.substring(0, 2) + "******" + realPhone.substring(realPhone.length - 2);
};
