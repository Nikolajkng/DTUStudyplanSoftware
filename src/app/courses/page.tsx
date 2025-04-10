'use client';

// src/app/courses/page.tsx
import { useEffect, useState } from 'react';
import { cachedFetchCourses, Course } from '../api/courses/route';



export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch courses from the API
  // This function will be called when the component mounts
  useEffect(() => {

    cachedFetchCourses().then((fetchedCourses) => {
      setCourses(fetchedCourses);
      setLoading(false);
    })
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
                <th className="border border-gray-300 px-4 py-2">KursusID</th>
                <th className="border border-gray-300 px-4 py-2">Kursusnavn</th>
                <th className="border border-gray-300 px-4 py-2">Kursustype</th>
                <th className="border border-gray-300 px-4 py-2">ECTS</th>
                <th className="border border-gray-300 px-4 py-2">Placering</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.course_id}>
                  <td className="border border-gray-300 px-4 py-2">{course.course_id}</td>
                  <td className="border border-gray-300 px-4 py-2">{course.course_name}</td>
                  <td className="border border-gray-300 px-4 py-2">{course.course_type}</td>
                  <td className="border border-gray-300 px-4 py-2">{course.ects}</td>
                  <td className="border border-gray-300 px-4 py-2">{course.placement}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
