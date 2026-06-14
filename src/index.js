import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import authRoutes from './routes/auth.js';
import wilayahRoutes from './routes/wilayah.js';
import usersRoutes from './routes/users.js';
import jadwalTetapRoutes from './routes/jadwalTetap.js';
import jadwalHarianRoutes from './routes/jadwalHarian.js';
import requestRoutes from './routes/request.js';
import riwayatRoutes from './routes/riwayat.js';
import artikelRoutes from './routes/artikel.js';
import pengumumanRoutes from './routes/pengumuman.js';
import { startReminderScheduler } from './jobs/reminderScheduler.js';

const app = express();
const PORT = process.env.PORT || 3000;

// ─── CORS ────────────────────────────────────────────────────────────────────
// Allow the Vite dev server (5173) and any production frontend URL.
// Add your deployed frontend URL here when going to production.
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  // add production URL e.g. 'https://route.example.com'
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, Postman, server-to-server)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked for origin: ${origin}`));
    }
  },
  credentials: true,
}));

app.use(express.json());

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth',         authRoutes);
app.use('/api/wilayah',      wilayahRoutes);
app.use('/api/users',        usersRoutes);
app.use('/api/jadwal-tetap', jadwalTetapRoutes);
app.use('/api/jadwal-harian', jadwalHarianRoutes);
app.use('/api/request',      requestRoutes);
app.use('/api/riwayat',      riwayatRoutes);
app.use('/api/artikel',      artikelRoutes);
app.use('/api/pengumuman',   pengumumanRoutes);

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({ message: 'ROUTE API is running!', timestamp: new Date().toISOString() });
});

// ─── 404 catch-all ───────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ status: 'error', message: 'Endpoint not found' });
});

// ─── Global error handler ─────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ status: 'error', message: err.message ?? 'Internal server error' });
});

startReminderScheduler();
app.listen(PORT, () => {
  console.log(`ROUTE API running on http://localhost:${PORT}`);
});
