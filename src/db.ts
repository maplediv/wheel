import { Client } from 'pg';

// Construct the connection URI
const DB_URI = process.env.DATABASE_URL || 'postgresql://postgres:Magic323!@localhost:5432/paint';

// Create a new client instance with the connection URI
const db = new Client({
  connectionString: DB_URI,
});

// Connect to the database
db.connect()
  .then(() => console.log('Connected to PostgreSQL database'))
  .catch(err => console.error('Error connecting to PostgreSQL database:', err));

export default db;
