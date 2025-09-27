import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { ENV } from './env';
import authRouter from './routes/auth';
import chatsRouter from './routes/chats';
import messagesRouter from './routes/messages';

const app = express();
app.use(helmet());
app.use(cors({ origin: ENV.CLIENT_ORIGIN, credentials: true }));
app.use(express.json({ limit: '1mb' }));

const limiter = rateLimit({ windowMs: 60_000, max: 120 }); // 120 req/min
app.use(limiter);

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/auth', authRouter);
app.use('/chats', chatsRouter);
app.use('/messages', messagesRouter); // optional if you split

app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err);
  res.status(500).json({ error: 'Server error' });
});

app.listen(ENV.PORT, () => {
  console.log(`API listening on http://localhost:${ENV.PORT}`);
});
