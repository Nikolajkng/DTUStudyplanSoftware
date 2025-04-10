'use server';

// src/app/api/courses/route.ts
import pool from '../../db/mariaDB_connection';
import { unstable_cache } from 'next/cache';
export interface Course {
  course_id: string;
  course_name: string;
  course_type: string;
  ects: number;
  placement: string;
}

// tries to fetch data from the database
const fetchCoursesFromDB = async () => {
  console.log('Fetching data from the database...');
  const connection = await pool.getConnection();
  try {
    const rows = await connection.query('SELECT * FROM Courses') as Course[]; 

    return rows;
  } finally {
    connection.release();
  }
};

// Caches the fetched data for 10 minutes
export const cachedFetchCourses = unstable_cache(async () => {
  console.log('Using cached data or fetching fresh data...');
  return await fetchCoursesFromDB();
}, [], {
  revalidate: 600, // Cache duration in seconds
});
