import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middleware/validate.middleware';
import { authMiddleware } from '../middleware/auth.middleware';
import { registerSchema, loginSchema } from '../schemas/auth.schema';

const router = Router();

// POST /auth/register
router.post('/register', validate(registerSchema), AuthController.register);

// POST /auth/login
router.post('/login', validate(loginSchema), AuthController.login);

// GET /auth/me (protected)
router.get('/me', authMiddleware, AuthController.getMe);

export default router;
