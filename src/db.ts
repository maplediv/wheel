import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';  // Import the cors package
import bcrypt from 'bcrypt';
import { Client } from 'pg'; // Import Client from pg

const app: Application = express();

// Enable CORS for your frontend
const corsOptions = {
  origin: ['http://localhost:3000', 'https://wheel-8b7y.onrender.com'], // Allow both localhost and production origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow necessary HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Add any other necessary headers
};

app.use(cors(corsOptions)); // Use CORS middleware with the configured options

// Create a new PostgreSQL client instance
const db = new Client({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:Magic323!@localhost:5432/paint',
});

// Connect to the database
db.connect()
  .then(() => console.log('Connected to PostgreSQL database'))
  .catch(err => console.error('Error connecting to PostgreSQL database:', err));

// Middleware
app.use(express.json());

// Register a new user
app.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  console.log("Received registration data:", req.body);
  try {
    const { firstName, lastName, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query('INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4)', [firstName, lastName, email, hashedPassword]);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    next(err);
  }
});

app.post('/api/palettes', async (req: Request, res: Response, next: NextFunction) => {
  console.log("Received palette data:", req.body);
  try {
    const { userid, palette } = req.body;

    // Validate palette as an array of hex color codes
    if (!Array.isArray(palette) || !palette.every(color => /^#[0-9A-Fa-f]{6}$/.test(color))) {
      return res.status(400).json({ message: 'Invalid palette format. Must be an array of hex codes.' });
    }

    // Insert each hex code as a new row
    for (const hexcode of palette) {
      await db.query(
        'INSERT INTO palettes (userid, hexcodes) VALUES ($1, $2)',
        [userid, hexcode]
      );
    }

    res.status(201).json({ message: 'Palette saved successfully' });
  } catch (err) {
    next(err);
  }
});





// Start the server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default db;
