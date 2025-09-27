import type { Request, Response, NextFunction } from 'express';
import { verifyAccess } from './auth';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Missing token' });
  try {
    (req as any).user = verifyAccess(token);
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
