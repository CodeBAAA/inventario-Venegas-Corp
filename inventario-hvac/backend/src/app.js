const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const jobTypeRoutes = require('./routes/jobTypeRoutes');
const authRoutes = require('./routes/authRoutes');
const toolRoutes = require('./routes/toolRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const shoppingRoutes = require('./routes/shoppingRoutes');
const reportRoutes = require('./routes/reportRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173,http://localhost:5174')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    // Requests without Origin (for example, curl or server-to-server) are valid.
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`Origen no permitido por CORS: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(helmet());

app.use(cors(corsOptions));

app.options('*', cors(corsOptions));

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API Inventario HVAC funcionando correctamente' });
});

app.get('/health', (req, res) => {
  res.json({
    ok: true,
    message: 'Backend funcionando correctamente'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/tools', toolRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/shopping-lists', shoppingRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/users', userRoutes);
app.use('/api/job-types', jobTypeRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: 'Ruta no encontrada'
  });
});

app.use((err, req, res, next) => {
  console.error('Error interno:', err);

  res.status(err.status || 500).json({
    message: err.message || 'Error interno del servidor'
  });
});

module.exports = app;
