import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../middleware/asyncHandler';
import { validate } from '../middleware/validate';
import { enforceAuthIfEnabled } from '../middleware/auth';
import * as userController from '../controllers/userController';

const router = Router();

const userBodySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

const idParamsSchema = z.object({
  id: z.string().min(1),
});

// If ENFORCE_AUTH=true, this will protect all user routes.
router.use(enforceAuthIfEnabled());

router.get('/', asyncHandler(userController.getAllUsers));
router.get('/:id', validate({ params: idParamsSchema }), asyncHandler(userController.getUserById));
router.post('/', validate({ body: userBodySchema }), asyncHandler(userController.createUser));
router.put('/:id', validate({ params: idParamsSchema, body: userBodySchema }), asyncHandler(userController.updateUser));
router.delete('/:id', validate({ params: idParamsSchema }), asyncHandler(userController.deleteUser));

export default router;
