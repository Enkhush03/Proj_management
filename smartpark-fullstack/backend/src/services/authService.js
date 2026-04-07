import { db } from '../data/store.js';
import { AppError } from '../utils/appError.js';
import { createId } from '../utils/id.js';

function createToken(userId) {
  return `token-${userId}-${Date.now()}`;
}

export const authService = {
  login({ identity, password }) {
    const user = db.users.find((item) => item.identity === identity && item.password === password);
    if (!user) throw new AppError('Имэйл/утас эсвэл нууц үг буруу байна.', 401);

    const token = createToken(user.id);
    db.sessions[token] = user.id;
    return { token, user: sanitizeUser(user) };
  },

  signup({ name, identity, password }) {
    const exists = db.users.some((item) => item.identity === identity);
    if (exists) throw new AppError('Энэ хэрэглэгч аль хэдийн бүртгэлтэй байна.', 409);

    const user = {
      id: createId('u'),
      name,
      identity,
      password,
      role: 'driver',
    };

    db.users.push(user);
    const token = createToken(user.id);
    db.sessions[token] = user.id;
    return { token, user: sanitizeUser(user) };
  },

  getMe(token) {
    const userId = db.sessions[token];
    const user = db.users.find((item) => item.id === userId);
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
