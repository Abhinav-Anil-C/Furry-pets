import express from 'express';
import { Request, Response } from 'express';
import lostPetRoutes from "./lostPetRoutes";
const router = express.Router();

// Root path response
router.get("/", (req: Request, res: Response) => {
  res.status(200).send("Welcome to Your Website!");
});

router.get("/ping", (req: Request, res: Response) => {
  res.status(200).send("pong");
});
// Register the LostPet routes
router.use("/lost-pets", lostPetRoutes);

export default router;