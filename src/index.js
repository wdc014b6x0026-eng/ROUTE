import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import authRoutes from './routes/auth.js';
import wilayahRoutes from './routes/wilayah.js';
import usersRoutes from './routes/users.js';
import jadwalTetapRoutes from './routes/jadwalTetap.js';
import jadwalHarianRoutes from './routes/jadwalHarian.js';
import requestRoutes from './routes/request.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/wilayah', wilayahRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/jadwal-tetap', jadwalTetapRoutes);
app.use('/api/jadwal-harian', jadwalHarianRoutes);
app.use('/api/request', requestRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'ROUTE API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});