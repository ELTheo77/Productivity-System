require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const cors = require('cors');
// const { Pool } = require('pg'); // You'll use this later

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Allow requests from your frontend (running on a different port)
app.use(express.json()); // Parse JSON request bodies

// Example: Database connection (you'll uncomment and configure this later)
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   // ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false // For some cloud DBs
// });

// pool.connect()
//   .then(() => console.log('Connected to PostgreSQL database'))
//   .catch(err => console.error('Database connection error', err.stack));


// API Routes (you'll define these later)
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// Auth routes, calendar routes, task routes, habit routes will go here

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});