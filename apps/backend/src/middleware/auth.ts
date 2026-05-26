import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
  };
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  // Get token from Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // For development, you can use Supabase JWT verification
  // In production, verify against Supabase's public key
  try {
    // Decode token (for now, basic validation)
    // In production, implement proper JWT verification with Supabase
    const decoded: any = jwt.decode(token);

    if (!decoded || !decoded.sub) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    // Attach user info to request
    (req as AuthenticatedRequest).user = {
      id: decoded.sub,
      email: decoded.email,
    };

    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token format' });
  }
};

// Optional: Verify Supabase JWT properly
export const verifySupabaseJWT = (token: string, jwtSecret: string) => {
  try {
    const decoded = jwt.verify(token, jwtSecret, {
      algorithms: ['HS256'],
    });
    return decoded;
  } catch (err) {
    throw new Error('Invalid token');
  }
};
