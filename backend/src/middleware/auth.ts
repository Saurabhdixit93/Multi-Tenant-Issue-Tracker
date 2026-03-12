import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export interface AuthRequest extends Request {
  user?: {
    userId: String;
    tenantId: String;
    role: 'ADMIN' | 'USER';
  };
}

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    if (!token || !JWT_SECRET) {
      return res.status(403).json({ error: 'Security context is invalid' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded: any) => {
      if (err) {
        return res.status(403).json({ error: 'Token is invalid or expired' });
      }

      req.user = {
        userId: decoded.sub,
        tenantId: decoded.tenantId,
        role: decoded.role,
      };
      next();
    });
  } else {
    res.status(401).json({ error: 'Authorization header is missing' });
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};
