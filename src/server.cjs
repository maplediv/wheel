// @ts-check
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { Client } = require('pg');

const app = express();

const corsOptions = {
  origin: ['http://localhost:3000', 'https://wheel-8b7y.onrender.com', 'https://wheelback.onrender.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

require('dotenv').config();

const isProduction = process.env.DATABASE_URL;

const db = new Client(
  isProduction
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {
        user: process.env.PGUSER || 'Joe',
        host: process.env.PGHOST || 'localhost',
        database: process.env.PGDATABASE || 'paint',
        password: process.env.PGPASSWORD || 'Magic323!',
        port: process.env.PGPORT ? parseInt(process.env.PGPORT, 10) : 5432,
      }
);

// Connect to the database
db.connect()
  .then(() => console.log('Connected to the database'))
  .catch((err) => console.error('Error connecting to the database', err));

app.use((req, _, next) => {
  console.log(req.headers); 
  next();
});

app.use(express.json());


/**
 * @typedef {object} PaletteColor
 * @property {object} color - RGB color object
 * @property {number} color.red - Red value (0-255)
 * @property {number} color.green - Green value (0-255)
 * @property {number} color.blue - Blue value (0-255)
 * @property {number} score - Color score
 * @property {number} pixelFraction - Pixel fraction
 */

/**
 * @typedef {object} Palette
 * @property {number} user_id - User ID
 * @property {PaletteColor[]} palette - Array of palette colors
 * @property {{red:number, green:number, blue:number}[]} colors - Array of RGB color objects
 */

/**
 * Saves a palette to the database.
 * @param {number} userId - The ID of the user.
 * @param {PaletteColor[]} palette - The palette data.
 */
const savePalette = async (userId, palette) => {
  if (!Array.isArray(palette) || palette.length === 0) {
    throw new Error('Palette must be a non-empty array');
  }

  for (const color of palette) {
    if (!color.color || typeof color.color !== 'object' || !color.color.red || !color.color.green || !color.color.blue) {
      throw new Error('Each color must have a valid RGB object');
    }
    if (typeof color.score !== 'number' || typeof color.pixelFraction !== 'number') {
      throw new Error('Each color must have valid score and pixelFraction');
    }
  }

  const colorData = palette.map(c => c.color); 
  if (!colorData || colorData.length === 0) {
    throw new Error('Colors array is empty or malformed');
  }

  const query = 'INSERT INTO palettes (user_id, palette, colors) VALUES ($1, $2, $3)';
  await db.query(query, [userId, JSON.stringify(palette), JSON.stringify(colorData)]);
};

app.get('/palettes/:paletteId', async (req, res) => {
  const paletteId = parseInt(req.params.paletteId, 10);
  try {
    const query = 'SELECT * FROM palettes WHERE id = $1';
    const result = await db.query(query, [paletteId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Palette not found' });
    }

    const palette = result.rows[0];
    res.json(palette); 
  } catch (err) {
    console.error('Error retrieving palette:', err);
    res.status(500).json({ error: 'Error retrieving palette' });
  }
});


app.get('/test-db-connection', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()'); 
    res.json({ success: true, time: result.rows[0].now });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ success: false, message: 'Database connection failed' });
  }
});



app.get('/', (_, res) => {
  res.send('Welcome to the Art Genius API');
});

app.post('/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    // Check if the email already exists
    const userCheck = await db.query('SELECT email FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into the database
    await db.query('INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4)', 
                   [firstName, lastName, email, hashedPassword]);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error registering user' });
  }
});


app.post('/api/palettes', async (req, res) => {
  const { userId, palette } = req.body;

  console.log('Received palette:', palette);
  
  try {
    await savePalette(userId, palette);
    res.status(200).json({ message: 'Palette saved successfully' });
  } catch (error) {
    console.error('Error saving palette:', error);
    res.status(500).json({ message: 'Error saving palette' });
  }
});


/**
 * @param {number} paletteId - The ID of the palette to delete.
 */
const deletePalette = async (paletteId) => {
  const query = 'DELETE FROM palettes WHERE id = $1';
  await db.query(query, [paletteId]);
};

app.delete('/api/palettes/:id', async (req, res) => {
  const paletteId = parseInt(req.params.id, 10);
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

  try {
    const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);

    if (user.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Successful login response
    res.status(200).json({
      message: 'Logged in successfully',
      user: {
        firstName: user.rows[0].firstname,
        email: user.rows[0].email
      }
    });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Error logging in. Please check server logs for details.' });
  }
});



const PORT = process.env.NODE_ENV === 'production' ? process.env.PORT : 10000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = db;
