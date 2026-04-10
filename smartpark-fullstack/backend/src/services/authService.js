import { query } from '../config/db.js';
import { register } from '../controllers/authController.js';
import { db } from '../data/store.js';
import { AppError } from '../utils/appError.js';
import { createId } from '../utils/id.js';
import { hashPassword, needsRehash, verifyPassword } from '../utils/password.js';

function createToken(userId) {
  return `token-${userId}-${Date.now()}`;
}

export const authService = {
  async login({ identity, password }) {
    const { rows } = await query(
      'SELECT id, name, identity, password, role FROM users WHERE identity = $1 LIMIT 1',
      [identity],
    );
    const user = rows[0];
    const isValid = user ? await verifyPassword(password, user.password) : false;

    if (!user || !isValid) {
      throw new AppError('Имэйл/утас эсвэл нууц үг буруу байна.', 401);
    }

    if (needsRehash(user.password)) {
      const hashedPassword = await hashPassword(password);
      await query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, user.id]);
      user.password = hashedPassword;
    }

    const token = createToken(user.id);
    db.sessions[token] = user.id;
    return { token, user: sanitizeUser(user) };
  },

  async register({ name, identity, password }) {
    const { rows: existing } = await query('SELECT id FROM users WHERE identity = $1 LIMIT 1', [identity]);
    if (existing.length > 0) {
      throw new AppError('Энэ хэрэглэгч аль хэдийн бүртгэлтэй байна.', 409);
    }

    const user = {
      id: createId('u'),
      name,
      identity,
      password: await hashPassword(password),
      role: 'driver',
    };

    await query(
      'INSERT INTO users (id, name, identity, password, role) VALUES ($1, $2, $3, $4, $5)',
      [user.id, user.name, user.identity, user.password, user.role],
    );

    const token = createToken(user.id);
    db.sessions[token] = user.id;
    return { token, user: sanitizeUser(user) };
  },

  async getMe(token) {
    const userId = db.sessions[token];
    if (!userId) throw new AppError('Нэвтрэх эрхгүй байна.', 401);

    const { rows } = await query('SELECT id, name, identity, role FROM users WHERE id = $1 LIMIT 1', [userId]);
    const user = rows[0];
    if (!user) throw new AppError('Нэвтрэх эрхгүй байна.', 401);
    return sanitizeUser(user);
  },
};

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    identity: user.identity,
    role: user.role,
  };
}
