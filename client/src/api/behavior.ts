import api from './api';
import { BehaviorDetection, BehaviorAnalysisResult } from '@/types/behavior';

// Description: Analyze dog behavior from image
// Endpoint: POST /api/behavior/analyze
// Request: { image: string (base64) }
// Response: { result: BehaviorAnalysisResult }
export const analyzeBehavior = async (image: string): Promise<{ result: BehaviorAnalysisResult }> => {
  try {
    const response = await api.post('/api/behavior/analyze', { image });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Get behavior detection history
// Endpoint: GET /api/behavior/history
// Request: {}
// Response: { detections: BehaviorDetection[] }
export const getBehaviorHistory = async (): Promise<{ detections: BehaviorDetection[] }> => {
  try {
    const response = await api.get('/api/behavior/history');
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Save behavior detection to history
// Endpoint: POST /api/behavior/save
// Request: { image: string, behavior: string, confidence: number, description: string }
// Response: { detection: BehaviorDetection, message: string }
export const saveBehaviorDetection = async (
  data: { image: string; behavior: string; confidence: number; description: string }
): Promise<{ detection: BehaviorDetection; message: string }> => {
  try {
    const response = await api.post('/api/behavior/save', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};
