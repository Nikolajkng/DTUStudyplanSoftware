// src/app/api/courses/route.ts
import pool from '../../../lib/mariaDB';
import { unstable_cache } from 'next/cache';

const fetchCoursesFromDB = async () => {
  console.log('Fetching data from the database...');
  const connection = await pool.getConnection();
  try {
    const rows = await connection.query('SELECT * FROM Courses'); // Ensure table name is correct
    return rows;
  } finally {
    connection.release();
  }
};

const cachedFetchCourses = unstable_cache(async () => {
  console.log('Using cached data or fetching fresh data...');
  return fetchCoursesFromDB();
}, [], {
  revalidate: 600, // Cache duration in seconds
});

export async function GET() {
  try {
    const rows = await cachedFetchCourses();

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