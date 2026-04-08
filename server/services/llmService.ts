import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

// Singleton clients
let openai: OpenAI | null = null;
let anthropic: Anthropic | null = null;

// Initialize OpenAI client
function getOpenAIClient(): OpenAI {
  if (!openai) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set in environment variables');
    }
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openai;
}

// Initialize Anthropic client
function getAnthropicClient(): Anthropic {
  if (!anthropic) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is not set in environment variables');
    }
    anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return anthropic;
}

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// OpenAI request with retries
async function sendRequestToOpenAI(model: string, message: string): Promise<string> {
  const client = getOpenAIClient();
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      const response = await client.chat.completions.create({
        model,
        messages: [{ role: 'user', content: message }],
        max_tokens: 1024,
      });
      return response.choices[0]?.message?.content || '';
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error(`OpenAI attempt ${i + 1} failed:`, errMsg);
      if (i === MAX_RETRIES - 1) throw error;
      await sleep(RETRY_DELAY);
    }
  }
  return '';
}

// Anthropic request with retries (latest SDK)
async function sendRequestToAnthropic(model: string, message: string): Promise<string> {
  const client = getAnthropicClient();
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      const response = await client.completions.create({
        model: model,
        prompt: message,
        max_tokens_to_sample: 1024, // correct property for this SDK version
      });
      return response.completion || ''; // 'completion' is the text returned
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error(`Anthropic attempt ${i + 1} failed:`, errMsg);
      if (i === MAX_RETRIES - 1) throw error;
      await sleep(RETRY_DELAY);
    }
  }
  return '';
}


// Unified LLM request function
async function sendLLMRequest(provider: string, model: string, message: string): Promise<string> {
  switch (provider.toLowerCase()) {
    case 'openai':
      return sendRequestToOpenAI(model, message);
    case 'anthropic':
      return sendRequestToAnthropic(model, message);
    default:
      throw new Error(`Unsupported LLM provider: ${provider}`);
  }
}

export { sendLLMRequest };
