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

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API Inventario HVAC funcionando correctamente' });
});

app.use('/api/auth', authRoutes);
app.use('/api/tools', toolRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/shopping-lists', shoppingRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/users', userRoutes);
app.use('/api/job-types', jobTypeRoutes);

module.exports = app;
