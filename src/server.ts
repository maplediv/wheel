// Import necessary modules
import express, { Application, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import db from './db'; // Import your database connection

const app: Application = express();

// Middleware
app.use(express.json());

// Register a new user
// Register a new user
app.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Destructure the required fields from the request body
    const { firstName,lastName, email, password } = req.body;
    console.log  ("inside register")
    console.log  (firstName,lastName, email, password)
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
     // Insert the new user into the database
     await db.query('INSERT INTO users (firstname,lastname, email, password) VALUES ($1, $2, $3, $4)', [firstName,lastName, email, hashedPassword]);
 

    // // Check if any of the required fields are missing in the request body
    // if (!username || !email || !password) {
    //   return res.status(400).json({ message: 'Username, email, and password are required' });
    // }

    // Continue with the registration logic
    // Check if the username or email already exists
    // const existingUser = await db.query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email]);
    // if (existingUser.rows.length > 0) {
    //   return res.status(400).json({ message: 'Username or email already exists' });
    // }

    

   

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    next(err);
  }
});






// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
