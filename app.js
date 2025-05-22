const express = require('express');
const cors = require('cors');
const app = express();
const sequelize = require('./config/mysql');
require('./config/mongo'); // connect MongoDB

// Konfigurasi CORS untuk mengizinkan akses dari localhost:5500
const corsOptions = {
  origin: 'http://localhost:5500', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type'], 
};

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html'); // agar saat buka di browser langsung tampil HTML-nya
});


app.use(cors(corsOptions)); // Terapkan CORS dengan konfigurasi

app.use(express.json());
app.use('/uploads', express.static('uploads'));

const articleRoutes = require('./routes/articleRoutes');
app.use('/api', articleRoutes);

sequelize.sync().then(() => {
  app.listen(3000, () => console.log('Server running on http://localhost:3000'));
});
