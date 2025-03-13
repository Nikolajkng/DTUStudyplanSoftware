import mariadb from 'mariadb';

const pool = mariadb.createPool({
  host: '172.234.116.57', // Usually 'localhost' or an IP address
  user: 'fewrick', // Your MariaDB username
  password: 'aGfGfDh8f0IVav', // Your MariaDB password
  database: 'db_dtu', // Your database name
  connectionLimit: 5, // Adjust this based on your load
});

export default pool;


