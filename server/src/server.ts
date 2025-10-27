import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { authRouter } from './routes/auth.js';
import { clientRouter } from './routes/clients.js';
import { dashboardRouter } from './routes/dashboard.js';
import { profileRouter } from './routes/profile.js';
import { interactionRouter } from './routes/interaction.js';

 

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/neurocrm';


mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((error: any )=> console.error('❌ MongoDB connection error:', error));

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/clients', clientRouter);
app.use('/api/v1/dashboard', dashboardRouter);
app.use('/api/v1/users', profileRouter);
app.use('/api/v1/interactions', interactionRouter);


// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'NeuroCRM API is running', timestamp: new Date().toISOString() });
});

app.use('/api/v1/auth', authRouter);

// Error handling middleware
app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});