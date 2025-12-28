import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

export type JwtPayload = {
  sub: string;
};

export const requireAuth: RequestHandler = (req, res, next) => {
  const header = req.header('Authorization');
  const token = header?.startsWith('Bearer ') ? header.slice('Bearer '.length) : undefined;

  if (!token) {
    return res.status(401).json({ error: 'Missing Authorization: Bearer <token>' });
  }

  const secret = process.env.JWT_SECRET || 'dev-secret';
  const decoded = jwt.verify(token, secret) as JwtPayload;

  req.user = { id: decoded.sub };
  next();
};

export function enforceAuthIfEnabled(): RequestHandler {
  const enabled = String(process.env.ENFORCE_AUTH || '').toLowerCase() === 'true';
  return enabled ? requireAuth : (_req, _res, next) => next();
}
