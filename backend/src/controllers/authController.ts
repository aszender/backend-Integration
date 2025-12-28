import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { hashPassword, verifyPassword } from '../models/User';
import { shouldUseInMemoryDb } from '../config/db';
import { ApiError } from '../middleware/errors';

function signToken(userId: string) {
  const secret = (process.env.JWT_SECRET || 'dev-secret') as jwt.Secret;
  const expiresIn = (process.env.JWT_EXPIRES_IN || '1h') as jwt.SignOptions['expiresIn'];
  return jwt.sign({ sub: userId }, secret, { expiresIn });
}

export async function register(req: Request, res: Response) {
  const { name, email, password } = req.body as { name: string; email: string; password: string };
  const normalizedEmail = email.toLowerCase();

  if (shouldUseInMemoryDb()) {
    const existing = await User.findOneInMemory({ email: normalizedEmail });
    if (existing) throw new ApiError(409, 'Email already in use');

    const passwordHash = await hashPassword(password);
    const user = await User.createInMemory({ name, email: normalizedEmail, passwordHash });

    const token = signToken(String(user._id));
    return res.status(201).json({ token, user: { _id: user._id, name: user.name, email: user.email } });
  }

  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) throw new ApiError(409, 'Email already in use');

  const passwordHash = await hashPassword(password);
  const user = await User.create({ name, email: normalizedEmail, passwordHash });

  const token = signToken(String(user._id));
  return res.status(201).json({ token, user: { _id: user._id, name: user.name, email: user.email } });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body as { email: string; password: string };
  const normalizedEmail = email.toLowerCase();

  if (shouldUseInMemoryDb()) {
    const user = await User.findOneInMemory({ email: normalizedEmail });
    if (!user?.passwordHash) throw new ApiError(401, 'Invalid email or password');

    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) throw new ApiError(401, 'Invalid email or password');

    const token = signToken(String(user._id));
    return res.json({ token, user: { _id: user._id, name: user.name, email: user.email } });
  }

  const user = await User.findOne({ email: normalizedEmail }).select('+passwordHash');
  if (!user?.passwordHash) throw new ApiError(401, 'Invalid email or password');

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) throw new ApiError(401, 'Invalid email or password');

  const token = signToken(String(user._id));
  return res.json({ token, user: { _id: user._id, name: user.name, email: user.email } });
}

export async function me(req: Request, res: Response) {
  if (!req.user?.id) throw new ApiError(401, 'Unauthorized');

  if (shouldUseInMemoryDb()) {
    const user = await User.findByIdInMemory(req.user.id);
    if (!user) throw new ApiError(404, 'User not found');
    return res.json({ _id: user._id, name: user.name, email: user.email });
  }

  const user = await User.findById(req.user.id).lean();
  if (!user) throw new ApiError(404, 'User not found');
  return res.json(user);
}
