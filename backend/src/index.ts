import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { json } from 'body-parser';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from './middleware/auth';
import userRouter from './routes/user';
import transactionRouter from './routes/transaction';
import debtRouter from './routes/debt';
import reportRouter from './routes/report';
import reminderRouter from './routes/reminder';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors({ origin: process.env.APP_URL || 'http://localhost:3000', credentials: true }));
app.use(json());

// Health check
app.get('/health', (_req, res) => res.send({ status: 'ok' }));

// Public auth routes (login, register) – handled in userRouter
app.use('/api/users', userRouter(prisma));

// Protected routes – JWT required
app.use('/api/transactions', authMiddleware, transactionRouter(prisma));
app.use('/api/debts', authMiddleware, debtRouter(prisma));
app.use('/api/reports', authMiddleware, reportRouter(prisma));
app.use('/api/reminders', authMiddleware, reminderRouter(prisma));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Simple Cash backend listening on http://localhost:${PORT}`);
});
