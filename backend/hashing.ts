import crypto from 'crypto';
import bcrypt from 'bcrypt';
import argon2 from 'argon2';

// Supported Algorithms
export type Algorithm = 'SHA-256' | 'bcrypt' | 'argon2id' | 'PBKDF2' | 'scrypt';

export interface HashResult {
  hash: string;
  randomSalt: string;
  temporalSalt: string;
  algorithm: Algorithm;
}

// 1. Hybrid Salt Generation
export function generateHybridSalt(userId: string): { randomSalt: string; temporalSalt: string } {
  // Random CSPRNG Salt (16 bytes)
  const randomSalt = crypto.randomBytes(16).toString('hex');
  
  // Temporal Salt: HMAC-SHA256(user_id + current_timestamp)
  const timestamp = Date.now().toString();
  const hmac = crypto.createHmac('sha256', process.env.HMAC_SECRET || 'default_secret');
  hmac.update(`${userId}:${timestamp}`);
  const temporalSalt = hmac.digest('hex');

  return { randomSalt, temporalSalt };
}

// Combine salts and password
export function prepareInput(password: string, randomSalt: string, temporalSalt: string) {
  return `${password}:${randomSalt}:${temporalSalt}`;
}

// Constant-time string comparison
export function secureCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

// 2. Hashing Engine
export const HashingEngine = {
  async hash(password: string, algorithm: Algorithm, randomSalt: string, temporalSalt: string): Promise<string> {
    const input = prepareInput(password, randomSalt, temporalSalt);
    
    switch (algorithm) {
      case 'SHA-256':
        return crypto.createHash('sha256').update(input).digest('hex');
        
      case 'bcrypt':
        return bcrypt.hash(input, 10);
        
      case 'argon2id':
        return argon2.hash(input, { type: argon2.argon2id });
        
      case 'PBKDF2':
        return new Promise((resolve, reject) => {
          crypto.pbkdf2(input, randomSalt, 100000, 64, 'sha256', (err, derivedKey) => {
            if (err) reject(err);
            else resolve(derivedKey.toString('hex'));
          });
        });
        
      case 'scrypt':
        return new Promise((resolve, reject) => {
          crypto.scrypt(input, randomSalt, 64, (err, derivedKey) => {
            if (err) reject(err);
            else resolve(derivedKey.toString('hex'));
          });
        });
        
      default:
        throw new Error('Unsupported algorithm');
    }
  },

  async verify(password: string, hash: string, algorithm: Algorithm, randomSalt: string, temporalSalt: string): Promise<boolean> {
    const input = prepareInput(password, randomSalt, temporalSalt);
    
    switch (algorithm) {
      case 'SHA-256':
        const sha256Hash = crypto.createHash('sha256').update(input).digest('hex');
        return secureCompare(hash, sha256Hash);
        
      case 'bcrypt':
        return bcrypt.compare(input, hash);
        
      case 'argon2id':
        return argon2.verify(hash, input);
        
      case 'PBKDF2':
        return new Promise((resolve, reject) => {
          crypto.pbkdf2(input, randomSalt, 100000, 64, 'sha256', (err, derivedKey) => {
            if (err) reject(err);
            else resolve(secureCompare(hash, derivedKey.toString('hex')));
          });
        });
        
      case 'scrypt':
        return new Promise((resolve, reject) => {
          crypto.scrypt(input, randomSalt, 64, (err, derivedKey) => {
            if (err) reject(err);
            else resolve(secureCompare(hash, derivedKey.toString('hex')));
          });
        });
        
      default:
        throw new Error('Unsupported algorithm');
    }
  }
};
