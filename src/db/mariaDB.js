import mariadb from 'mariadb';
import dotenv from 'dotenv';

dotenv.config();

// Connecto to mariaDB using environment variables
const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DB, 
  connectionLimit: 5, 
});

export default pool;


