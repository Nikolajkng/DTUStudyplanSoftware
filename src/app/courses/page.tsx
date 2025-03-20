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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/courses');
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        const data: Course[] = await response.json();
        setCourses(data);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Group courses by course_type
  const groupedCourses = courses.reduce((acc, course) => {
    if (!acc[course.course_type]) {
      acc[course.course_type] = [];
    }
    acc[course.course_type].push(course);
    return acc;
  }, {} as Record<string, Course[]>);

  return (
    <div>
      <h1>Courses</h1>
      {Object.entries(groupedCourses).map(([courseType, courses]) => (
        <div key={courseType} className="mb-8">
          <h2 className="text-xl font-bold mb-4">{courseType}</h2>
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Course ID</th>
                <th className="border border-gray-300 px-4 py-2">Course Name</th>
                <th className="border border-gray-300 px-4 py-2">ECTS</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.course_id}>
                  <td className="border border-gray-300 px-4 py-2">{course.course_id}</td>
                  <td className="border border-gray-300 px-4 py-2">{course.course_name}</td>
                  <td className="border border-gray-300 px-4 py-2">{course.ects}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
