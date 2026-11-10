require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');

const logger = require('./middlewares/logger');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');
const sesiFotoRoutes = require('./routes/sesiFotoRoutes');
const fotograferRoutes = require('./routes/fotograferRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(logger);
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'REST API Studio Foto berjalan' });
});

app.use('/sesi-foto', sesiFotoRoutes);
app.use('/fotografer', fotograferRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

if (require.main === module) {
  mongoose.connect(process.env.DB_URI)
    .then(() => {
      console.log('Terhubung ke MongoDB');
      app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));
    })
    .catch((err) => {
      console.error('Gagal terhubung ke MongoDB:', err.message);
      process.exit(1);
    });
}

module.exports = app;
