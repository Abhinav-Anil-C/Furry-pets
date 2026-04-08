import express, { Request, Response } from 'express';
import { requireUser } from './middlewares/auth';
import * as chatService from '../services/chatService';

const router = express.Router();

// Description: Send a message to the AI chatbot
// Endpoint: POST /api/chat/message
// Request: { message: string }
// Response: { reply: string }
router.post('/message', requireUser(), async (req: Request, res: Response) => {
  try {
    const userId = req.user!._id.toString();
    const { message } = req.body;

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({ message: 'Message is required' });
    }

    const reply = await chatService.sendMessage(userId, message.trim());

    res.status(200).json({ reply });
  } catch (error: any) {
    console.error(`Error processing chat message: ${error.message}`);
    res.status(500).json({ message: error.message || 'Failed to process message' });
  }
});

// Description: Get chat history
// Endpoint: GET /api/chat/history
// Request: {}
// Response: { messages: ChatMessage[] }
router.get('/history', requireUser(), async (req: Request, res: Response) => {
  try {
    const userId = req.user!._id.toString();
    const messages = await chatService.getChatHistory(userId);
    res.status(200).json({ messages });
  } catch (error: any) {
    console.error(`Error fetching chat history: ${error.message}`);
    res.status(500).json({ message: error.message || 'Failed to fetch chat history' });
  }
});

// Description: Clear chat history
// Endpoint: DELETE /api/chat/history
// Request: {}
// Response: { message: string }
router.delete('/history', requireUser(), async (req: Request, res: Response) => {
  try {
    const userId = req.user!._id.toString();
    await chatService.clearChatHistory(userId);
    res.status(200).json({ message: 'Chat history cleared successfully!' });
  } catch (error: any) {
    console.error(`Error clearing chat history: ${error.message}`);
    res.status(500).json({ message: error.message || 'Failed to clear chat history' });
  }
});

export default router;
