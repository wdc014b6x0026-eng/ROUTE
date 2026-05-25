import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import wilayahRoutes from './routes/wilayah.js';
import usersRoutes from './routes/users.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/wilayah', wilayahRoutes);
app.use('/api/users', usersRoutes);

// Route test
app.get('/', (req, res) => {
  res.json({ message: 'ROUTE API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});