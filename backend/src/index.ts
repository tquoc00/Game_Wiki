import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes';
import categoryRoutes from './routes/categoryRoutes';
import articleRoutes from './routes/articleRoutes';
import revisionRoutes from './routes/revisionRoutes';
import gameRoutes from './routes/gameRoutes';
import ddragonRoutes from './routes/ddragonRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware configurations
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log middleware for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// API Routes mounting
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/ddragon', ddragonRoutes);
app.use('/api', revisionRoutes); // Mounts /api/articles/:slug/revisions and /api/revisions/:id

// Root response
app.get('/', (req, res) => {
  res.json({ message: 'Vietnamese Game Wiki API Server is running.' });
});

// Start listening
app.listen(PORT, () => {
  console.log(`🚀 Backend server is running at http://localhost:${PORT}`);
});
