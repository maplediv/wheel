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
   * @property {number} userid - User ID
   * @property {PaletteColor[]} palette - Array of palette colors
   * @property {{red:number, green:number, blue:number}[]} colors - Array of RGB color objects
   */
  app.put('/api/palettes/:paletteId', async (req, res) => {
    const { paletteId } = req.params;
    const { name } = req.body;
  
    try {
      await db.query('UPDATE palettes SET name = $1 WHERE id = $2', [name, paletteId]);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error updating palette name:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Get palettes by user ID
  app.get('/api/palettes/:userId', async (req, res) => {
    const { userId } = req.params;
  
    try {
      const result = await db.query(
        'SELECT id, name, hexcodes FROM palettes WHERE userid = $1',
        [userId]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'No palettes found for this user.' });
      }
  
      const palettes = result.rows.map((row) => ({
        id: row.id,
        name: row.name || null, // Handle missing names
        colors: row.hexcodes
          ? row.hexcodes.split(',').map((hex) => {
              if (!hex) return null; // Handle empty or null hex codes
              const bigint = parseInt(hex.replace('#', ''), 16);
              return {
                red: (bigint >> 16) & 255,
                green: (bigint >> 8) & 255,
                blue: bigint & 255,
              };
            }).filter(Boolean) // Remove null entries
          : [],
      }));
  
      res.status(200).json(palettes);
    } catch (error) {
      console.error('Error fetching palettes:', error);
      res.status(500).json({ message: 'Internal server error' });
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
    console.log('Received request to save palette:', req.body);
    const { userId, hexCodes } = req.body; // Get user ID and hex codes from the request body
  
    // Ensure hexCodes is an array, default to empty array if undefined
    const palette = Array.isArray(hexCodes) ? hexCodes : [];
  
    // Validate that palette is an array
    if (!Array.isArray(palette)) {
      return res.status(400).json({ error: "Palette must be an array" });
    }
  
    // Join the hex codes array into a comma-separated string
    const hexCodeString = palette.join(',');
  
    try {
      // Save the hex codes in the database
      const query = 'INSERT INTO palettes (userid, hexcodes) VALUES ($1, $2) RETURNING id';
      const result = await db.query(query, [userId, hexCodeString]);
  
      const newPalette = {
        id: result.rows[0].id,
        userId,
        palette, // Return the array of hex codes for confirmation
      };
  
      res.status(201).json(newPalette);
    } catch (err) {
      console.error('Error saving palette:', err);
      res.status(500).json({ error: 'Error saving palette' });
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

    console.log('Login request received:', { email, password }); // Log the incoming login data

    try {
      // Query to find the user by email
      const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);

      console.log('User query result:', user.rows); // Log the result of the user query

      if (user.rows.length === 0) {
        console.log('User not found for email:', email); // Log if no user is found
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      // Compare the provided password with the stored hash
      const isMatch = await bcrypt.compare(password, user.rows[0].password);
      console.log('Password comparison result:', isMatch); // Log the result of password comparison

      if (!isMatch) {
        console.log('Password mismatch for email:', email); // Log if passwords don't match
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      // Log successful login attempt
      console.log('Login successful for user:', email);

      // Successful login response, including the 'id' field
      res.status(200).json({
        message: 'Logged in successfully',
        user: {
          id: user.rows[0].userid, // Include 'id' in the response
          firstName: user.rows[0].firstname,
          lastName: user.rows[0].lastname,
          email: user.rows[0].email
        }
      });
    } catch (err) {
      // Log any errors during the process
      console.error('Error during login:', err);
      res.status(500).json({ message: 'Error logging in. Please check server logs for details.' });
    }
  });

  const PORT = process.env.NODE_ENV === 'production' ? process.env.PORT : 10000;

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  module.exports = db;
