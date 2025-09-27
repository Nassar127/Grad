import { Router } from 'express';
import { PrismaClient, Sender } from '@prisma/client';
import { requireAuth } from '../mw';
import { ENV } from '../env';

const prisma = new PrismaClient();
const router = Router();

router.use(requireAuth);

router.get('/', async (req, res) => {
  const userId = (req as any).user.id as number;
  const take = Number(req.query.take ?? 20);
  const cursor = req.query.cursor ? { id: Number(req.query.cursor) } : undefined;

  const chats = await prisma.chat.findMany({
    where: { userId, archived: false },
    orderBy: { updatedAt: 'desc' },
    take,
    ...(cursor ? { cursor, skip: 1 } : {}),
  });

  res.json({ items: chats, nextCursor: chats.length > 0 ? chats[chats.length - 1]!.id : null });
});

router.post('/', async (req, res) => {
  const userId = (req as any).user.id as number;
  const { title } = req.body ?? {};
  const chat = await prisma.chat.create({ data: { userId, title: title || 'New Chat' } });
  res.json({ chat });
});

router.get('/:id/messages', async (req, res) => {
  const userId = (req as any).user.id as number;
  const chatId = Number(req.params.id);
  const chat = await prisma.chat.findFirst({ where: { id: chatId, userId } });
  if (!chat) return res.status(404).json({ error: 'Chat not found' });

  const take = Number(req.query.take ?? 50);
  const cursor = req.query.cursor ? { id: Number(req.query.cursor) } : undefined;

  const msgs = await prisma.message.findMany({
    where: { chatId },
    orderBy: { id: 'asc' },
    take,
    ...(cursor ? { cursor, skip: 1 } : {}),
  });

  res.json({ items: msgs, nextCursor: msgs.length > 0 ? msgs[msgs.length - 1]!.id : null });
});

router.post('/:id/messages', async (req, res) => {
  const userId = (req as any).user.id as number;
  const chatId = Number(req.params.id);
  const { text } = req.body ?? {};
  if (!text) return res.status(400).json({ error: 'text required' });

  const chat = await prisma.chat.findFirst({ where: { id: chatId, userId } });
  if (!chat) return res.status(404).json({ error: 'Chat not found' });

  const userMsg = await prisma.message.create({
    data: { chatId, text, sender: 'USER' as Sender },
  });

  let newChatTitle = chat.title;
  const defaultTitles = ['New Chat', 'New Web Chat', 'New Mobile Chat'];
  
  if (!chat.title || defaultTitles.includes(chat.title)) {
    newChatTitle = text.length > 40 ? text.substring(0, 40) + '...' : text;
  }
  
  let botText = 'Sorry, I could not generate a response.';
  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${ENV.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text }] }] }),
      }
    );
    const data = await r.json();
    const parts = data?.candidates?.[0]?.content?.parts;
    const reply = Array.isArray(parts) ? parts.map((p: any) => p.text).join('\n').trim() : '';
    if (reply) botText = reply;
  } catch (e) {
    console.error('Gemini error', e);
  }

  const botMsg = await prisma.message.create({
    data: { chatId, text: botText, sender: 'BOT' as Sender },
  });

  await prisma.chat.update({
    where: { id: chatId },
    data: { 
      updatedAt: new Date(),
      title: newChatTitle
    },
  });

  res.json({ userMessage: userMsg, botMessage: botMsg });
});

router.delete('/:id', async (req, res) => {
  const userId = (req as any).user.id as number;
  const chatId = Number(req.params.id);

  try {
    await prisma.chat.delete({
      where: {
        id: chatId,
        userId: userId,
      },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Failed to delete chat:', error);
    res.status(404).json({ error: 'Chat not found or you do not have permission to delete it.' });
  }
});

export default router;