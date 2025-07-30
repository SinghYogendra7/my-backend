if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// 🔍 Debug: Show loaded environment variables
console.log('🔧 Loaded env vars:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '*****' : null);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PORT:', process.env.DB_PORT);

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const dns = require('dns');

const app = express();
app.use(cors());
app.use(express.json());

// 🌐 DNS Test
dns.lookup(process.env.DB_HOST, (err, address) => {
  if (err) {
    console.error('🌐 DNS lookup failed:', err);
  } else {
    console.log('🌐 DNS lookup success:', address);
  }
});

// 🔌 DB Connection
console.log('🔧 Connecting to DB with host:', process.env.DB_HOST);
const db = mysql.createConnection({
  host: 'interchange.proxy.rlwy.net',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT)
});

db.connect(err => {
  if (err) {
    console.error('❌ DB connection failed:', err.message);
    return;
  }
  console.log('✅ Connected to Railway MySQL');
});

// 🛠️ Routes
app.get('/api/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

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

// 🚀 Start Server
const PORT = process.env.APP_PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
