import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

export class ApiError extends Error {
  statusCode: number;
  details?: unknown;

  constructor(statusCode: number, message: string, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

export function notFoundHandler(req: Request, _res: Response, next: NextFunction) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  // Zod validation
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation error',
      details: err.flatten(),
    });
  }

  // JWT
  if (isJwtError(err)) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  // Mongoose common errors (typed loosely to avoid hard dependency on mongoose types here)
  if (isMongooseCastError(err)) {
    return res.status(400).json({ error: 'Invalid id format' });
  }
  if (isMongooseValidationError(err)) {
    return res.status(400).json({ error: 'Validation error', details: err.errors });
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ error: err.message, details: err.details });
  }

  // eslint-disable-next-line no-console
  console.error('Unhandled error:', err);
  return res.status(500).json({ error: 'Server error' });
}

function isJwtError(err: unknown): err is { name: string } {
  return (
    typeof err === 'object' &&
    err !== null &&
    'name' in err &&
    (err as any).name &&
    ((err as any).name === 'JsonWebTokenError' || (err as any).name === 'TokenExpiredError')
  );
}

function isMongooseCastError(err: unknown): err is { name: string } {
  return typeof err === 'object' && err !== null && (err as any).name === 'CastError';
}

function isMongooseValidationError(err: unknown): err is { name: string; errors: unknown } {
  return typeof err === 'object' && err !== null && (err as any).name === 'ValidationError';
}
