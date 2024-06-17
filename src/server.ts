import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { Client } from 'pg';
import cors from 'cors';

const db = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

db.connect()
  .then(() => console.log('Connected to PostgreSQL database'))
  .catch(err => console.error('Error connecting to PostgreSQL database:', err));

const app = express();

app.use(cors({
  origin: 'https://wheel-8b7y.onrender.com',
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
}));
app.use(express.json());

app.post('/register', async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const userCheck = await db.query('SELECT email FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      'INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4)',
      [firstName, lastName, email, hashedPassword]
    );
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user' });
  }
});

app.get('/user', async (req: Request, res: Response) => {
  try {
    const { email } = req.query; // Assuming email is provided as a query parameter
    const user = await db.query('SELECT firstname FROM users WHERE email = $1', [email as string]);
    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    const userData = user.rows[0];
    res.status(200).json(userData);
  } catch (err) {
    console.error('Error fetching user data:', err);
    res.status(500).json({ message: 'Error fetching user data' });
  }
});

app.post('/login', async (req: Request, res: Response) => {
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

    res.status(200).json({ message: 'Logged in successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in' });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default db;
