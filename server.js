require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Connect to Railway MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT // This is the MySQL port (usually 3306)
});

db.connect(err => {
  if (err) {
    console.error('❌ DB connection failed:', err);
    return;
  }
  console.log('✅ Connected to Railway MySQL');
});

// 📥 Get all users
app.get('/api/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// ➕ Add a new user
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  db.query(
    'INSERT INTO users (name, email) VALUES (?, ?)',
    [name, email],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ id: result.insertId, name, email });
    }
  );
});

// 🚀 Start server
const PORT = process.env.APP_PORT || 5000; // Optional: add APP_PORT in your .env
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
