const express = require('express');
const cors = require('cors');
const app = express();
const sequelize = require('./config/mysql');
require('./config/mongo'); // connect MongoDB

// Konfigurasi CORS untuk mengizinkan akses dari localhost:5500
const corsOptions = {
  origin: 'http://localhost:5500', // hanya mengizinkan origin dari localhost:5500
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Anda dapat menambahkan metode lain jika diperlukan
  allowedHeaders: ['Content-Type'], // Memungkinkan header content-type
};

app.use(cors(corsOptions)); // Terapkan CORS dengan konfigurasi

app.use(express.json());

const articleRoutes = require('./routes/articleRoutes');
app.use('/api', articleRoutes);

sequelize.sync().then(() => {
  app.listen(3000, () => console.log('Server running on http://localhost:3000'));
});
