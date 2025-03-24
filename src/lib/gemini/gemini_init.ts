// src/lib/utils/gemini-ai.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

// Valid model options
export const GEMINI_MODELS = {
  FLASH: 'gemini-2.0-flash',
  FLASH_LITE: 'gemini-2.0-flash-lite',
  BASE: 'gemini-1.5',
  PRO: 'gemini-1.5-pro'
} as const;

export type GeminiModel = typeof GEMINI_MODELS[keyof typeof GEMINI_MODELS];

// Default system instruction - can be customized or imported from elsewhere
const DEFAULT_INSTRUCTION = "You are a helpful AI assistant.";

interface GeminiClientConfig {
  apiKey?: string;
  defaultModel?: GeminiModel;
  systemInstruction?: string;
}

interface GenerateContentOptions {
  prompt: string;
  model?: GeminiModel;
  systemInstruction?: string;
}

export class GeminiClient {
  private apiKey: string;
  private defaultModel: GeminiModel;
  private defaultSystemInstruction: string;
  private genAI: GoogleGenerativeAI;

  constructor(config: GeminiClientConfig = {}) {
    this.apiKey = config.apiKey || process.env.GEMINI_API_KEY || "";
    this.defaultModel = config.defaultModel || GEMINI_MODELS.FLASH;
    this.defaultSystemInstruction = config.systemInstruction || DEFAULT_INSTRUCTION;
    this.genAI = new GoogleGenerativeAI(this.apiKey);
  }

  async generateContent(options: GenerateContentOptions) {
    try {
      const { prompt, model = this.defaultModel, systemInstruction = this.defaultSystemInstruction } = options;
      
      const modelInstance = this.genAI.getGenerativeModel({
        model,
        systemInstruction,
      });

      const result = await modelInstance.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('Error generating content:', error);
      throw error;
    }
  }

  async generateContentStream(options: GenerateContentOptions) {
    try {
      const { prompt, model = this.defaultModel, systemInstruction = this.defaultSystemInstruction } = options;
      
      const modelInstance = this.genAI.getGenerativeModel({
        model,
        systemInstruction,
      });

      const result = await modelInstance.generateContentStream(prompt);
      
      // Return the stream directly for use in the API route
      return result.stream;
    } catch (error) {
      console.error('Error generating content stream:', error);
      throw error;
    }
  }
}

// Singleton instance with default configuration
let geminiClientInstance: GeminiClient | null = null;

export function getGeminiClient(config?: GeminiClientConfig): GeminiClient {
  if (!geminiClientInstance) {
    geminiClientInstance = new GeminiClient(config);
  }
  return geminiClientInstance;
}