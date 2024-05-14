// Import necessary modules
const express = require('express');
const bcrypt = require('bcrypt');
const { Client } = require('pg'); // Import Client from pg

// Create a new PostgreSQL client instance
const client = new Client({
  connectionString: 'postgres://postgres:Magic323!@localhost:5432/paint',
});

// Connect to the database
client.connect()
  .then(() => console.log('Connected to PostgreSQL database'))
  .catch(err => console.error('Error connecting to PostgreSQL database:', err));

const app = express();

// Middleware
app.use(express.json());

// Define the route handler for /timestamp
app.get('/timestamp', (req, res) => {
  // Get the current timestamp
  const timestamp = new Date().toISOString();
  
  // Send the timestamp as a JSON response
  res.json({ timestamp });
});



// Register a new user
app.post('/register', async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const query = 'INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4)';
    await client.query(query, [firstName, lastName, email, hashedPassword]);

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
