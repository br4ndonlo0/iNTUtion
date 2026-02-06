import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'your-secret-key-here-min-32-chars!!';
const IV_LENGTH = 16;

// Ensure the encryption key is 32 bytes (256 bits) for AES-256
const key = crypto
  .createHash('sha256')
  .update(String(ENCRYPTION_KEY))
  .digest();

export function encryptBalance(balance: number): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  
  let encrypted = cipher.update(balance.toString(), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  // Return IV + encrypted data (separated by :)
  return iv.toString('hex') + ':' + encrypted;
}

export function decryptBalance(encrypted: string): number {
  const parts = encrypted.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const encryptedText = parts[1];
  
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return parseFloat(decrypted);
}
