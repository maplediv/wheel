const express = require('express');
const bcrypt = require('bcrypt');
const { Client } = require('pg');
const cors = require('cors');

// Create a new PostgreSQL client instance
const db = new Client({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:Magic323!@localhost:5432/paint',
});

// Connect to the database
db.connect()
  .then(() => console.log('Connected to PostgreSQL database'))
  .catch(err => console.error('Error connecting to PostgreSQL database:', err));

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Register a new user
app.post('/register', async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    await db.query('INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4)', [firstName, lastName, email, hashedPassword]);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    next(err);
  }
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = db;
