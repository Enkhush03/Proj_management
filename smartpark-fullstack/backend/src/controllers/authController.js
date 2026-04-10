import { authService } from '../services/authService.js';

export async function login(req, res, next) {
  try {
    const result = await authService.login(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function register(req, res, next) {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function me(req, res, next) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const user = await authService.getMe(token);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}