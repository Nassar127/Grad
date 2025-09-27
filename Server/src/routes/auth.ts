import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { signAccess, signRefresh, verifyRefresh } from '../auth';
import { ENV } from '../env';

const prisma = new PrismaClient();
const router = Router();

router.post('/signup', async (req, res) => {
  const { email, password, name } = req.body ?? {};
  if (!email || !password) return res.status(400).json({ error: 'email & password required' });

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ error: 'Email already in use' });

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({ data: { email, passwordHash, name } });

  const payload = { id: user.id, role: user.role };
  const accessToken = signAccess(payload);
  const refreshToken = signRefresh(payload);

  await prisma.session.create({
    data: {
      userId: user.id,
      refreshToken,
      userAgent: (req.headers['user-agent'] as string | undefined) ?? null,
      ip: (req.ip as string | undefined) ?? null,
      expiresAt: new Date(Date.now() + 30 * 24 * 3600 * 1000)
    },
  });

  res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role }, accessToken, refreshToken });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) return res.status(400).json({ error: 'email & password required' });
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

  const payload = { id: user.id, role: user.role };
  const accessToken = signAccess(payload);
  const refreshToken = signRefresh(payload);

  await prisma.session.create({
    data: {
      userId: user.id,
      refreshToken,
     userAgent: (req.headers['user-agent'] as string | undefined) ?? null,
     ip: (req.ip as string | undefined) ?? null,
      expiresAt: new Date(Date.now() + 30 * 24 * 3600 * 1000)
    },
  });

  res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role }, accessToken, refreshToken });
});

router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body ?? {};
  if (!refreshToken) return res.status(400).json({ error: 'refreshToken required' });

  const session = await prisma.session.findUnique({ where: { refreshToken } });
  if (!session || session.revokedAt || session.expiresAt < new Date())
    return res.status(401).json({ error: 'Invalid refresh token' });

  const payload = verifyRefresh(refreshToken);
  // rotate refresh
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

router.get('/me', async (req, res) => {
  const auth = req.headers.authorization?.split(' ')[1];
  if (!auth) return res.status(401).json({ error: 'No token' });
  const jwt = await import('jsonwebtoken');
  try {
    const { id } = jwt.verify(auth, ENV.JWT_ACCESS_SECRET) as any;
    const user = await prisma.user.findUnique({ where: { id }, select: { id: true, email: true, name: true, role: true } });
    res.json({ user });
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;
