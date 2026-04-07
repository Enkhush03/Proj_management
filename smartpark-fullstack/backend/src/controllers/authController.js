import { authService } from '../services/authService.js';

export const authController = {
  login(req, res, next) {
    try {
      const result = authService.login(req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
  signup(req, res, next) {
    try {
      const result = authService.signup(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },
  me(req, res, next) {
    try {
      const user = authService.getMe(req.token);
      res.json({ user });
    } catch (error) {
      next(error);
    }
  },
};
