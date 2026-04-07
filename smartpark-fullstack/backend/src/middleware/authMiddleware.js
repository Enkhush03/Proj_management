import { db } from '../data/store.js';

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');
  const userId = db.sessions[token];

  if (!token || !userId) {
    return res.status(401).json({ message: 'Нэвтрэх шаардлагатай.' });
  }

  req.userId = userId;
  req.token = token;
  next();
}
