import jwt from 'jsonwebtoken';
import { ENV } from './env';

export type JwtUser = { id: number; role: string };

export const signAccess = (user: JwtUser) =>
  jwt.sign(user, ENV.JWT_ACCESS_SECRET, { expiresIn: '15m' });

export const signRefresh = (user: JwtUser) =>
  jwt.sign(user, ENV.JWT_REFRESH_SECRET, { expiresIn: '30d' });

export const verifyAccess = (token: string) =>
  jwt.verify(token, ENV.JWT_ACCESS_SECRET) as JwtUser;

export const verifyRefresh = (token: string) =>
  jwt.verify(token, ENV.JWT_REFRESH_SECRET) as JwtUser;
