'use server';

import pool from '../db/mariaDB_connection';
import { unstable_cache } from 'next/cache';

export interface Course {
  course_id: string;
  course_name: string;
  course_type: string;
  ects: number;
  placement: string;
}

const fetchCoursesFromDB = async (): Promise<Course[]> => {
  console.log('Fetching data from the database...');
  const connection = await pool.getConnection();
  try {
    const rows = await connection.query('SELECT * FROM Courses') as Course[];
    return rows;
  } finally {
    connection.release();
  }
};

export const cachedFetchCourses = unstable_cache(fetchCoursesFromDB, [], {
  revalidate: 600,
});
