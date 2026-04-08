import express, { Request, Response } from 'express';
import { requireUser } from './middlewares/auth';
import axios from 'axios';
import Behavior from '../models/Behavior';
import { getBehaviorAnalytics } from "../services/behaviorAnalyticsService";

const router = express.Router();
const ML_API = "http://127.0.0.1:8000";

router.post('/analyze', requireUser(), async (req: Request, res: Response) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const response = await axios.post(`${ML_API}/api/behavior/analyze`, { image });

    const result = response.data.result;

    const behavior = new Behavior({
      behavior: result.behavior,
      confidence: result.confidence,
      description: result.description,
      userId: req.user!._id
    });

    await behavior.save();

    res.status(200).json({
      message: "Behavior analyzed and saved",
      result
    });

  } catch (error: any) {
    console.error("Behavior analyze error:", error.message);
    res.status(500).json({ message: "Failed to analyze behavior" });
  }
});

router.get('/history', requireUser(), async (req: Request, res: Response) => {
  try {
    const detections = await Behavior.find({
      userId: req.user!._id
    }).sort({ createdAt: -1 });

    res.status(200).json({ detections });

  } catch (error: any) {
    console.error("Behavior history error:", error.message);
    res.status(500).json({ message: "Failed to fetch history" });
  }
});

router.get('/analytics', requireUser(), async (req: Request, res: Response) => {
  try {
    const analytics = await getBehaviorAnalytics(
      req.user!._id.toString()
    );

    res.status(200).json(analytics);

  } catch (error: any) {
    console.error("Behavior analytics error:", error.message);
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
});


export default router;
