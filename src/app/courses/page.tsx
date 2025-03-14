'use client';
// src/app/courses/page.tsx
import { useEffect, useState } from 'react';

interface Course {
  course_id: string;
  course_name: string;
  ects: number;
  course_type: string;
}

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch data from the API route you created
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/courses');
        const data: Course[] = await response.json();
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Courses</h1>
      <ul>
        {courses.map((course) => (
          <li key={course.course_id}>
            {course.course_name} - {course.course_id} - {course.ects} ECTS - {course.course_type}
          </li>
        ))}
      </ul>
    </div>
  );
}
