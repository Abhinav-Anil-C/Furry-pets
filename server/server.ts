import dotenv from 'dotenv';
import express from 'express';
import { Request, Response } from 'express';
import basicRoutes from './routes/index';
import authRoutes from './routes/authRoutes';
import petRoutes from './routes/petRoutes';
import appointmentRoutes from './routes/appointmentRoutes';
import behaviorRoutes from './routes/behaviorRoutes';
import chatRoutes from './routes/chatRoutes';
import locationRoutes from './routes/locationRoutes';
import profileRoutes from './routes/profileRoutes';
import lostPetRoutes from "./routes/lostPetRoutes";


import { connectDB } from './config/database';
import cors from 'cors';

// Load environment variables
dotenv.config();

if (!process.env.DATABASE_URL) {
  console.error("Error: DATABASE_URL variables in .env missing.");
  process.exit(-1);
}

const app = express();
const port = process.env.PORT || 3000;

// Pretty-print JSON responses
app.enable('json spaces');
// We want to be consistent with URL paths, so we enable strict routing
app.enable('strict routing');

app.use(cors({}));
app.use(express.json({ limit: '50mb' })); // Increased limit for image uploads
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Database connection
connectDB();

app.on("error", (error: Error) => {
  console.error(`Server error: ${error.message}`);
  console.error(error.stack);
});

// Basic Routes
app.use(basicRoutes);
// Authentication Routes
app.use('/api/auth', authRoutes);
// Pet Routes
app.use('/api/pets', petRoutes);
// Appointment Routes
app.use('/api/appointments', appointmentRoutes);
// Behavior Detection Routes
app.use('/api/behavior', behaviorRoutes);
// Chat Routes
app.use('/api/chat', chatRoutes);
// Location Routes
app.use('/api/locations', locationRoutes);
// Profile Routes
app.use('/api/profile', profileRoutes);
// LOst pet routes
app.use("/api/lostpets", lostPetRoutes);


// If no routes handled the request, it's a 404
app.use((req: Request, res: Response) => {
  res.status(404).send("Page not found.");
});

// Error handling
app.use((err: Error, req: Request, res: Response) => {
  console.error(`Unhandled application error: ${err.message}`);
  console.error(err.stack);
  res.status(500).send("There was an error serving your request.");
});

const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

server.on('error', (error: any) => {
  if (error.code === 'EADDRINUSE') {
    console.warn(`Port ${port} is already in use. Attempting to use alternate port...`);
    // Kill existing process on this port (for development)
    process.exit(1);
  } else {
    throw error;
  }
});