// src/app/api/courses/route.ts
import pool from '../../../lib/mariaDB';


export async function GET() {
    try {
      const connection = await pool.getConnection();
      const rows = await connection.query('SELECT * FROM Courses'); // Ensure table name is correct
      connection.release();
  
      return new Response(JSON.stringify(rows), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Database error:', error);
  
      return new Response(JSON.stringify({ error: 'Failed to fetch data' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }