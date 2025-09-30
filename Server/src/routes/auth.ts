// src/routes/auth.ts

import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { signAccess, signRefresh, verifyRefresh } from '../auth';
import { requireAuth } from '../mw';

const prisma = new PrismaClient();
const router = Router();

const signupSchema = z.object({
  password: z.string().min(6),
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().min(10).optional(),
}).refine(data => data.email || data.phone, {
  message: "Either email or phone must be provided",
  path: ["email", "phone"],
});

const loginSchema = z.object({
  login: z.string(),
  password: z.string(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(6),
});

router.post('/signup', async (req, res) => {
  const result = signupSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: 'Invalid input', details: result.error.flatten().fieldErrors });
  }
  const { email, phone, password, name } = result.data;

  if (email) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Email already in use' });
  }
  if (phone) {
    const existing = await prisma.user.findUnique({ where: { phone } });
    if (existing) return res.status(409).json({ error: 'Phone number already in use' });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({ 
    data: { 
      email: email ?? null, 
      phone: phone ?? null, 
      passwordHash, 
      name: name ?? null 
    } 
  });

  const payload = { id: user.id, role: user.role.toString() };
  const accessToken = signAccess(payload);
  const refreshToken = signRefresh(payload);
  await prisma.session.create({
    data: {
      userId: user.id,
      refreshToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 3600 * 1000)
    },
  });

  res.json({ user: { id: user.id, email: user.email, name: user.name }, accessToken, refreshToken });
});

router.post('/login', async (req, res) => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: 'Invalid input' });
  }
  const { login, password } = result.data;

  const user = await prisma.user.findFirst({
    where: { OR: [{ email: login }, { phone: login }] },
  });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const payload = { id: user.id, role: user.role.toString() };
  const accessToken = signAccess(payload);
  const refreshToken = signRefresh(payload);
  await prisma.session.create({
    data: {
      userId: user.id,
      refreshToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 3600 * 1000)
    },
  });

  res.json({ user: { id: user.id, email: user.email, name: user.name }, accessToken, refreshToken });
});

router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body ?? {};
  if (!refreshToken) return res.status(400).json({ error: 'refreshToken required' });

  const session = await prisma.session.findUnique({ where: { refreshToken } });
  if (!session || session.revokedAt || session.expiresAt < new Date())
    return res.status(401).json({ error: 'Invalid refresh token' });

  const payload = verifyRefresh(refreshToken);
  const newRefresh = signRefresh({ id: payload.id, role: payload.role });
  await prisma.$transaction([
    prisma.session.update({ where: { refreshToken }, data: { revokedAt: new Date() } }),
    prisma.session.create({
      data: {
        userId: payload.id,
        refreshToken: newRefresh,
        userAgent: (req.headers['user-agent'] as string | undefined) ?? null,
        ip: (req.ip as string | undefined) ?? null,
        expiresAt: new Date(Date.now() + 30 * 24 * 3600 * 1000)
      }
    })
  ]);

  const accessToken = signAccess({ id: payload.id, role: payload.role });
  res.json({ accessToken, refreshToken: newRefresh });
});

router.post('/logout', async (req, res) => {
  const { refreshToken } = req.body ?? {};
  if (refreshToken) {
    await prisma.session.updateMany({
      where: { refreshToken, revokedAt: null },
      data: { revokedAt: new Date() }
    });
  }
  res.json({ ok: true });
});

router.use(requireAuth);

router.get('/me', async (req, res) => {
  const userId = (req as any).user.id;
  const user = await prisma.user.findUnique({ 
    where: { id: userId }, 
    select: { id: true, email: true, phone: true, name: true, role: true } 
  });
  res.json({ user });
});

router.post('/me/update-name', async (req, res) => {
  const userId = (req as any).user.id;
  const { name } = req.body;
  if (typeof name !== 'string') {
    return res.status(400).json({ error: 'Name must be a string' });
  }
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { name },
    select: { id: true, email: true, phone: true, name: true },
  });
  res.json({ user: updatedUser });
});

router.post('/me/change-password', async (req, res) => {
  const userId = (req as any).user.id;
  const result = changePasswordSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: 'Invalid input' });
  }
  const { currentPassword, newPassword } = result.data;
  
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !(await bcrypt.compare(currentPassword, user.passwordHash))) {
    return res.status(401).json({ error: 'Incorrect current password' });
  }

  const newPasswordHash = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: newPasswordHash },
  });

  await prisma.session.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() }
  });

  res.json({ message: 'Password updated successfully' });
});



export default router;
