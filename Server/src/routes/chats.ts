// src/routes/chats.ts

import { Router } from 'express';
import { PrismaClient, Sender, ChatMode } from '@prisma/client'; // Import ChatMode
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

// ✅ MODIFIED: This route now returns the parent chat object
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

  // Return the chat object along with the messages
  res.json({ chat, items: msgs, nextCursor: msgs.length > 0 ? msgs[msgs.length - 1]!.id : null });
});

// ... (GET /:id/recommendations is unchanged) ...
router.get('/:id/recommendations', async (req, res) => {
  const userId = (req as any).user.id as number;
  const chatId = Number(req.params.id);

  // 1. Verify chat ownership and get the last 6 messages for context
  const messages = await prisma.message.findMany({
    where: {
      chatId: chatId,
      chat: {
        userId: userId,
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 6,
  });

  if (messages.length < 2) {
    return res.json({ recommendations: [] }); // Not enough context yet
  }

  // 2. Create a prompt for the AI
  const conversationHistory = messages.reverse().map(m => `${m.sender}: ${m.text}`).join('\n');
  const prompt = `Based on the following medical conversation, suggest three related topics for further study. Respond ONLY with a simple bulleted list in Markdown, with no introduction, conclusion, or extra commentary.\n\n---\n\nConversation:\n${conversationHistory}`;

  try {
    // 3. Call the Gemini API
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${ENV.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );
    const data = await r.json();
    if (!r.ok) throw new Error(JSON.stringify(data));

    const reply = data.candidates[0].content.parts[0].text.trim();
    
    // 4. Parse the Markdown list into a clean array of strings
    const recommendations = reply.split('\n')
      .map((line: string) => line.replace(/_?\*?_?/g, '').trim()) // Remove markdown characters
      .filter((line: string) => line.length > 0); // Remove any empty lines

    res.json({ recommendations });

  } catch (e) {
    console.error('Failed to get recommendations:', e);
    res.status(500).json({ error: 'Could not generate recommendations.' });
  }
});


router.post('/:id/messages', async (req, res) => {
  const userId = (req as any).user.id as number;
  const chatId = Number(req.params.id);
  const { text, mode } = req.body ?? {};
  if (!text) return res.status(400).json({ error: 'text required' });

  const chat = await prisma.chat.findFirst({ where: { id: chatId, userId } });
  if (!chat) return res.status(404).json({ error: 'Chat not found' });

  const messageCount = await prisma.message.count({ where: { chatId } });
  const isFirstMessage = messageCount === 0;

  const userMsg = await prisma.message.create({
    data: { chatId, text, sender: 'USER' as Sender },
  });

  let newChatTitle = chat.title;
  const defaultTitles = ['New Chat', 'New Web Chat', 'New Mobile Chat'];
  if (!chat.title || defaultTitles.includes(chat.title)) {
    newChatTitle = text.length > 40 ? text.substring(0, 40) + '...' : text;
  }
  
  // ✅ 1. FETCH HISTORY: Get the last 8 messages for context
  const recentMessages = await prisma.message.findMany({
    where: { chatId },
    orderBy: { createdAt: 'desc' },
    take: 8,
  });

  // ✅ 2. FORMAT HISTORY: Prepare the history for the Gemini API
  const history = recentMessages
    .reverse()
    .map(msg => ({
      role: msg.sender === 'USER' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));

  
  let currentPromptText = text;
  if (mode === 'conditionExplainer') {
    currentPromptText = `Please act as a medical tutor. Provide a clear, structured explanation of the following medical condition: "${text}". Organize the response using Markdown with these exact sections: ## Overview, ## Key Symptoms, ## Common Causes, and ## Treatment Options.`;
  }
  
  // Note: We don't need to add the current text to the history array because
  // the 'recentMessages' query above already includes the message we just saved.

  let botText = 'Sorry, I could not generate a response.';
  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${ENV.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // ✅ 3. SEND HISTORY: Send the full conversation context to the API
        body: JSON.stringify({ contents: history }),
      }
    );
    const data = await r.json();

    if (!r.ok || !data?.candidates?.[0]?.content?.parts) {
      console.error('Gemini API Error:', JSON.stringify(data, null, 2));
      throw new Error('Invalid response structure from Gemini API');
    }

    const parts = data.candidates[0].content.parts;
    const reply = Array.isArray(parts) ? parts.map((p: any) => p.text).join('\n').trim() : '';
    if (reply) botText = reply;
  } catch (e) {
    console.error('Gemini call failed:', e);
  }

  const botMsg = await prisma.message.create({
    data: { chatId, text: botText, sender: 'BOT' as Sender },
  });

  const chatUpdateData: any = { 
    updatedAt: new Date(),
    title: newChatTitle,
  };
  if (isFirstMessage && mode) {
    const prismaMode = (mode.charAt(0).toUpperCase() + mode.slice(1)) as ChatMode;
    if (Object.values(ChatMode).includes(prismaMode)) {
      chatUpdateData.mode = prismaMode;
    }
  }

  await prisma.chat.update({
    where: { id: chatId },
    data: chatUpdateData,
  });

  res.json({ userMessage: userMsg, botMessage: botMsg });
});


// ... (DELETE /:id is unchanged) ...
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