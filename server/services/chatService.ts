import ChatMessage, { IChatMessage } from '../models/ChatMessage';
import { sendLLMRequest } from './llmService';
import mongoose from 'mongoose';

export const sendMessage = async (userId: string, message: string): Promise<string> => {
  console.log(`Processing chat message for user: ${userId}`);

  // Save user message
  const userMessage = new ChatMessage({
    userId: new mongoose.Types.ObjectId(userId),
    role: 'user',
    content: message,
  });
  await userMessage.save();

  // Get chat history for context (last 10 messages)
  const history = await ChatMessage.find({ userId: new mongoose.Types.ObjectId(userId) })
    .sort({ timestamp: -1 })
    .limit(10);

  // Build conversation context
  const conversationContext = history
    .reverse()
    .map(msg => `${msg.role}: ${msg.content}`)
    .join('\n');

  // Create prompt for LLM
  const systemPrompt = `You are a helpful AI assistant specializing in pet care, particularly dogs. You provide friendly, accurate, and practical advice about dog health, training, nutrition, exercise, and general pet care.

Keep responses concise and friendly (2-4 sentences).

${conversationContext ? `Previous conversation:\n${conversationContext}\n\n` : ''}Question: ${message}

Answer:`;

  try {
    // Use OpenAI or Anthropic
    const provider = process.env.OPENAI_API_KEY ? 'openai' : 'anthropic';
    const model = provider === 'openai' ? 'gpt-4o-mini' : 'claude-3-haiku-20240307';

    const reply = await sendLLMRequest(provider, model, systemPrompt);
    console.log(`Generated AI response for user: ${userId}`);

    // Save assistant message
    const assistantMessage = new ChatMessage({
      userId: new mongoose.Types.ObjectId(userId),
      role: 'assistant',
      content: reply.trim(),
    });
    await assistantMessage.save();

    return reply.trim();
  } catch (error) {
    console.error('Error generating chat response:', error);
    // Fallback response
    const fallbackReply = 'I apologize, but I\'m having trouble generating a response right now. Please try again in a moment.';

    const assistantMessage = new ChatMessage({
      userId: new mongoose.Types.ObjectId(userId),
      role: 'assistant',
      content: fallbackReply,
    });
    await assistantMessage.save();

    return fallbackReply;
  }
};

export const getChatHistory = async (userId: string): Promise<IChatMessage[]> => {
  console.log(`Fetching chat history for user: ${userId}`);
  const messages = await ChatMessage.find({ userId: new mongoose.Types.ObjectId(userId) })
    .sort({ timestamp: 1 })
    .limit(100);
  return messages;
};

export const clearChatHistory = async (userId: string): Promise<void> => {
  console.log(`Clearing chat history for user: ${userId}`);
  await ChatMessage.deleteMany({ userId: new mongoose.Types.ObjectId(userId) });
  console.log(`Chat history cleared for user: ${userId}`);
};
