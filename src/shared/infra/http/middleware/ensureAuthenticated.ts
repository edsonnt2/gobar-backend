import { Request, Response, NextFunction } from 'express';
import JwtAuth from '@shared/provider/AuthProvider/implementations/JwtProvider';
import AppError from '@shared/error/AppError';

export default function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
): Response | void {
  const authHeaders = req.headers.authorization;
  if (!authHeaders) throw new AppError('JWT token is missing', 401);
  const jwtAuth = new JwtAuth();
  const [, token] = authHeaders.split(' ');

  try {
    const { sub } = jwtAuth.verifyToken(token);
    const { user_id, business_id } = JSON.parse(sub);
    req.user = { id: user_id };
    req.business = { id: business_id };
    return next();
  } catch (error) {
    throw new AppError('Invalid JWT token', 401);
  }
}
