import crypto from 'crypto';

const KEY_LENGTH = 64;
const SCRYPT_N = 16384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;

export async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = await scryptAsync(password, salt);
  return `scrypt$${SCRYPT_N}$${SCRYPT_R}$${SCRYPT_P}$${salt}$${derivedKey}`;
}

export async function verifyPassword(password, storedValue) {
  if (!storedValue) return false;
  if (!storedValue.startsWith('scrypt$')) {
    return password === storedValue;
  }

  const [, n, r, p, salt, originalHash] = storedValue.split('$');
  const derivedKey = await scryptAsync(password, salt, {
    N: Number(n),
    r: Number(r),
    p: Number(p),
  });

  return timingSafeEqual(originalHash, derivedKey);
}

export function needsRehash(storedValue) {
  return !storedValue || !storedValue.startsWith('scrypt$');
}

function scryptAsync(password, salt, options = {}) {
  const N = options.N || SCRYPT_N;
  const r = options.r || SCRYPT_R;
  const p = options.p || SCRYPT_P;

  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, KEY_LENGTH, { N, r, p }, (error, derivedKey) => {
      if (error) return reject(error);
      resolve(derivedKey.toString('hex'));
    });
  });
}

function timingSafeEqual(a, b) {
  const aBuffer = Buffer.from(a, 'hex');
  const bBuffer = Buffer.from(b, 'hex');
  if (aBuffer.length !== bBuffer.length) return false;
  return crypto.timingSafeEqual(aBuffer, bBuffer);
}
