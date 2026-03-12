import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

/**
 * Middleware to enforce tenant isolation.
 * In a more complex setup, this would set a global context for Prisma.
 * For now, it simply ensures the tenantId is present and provides a helper for services.
 */
export const tenantContext = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user?.tenantId) {
    return res.status(400).json({ error: 'Tenant context is missing from request' });
  }
  
  // The tenantId is already in req.user from the JWT middleware.
  // We can also double check headers if needed for multi-factor tenant verification.
  
  next();
};
