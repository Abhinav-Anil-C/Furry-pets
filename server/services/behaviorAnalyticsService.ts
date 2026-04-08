import Behavior from "../models/Behavior";

interface AnalyticsResult {
  total: number;
  dominantEmotion: string;
  riskLevel: "Low" | "Moderate" | "High";
  emotionBreakdown: Record<string, number>;
  alert: boolean;
}

export const getBehaviorAnalytics = async (
  userId: string
): Promise<AnalyticsResult> => {
  // Get last 30 detections
  const detections = await Behavior.find({ userId })
    .sort({ createdAt: -1 })
    .limit(30);

  const total = detections.length;

  if (total === 0) {
    return {
      total: 0,
      dominantEmotion: "N/A",
      riskLevel: "Low",
      emotionBreakdown: {},
      alert: false,
    };
  }

  const emotionCounts: Record<string, number> = {};

  detections.forEach((d) => {
    emotionCounts[d.behavior] =
      (emotionCounts[d.behavior] || 0) + 1;
  });

  // Convert to percentages
  const emotionBreakdown: Record<string, number> = {};
  Object.keys(emotionCounts).forEach((emotion) => {
    emotionBreakdown[emotion] = Math.round(
      (emotionCounts[emotion] / total) * 100
    );
  });

  // Find dominant emotion
  const dominantEmotion = Object.keys(emotionCounts).reduce((a, b) =>
    emotionCounts[a] > emotionCounts[b] ? a : b
  );

  // Risk logic
  const angryPercent = emotionBreakdown["Angry"] || 0;
  const sadPercent = emotionBreakdown["Sad"] || 0;

  let riskLevel: "Low" | "Moderate" | "High" = "Low";
  let alert = false;

  if (angryPercent > 40 || sadPercent > 50) {
    riskLevel = "High";
    alert = true;
  } else if (angryPercent > 25 || sadPercent > 30) {
    riskLevel = "Moderate";
  }

  return {
    total,
    dominantEmotion,
    riskLevel,
    emotionBreakdown,
    alert,
  };
};
