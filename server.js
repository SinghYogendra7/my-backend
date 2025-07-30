const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Connect to InfinityFree MySQL
const db = mysql.createConnection({
  host: 'sql309.infinityfree.com',
  user: 'if0_39596976',
  password: 'FSI3VhVosFw', // 🔒 Replace this with your actual vPanel password
  database: 'if0_39596976_myapp'
});

db.connect(err => {
  if (err) {
    console.error('❌ DB connection failed:', err);
    return;
  }
  console.log('✅ Connected to InfinityFree MySQL');
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
app.listen(5000, () => {
  console.log('🚀 Server running at http://localhost:5000');
});
