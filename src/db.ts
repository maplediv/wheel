import express, { Application, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { Client } from 'pg'; // Import Client from pg

// Create a new PostgreSQL client instance
const db = new Client({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:Magic323!@localhost:5432/paint',
});

// Connect to the database
db.connect()
  .then(() => console.log('Connected to PostgreSQL database'))
  .catch(err => console.error('Error connecting to PostgreSQL database:', err));

const app: Application = express();

// Middleware
app.use(express.json());

// Register a new user
app.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Destructure the required fields from the request body
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
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default db;
