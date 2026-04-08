export interface BehaviorDetection {
  _id: string;
  userId: string;
  image: string;
  behavior: 'Happy' | 'Angry' | 'Sad' | 'Sleeping' | 'Barking' | 'Howling' | 'Dizzy' | 'Standing' | 'Yawning';
  confidence: number;
  description: string;
  createdAt: string;
}

export interface BehaviorAnalysisResult {
  behavior: string;
  confidence: number;
  description: string;
  emoji: string;
}