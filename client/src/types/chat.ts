export interface ChatMessage {
  _id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}