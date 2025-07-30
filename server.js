if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

console.log('Loaded env vars:');
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

console.log("DB connection config:", {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD ? '*****' : null,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

dns.lookup(process.env.DB_HOST, (err, address) => {
  if (err) {
    console.error('DNS lookup failed:', err);
  } else {
    console.log('DNS lookup success:', address);
  }
});

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT)
});

db.connect(err => {
  if (err) {
    console.error('❌ DB connection failed:', err);
    return;
  }
  console.log('✅ Connected to Railway MySQL');
});

// ... your routes here ...

const PORT = process.env.APP_PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
