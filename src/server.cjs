// @ts-check
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { Client } = require('pg');

/** @type {import('express').Application} */
const app = express();

const corsOptions = {
  origin: ['http://localhost:3000', 'https://wheel-8b7y.onrender.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
  console.log(req.headers); // Log incoming headers for debugging
  next();
});

app.use(express.json());

const db = new Client({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:Magic323!@localhost:5432/paint',
});

db.connect()
  .then(() => console.log('Connected to PostgreSQL database'))
  .catch(err => console.error('Error connecting to PostgreSQL database:', err));

/**
 * @typedef {Object} Color
 * @property {Object} color - The RGB color object.
 * @property {number} score - The color's score.
 * @property {number} pixelFraction - The fraction of the image covered by this color.
 */

/**
 * Saves a palette to the database.
 * @param {number} userId - The ID of the user saving the palette.
 * @param {Array<Color>} palette - The array of color objects to save.
 */
const savePalette = async (userId, palette) => {
  if (!Array.isArray(palette) || palette.length === 0) {
    throw new Error('Palette must be a non-empty array');
  }

  // Validate each color object
  for (const color of palette) {
    if (!color.color || typeof color.color !== 'object' || !color.color.red || !color.color.green || !color.color.blue) {
      throw new Error('Each color must have a valid RGB object');
    }
    if (typeof color.score !== 'number' || typeof color.pixelFraction !== 'number') {
      throw new Error('Each color must have valid score and pixelFraction');
    }
  }

  const query = 'INSERT INTO palettes (user_id, palette, colors) VALUES ($1, $2, $3)';
  await db.query(query, [userId, JSON.stringify(palette), JSON.stringify(palette.map(c => c.color))]);
};

/**
 * Deletes a palette from the database.
 * @param {number} paletteId - The ID of the palette to delete.
 */
const deletePalette = async (paletteId) => {
  const query = 'DELETE FROM palettes WHERE id = $1';
  await db.query(query, [paletteId]);
};

// Render the saved palette(s)
app.get('/palettes/:paletteId', async (req, res) => {
  const { paletteId } = req.params;

  try {
    const query = 'SELECT * FROM palettes WHERE id = $1';
    const result = await pool.query(query, [paletteId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Palette not found' });
    }

    const palette = result.rows[0];
    res.render('palettes', { palette }); // Pass the palette to the template
  } catch (err) {
    console.error('Error retrieving palette:', err);
    res.status(500).json({ error: 'Error retrieving palette' });
  }
});

app.get('/', (req, res) => {
  res.send('Welcome to the Art Genius API');
});

app.post('/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const userCheck = await db.query('SELECT email FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query('INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4)', 
                   [firstName, lastName, email, hashedPassword]);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user' });
  }
});

app.post('/api/palettes', async (req, res) => {
  const { userId, palette } = req.body;

  // Log the incoming palette data for debugging
  console.log('Received palette:', palette);
  
  try {
    await savePalette(userId, palette);
    res.status(200).json({ message: 'Palette saved successfully' });
  } catch (error) {
    console.error('Error saving palette:', error);
    res.status(500).json({ message: 'Error saving palette', error: error.message });
  }
});

app.delete('/api/palettes/:id', async (req, res) => {
  const paletteId = parseInt(req.params.id);
  try {
    await deletePalette(paletteId);
    res.status(200).json({ message: 'Palette deleted successfully' });
  } catch (error) {
    console.error('Error deleting palette:', error);
    res.status(500).json({ message: 'Error deleting palette' });
  }
});

app.get('/user', async (req, res) => {
  const { email } = req.query;
  try {
    const user = await db.query('SELECT firstname FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user.rows[0]);
  } catch (err) {
    console.error('Error fetching user data:', err);
    res.status(500).json({ message: 'Error fetching user data' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', email);
  try {
    const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({ message: 'Logged in successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in' });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = db;
