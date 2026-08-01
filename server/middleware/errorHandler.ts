import type { Request, Response, NextFunction } from 'express';
import * as pgPromise from 'pg-promise';

export interface ApiError extends Error {
  status?: number;
}

export function errorHandler(
  err: ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof pgPromise.errors.QueryResultError) {
    const code = (err as any).code;
    if (code === '23505' || code === '23503') {
      res.status(409).json({ error: 'Conflict', details: err.message });
      return;
    }
  }

  const status = err.status ?? 500;
  res.status(status).json({ error: err.message || 'Internal server error' });
}

export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}
