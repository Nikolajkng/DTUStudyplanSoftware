import mariadb from 'mariadb';
import dotenv from 'dotenv';

dotenv.config();

// Connecto to mariaDB using environment variables
const pool = mariadb.createPool({
  host: process.env.DB_HOST, // Usually 'localhost' or an IP address
  user: process.env.DB_USER, // Your MariaDB username
  password: process.env.DB_PASS, // Your MariaDB password
  database: process.env.DB_DB, // Your database name
  connectionLimit: 5, // Adjust this based on your load
});

export default pool;


