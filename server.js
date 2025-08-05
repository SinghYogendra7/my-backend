if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const dns = require('dns');

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Optional: DNS lookup to verify DB host resolves
dns.lookup(process.env.DB_HOST, (err, address) => {
  if (err) {
    console.error('🌐 DNS lookup failed:', err);
  } else {
    console.log('🌐 DNS lookup success:', address);
  }
});

// Connect to TiDB Cloud MySQL-compatible server
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT)
});

db.connect(err => {
  if (err) {
    console.error('❌ DB connection failed:', err.message);
    process.exit(1); // Exit if DB connection fails
  }
  console.log('✅ Connected to TiDB Cloud MySQL');
});

// Routes
app.get('/api/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  db.query(
    'INSERT INTO users (name, email) VALUES (?, ?)',
    [name, email],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, name, email });
    }
  );
});

// Start server
const PORT = process.env.APP_PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
