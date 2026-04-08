import { useState, useEffect } from 'react';
import { Camera, Upload, Loader2, Save, Share2, RotateCcw, AlertTriangle } from 'lucide-react';
import { analyzeBehavior, saveBehaviorDetection, getBehaviorHistory } from '@/api/behavior';
import { BehaviorAnalysisResult, BehaviorDetection } from '@/types/behavior';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/useToast';
import { BottomNav } from '@/components/BottomNav';
import { format, subDays, isAfter } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from 'recharts';
import jsPDF from "jspdf";

const COLORS = ['#22c55e', '#ef4444', '#facc15', '#3b82f6'];

export function AIBehavior() {
  const { token } = useAuth();
  const { toast } = useToast();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<BehaviorAnalysisResult | null>(null);
  const [history, setHistory] = useState<BehaviorDetection[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    if (token) fetchAnalytics();
  }, [token]);

  const loadHistory = async () => {
    try {
      const response = await getBehaviorHistory();
      setHistory(response.detections);
    } catch (error) {
      console.error("Error loading history:", error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/api/behavior/analytics",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!response.ok) return;
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
      setResult(null);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;
    setAnalyzing(true);

    try {
      const response = await analyzeBehavior(selectedImage);
      setResult(response.result);

      toast({
        title: 'Analysis Complete',
        description: `Detected: ${response.result.behavior}`,
      });

      await fetchAnalytics();
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to analyze image',
        variant: 'destructive',
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSave = async () => {
    if (!result || !selectedImage) return;

    try {
      await saveBehaviorDetection({
        image: selectedImage,
        behavior: result.behavior,
        confidence: result.confidence,
        description: result.description,
      });

      toast({
        title: 'Success',
        description: 'Detection saved to history!',
      });

      loadHistory();
      await fetchAnalytics();
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to save detection',
        variant: 'destructive',
      });
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setResult(null);
  };

  /* =========================
     WEEKLY DETECTION TREND
  ========================== */
  const weeklyTrend = history
    .filter(d =>
      isAfter(new Date(d.createdAt), subDays(new Date(), 7))
    )
    .reduce((acc: any, curr) => {
      const day = format(new Date(curr.createdAt), "EEE");
      acc[day] = acc[day] ? acc[day] + 1 : 1;
      return acc;
    }, {});

  const weeklyData = Object.keys(weeklyTrend).map(day => ({
    day,
    detections: weeklyTrend[day]
  }));

  /* =========================
     WEEKLY EMOTION PIE
  ========================== */
  const weeklyEmotionBreakdown = history
    .filter(d =>
      isAfter(new Date(d.createdAt), subDays(new Date(), 7))
    )
    .reduce((acc: any, curr) => {
      acc[curr.behavior] = acc[curr.behavior]
        ? acc[curr.behavior] + 1
        : 1;
      return acc;
    }, {});

  const weeklyEmotionData = Object.entries(weeklyEmotionBreakdown).map(
    ([key, value]) => ({
      name: key,
      value
    })
  );

  /* =========================
     AI SUMMARY
  ========================== */
  const generateAISummary = () => {
    if (!analytics) return "";
    if (analytics.riskLevel === "High")
      return "Your dog's recent emotional pattern suggests possible stress or discomfort. Close monitoring or consultation is advised.";
    if (analytics.riskLevel === "Moderate")
      return "Your dog shows mixed emotional signals. Consider observing behavioral triggers.";
    return "Your dog appears emotionally stable and healthy.";
  };

  /* =========================
     VETERINARY PDF REPORT
  ========================== */
  const generateVetReport = () => {
    const pdf = new jsPDF();
    const today = format(new Date(), "PPP");

    const weeklyRecords = history.filter(d =>
      isAfter(new Date(d.createdAt), subDays(new Date(), 7))
    );

    const totalDetections = weeklyRecords.length;

    const avgConfidence =
      totalDetections > 0
        ? (
            weeklyRecords.reduce((sum, d) => sum + d.confidence, 0) /
            totalDetections
          ).toFixed(1)
        : 0;

    const emotionBreakdown = weeklyRecords.reduce((acc: any, curr) => {
      acc[curr.behavior] = acc[curr.behavior]
        ? acc[curr.behavior] + 1
        : 1;
      return acc;
    }, {});

    let y = 20;

    pdf.setFontSize(18);
    pdf.text("Pet Behavioral Analysis Report", 20, y);

    y += 10;
    pdf.setFontSize(11);
    pdf.text(`Generated on: ${today}`, 20, y);

    y += 10;
    pdf.text("Reporting Period: Last 7 Days", 20, y);

    y += 15;
    pdf.setFontSize(14);
    pdf.text("1. Emotional Distribution (Weekly)", 20, y);

    y += 10;
    pdf.setFontSize(11);

    Object.entries(emotionBreakdown).forEach(([emotion, count]) => {
      const percent =
        totalDetections > 0
          ? ((Number(count) / totalDetections) * 100).toFixed(1)
          : 0;

      pdf.text(`${emotion}: ${count} (${percent}%)`, 25, y);
      y += 8;
    });

    y += 10;
    pdf.setFontSize(14);
    pdf.text("2. Weekly Detection Summary", 20, y);

    y += 10;
    pdf.setFontSize(11);
    pdf.text(`Total Detections: ${totalDetections}`, 25, y);

    y += 8;
    pdf.text(`Average Confidence: ${avgConfidence}%`, 25, y);

    y += 15;
    pdf.setFontSize(14);
    pdf.text("3. Risk Assessment", 20, y);

    y += 10;
    pdf.setFontSize(11);
    pdf.text(`Risk Level: ${analytics?.riskLevel || "N/A"}`, 25, y);

    y += 8;
    pdf.text(`Alert Triggered: ${analytics?.alert ? "Yes" : "No"}`, 25, y);

    y += 15;
    pdf.setFontSize(14);
    pdf.text("4. AI Interpretation", 20, y);

    y += 10;
    pdf.setFontSize(11);
    pdf.text(generateAISummary() || "No summary available.", 25, y, {
      maxWidth: 160,
    });

    pdf.save("Pet-Behavioral-Report.pdf");
  };

  return (
    <div className="pb-20">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl font-bold mb-6">
          AI Behavior Detection
        </h1>

        {/* IMAGE SECTION */}
        <Card className="mb-6">
          <CardContent className="p-6">
            {!selectedImage ? (
              <div className="text-center space-y-4">
                <p>Select a photo of your dog</p>
                <Button asChild>
                  <label>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Photo
                    <input type="file" accept="image/*" onChange={handleImageSelect} hidden />
                  </label>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <img src={selectedImage} className="w-full max-h-96 object-contain rounded-lg" />
                {!result ? (
                  <Button onClick={handleAnalyze} disabled={analyzing}>
                    {analyzing ? <Loader2 className="animate-spin" /> : "Analyze"}
                  </Button>
                ) : (
                  <div>
                    <h3 className="text-xl font-bold">{result.behavior}</h3>
                    <p>{result.confidence}% confident</p>
                    <div className="flex gap-3 mt-4">
                      <Button onClick={handleReset}>Analyze Another</Button>
                      <Button onClick={handleSave}>Save</Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 🚨 Predictive Alert */}
        {analytics?.alert && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 flex items-center gap-2">
            <AlertTriangle />
            High emotional stress detected. Consider intervention.
          </div>
        )}

        {/* 📊 All-Time Emotion Breakdown */}
        {analytics && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Emotion Breakdown</CardTitle>
            </CardHeader>
            <CardContent style={{ height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={Object.entries(analytics.emotionBreakdown).map(([key, value]) => ({ name: key, value }))}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label
                  >
                    {Object.keys(analytics.emotionBreakdown).map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* 🥧 Weekly Emotion Breakdown */}
        {weeklyEmotionData.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Weekly Emotion Breakdown (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent style={{ height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={weeklyEmotionData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label
                  >
                    {weeklyEmotionData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* 📈 Weekly Detection Trend */}
        {weeklyData.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Weekly Detection Trend</CardTitle>
            </CardHeader>
            <CardContent style={{ height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="detections" stroke="#3b82f6" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* 🧠 AI Summary */}
        {analytics && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>AI Behavioral Health Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{generateAISummary()}</p>
              <p className="mt-2 font-semibold">
                Risk Level: {analytics.riskLevel}
              </p>

              {/* PDF Button BELOW summary */}
              <div className="mt-4">
                <Button onClick={generateVetReport}>
                  Download Veterinary Report (PDF)
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

      </div>

      <BottomNav />
    </div>
  );
}