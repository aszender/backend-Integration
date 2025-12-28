import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../middleware/asyncHandler';
import { validate } from '../middleware/validate';
import { requireAuth } from '../middleware/auth';
import * as authController from '../controllers/authController';

const router = Router();

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

router.post('/register', validate({ body: registerSchema }), asyncHandler(authController.register));
router.post('/login', validate({ body: loginSchema }), asyncHandler(authController.login));
router.get('/me', requireAuth, asyncHandler(authController.me));

export default router;
