import api from './api';
import { ChatMessage } from '@/types/chat';

// Description: Send a message to the AI chatbot
// Endpoint: POST /api/chat/message
// Request: { message: string }
// Response: { reply: string }
export const sendChatMessage = async (message: string): Promise<{ reply: string }> => {
  try {
    const response = await api.post('/api/chat/message', { message });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Get chat history
// Endpoint: GET /api/chat/history
// Request: {}
// Response: { messages: ChatMessage[] }
export const getChatHistory = async (): Promise<{ messages: ChatMessage[] }> => {
  try {
    const response = await api.get('/api/chat/history');
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Clear chat history
// Endpoint: DELETE /api/chat/history
// Request: {}
// Response: { message: string }
export const clearChatHistory = async (): Promise<{ message: string }> => {
  try {
    const response = await api.delete('/api/chat/history');
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};
