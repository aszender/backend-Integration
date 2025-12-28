import type { Request, Response } from 'express';
import mongoose from 'mongoose';
import User from '../models/User';
import { shouldUseInMemoryDb } from '../config/db';
import { ApiError } from '../middleware/errors';

function isValidObjectId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

export async function getAllUsers(_req: Request, res: Response) {
  if (shouldUseInMemoryDb()) {
    const users = await User.findInMemory();
    return res.json(users);
  }

  const users = await User.find().lean();
  return res.json(users);
}

export async function getUserById(req: Request, res: Response) {
  const { id } = req.params;

  if (!shouldUseInMemoryDb() && !isValidObjectId(id)) {
    throw new ApiError(400, 'Invalid id format');
  }

  const user = shouldUseInMemoryDb() ? await User.findByIdInMemory(id) : await User.findById(id).lean();
  if (!user) throw new ApiError(404, 'User not found');
  return res.json(user);
}

export async function createUser(req: Request, res: Response) {
  const { name, email } = req.body as { name: string; email: string };

  if (shouldUseInMemoryDb()) {
    const existing = await User.findOneInMemory({ email: email.toLowerCase() });
    if (existing) throw new ApiError(409, 'Email already in use');
    const user = await User.createInMemory({ name, email: email.toLowerCase() });
    return res.status(201).json(user);
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) throw new ApiError(409, 'Email already in use');

  const user = await User.create({ name, email: email.toLowerCase() });
  return res.status(201).json(user);
}

export async function updateUser(req: Request, res: Response) {
  const { id } = req.params;
  const { name, email } = req.body as { name: string; email: string };

  if (!shouldUseInMemoryDb() && !isValidObjectId(id)) {
    throw new ApiError(400, 'Invalid id format');
  }

  const updated = shouldUseInMemoryDb()
    ? await User.findByIdAndUpdateInMemory(id, { name, email: email.toLowerCase() })
    : await User.findByIdAndUpdate(id, { name, email: email.toLowerCase() }, { new: true }).lean();

  if (!updated) throw new ApiError(404, 'User not found');
  return res.json(updated);
}

export async function deleteUser(req: Request, res: Response) {
  const { id } = req.params;

  if (!shouldUseInMemoryDb() && !isValidObjectId(id)) {
    throw new ApiError(400, 'Invalid id format');
  }

  const deleted = shouldUseInMemoryDb() ? await User.findByIdAndDeleteInMemory(id) : await User.findByIdAndDelete(id).lean();
  if (!deleted) throw new ApiError(404, 'User not found');
  return res.json(deleted);
}
