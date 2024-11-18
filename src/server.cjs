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

app.use((req, _, next) => {
  console.log(req.headers); 
  next();
});

app.use(express.json());

const db = new Client({
  user: process.env.PGUSER || 'Joe',
  host: process.env.PGHOST || 'localhost',
  database: process.env.PGDATABASE || 'paint',
  password: process.env.PGPASSWORD || 'Magic323!',
  port: process.env.PGPORT ? parseInt(process.env.PGPORT, 10) : 5432,
});

db.connect()
  .then(() => console.log('Connected to PostgreSQL database'))
  .catch(err => console.error('Error connecting to PostgreSQL database:', err));


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
  console.log(req.body);
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

  console.log('Received palette:', palette);
  
  try {
    await savePalette(userId, palette);
    res.status(200).json({ message: 'Palette saved successfully' });
  } catch (error) {
    console.error('Error saving palette:', error);
    res.status(500).json({ message: 'Error saving palette' });
  }
});


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

    res.status(200).json({
      message: 'Logged in successfully',
      user: {
        firstName: user.rows[0].firstname, 
        email: user.rows[0].email
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in' });
  }
});


const PORT = process.env.NODE_ENV === 'production' ? process.env.PORT : 10000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = db;
