'use client';

// src/app/courses/page.tsx
import { useEffect, useState } from 'react';
import { cachedFetchCourses, Course } from "../../db/fetchCourses";
import CourseID from './components/CourseID';
import CourseName from './components/CourseName';
import ECTS from './components/ECTS';
import Placement from './components/Placement';


const threadColor = (courseType: string) => {

  switch (courseType) {
    case 'Polyteknisk grundlag':
      return 'bg-red-500'
    case 'Projekter':
      return 'bg-green-500'
    case 'Retningsspecifikke kurser':
      return 'bg-blue-400'
    case 'Valgfrie kurser':
      return 'bg-yellow-400'
    default: return 'bg-grey-500'
  }
}

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch courses from the API
  // This function will be called when the component mounts
  useEffect(() => {

    cachedFetchCourses().then((fetchedCourses) => {
      setCourses(fetchedCourses);
      setLoading(false);
    })
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div>
      </div>
    );
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4 text-center">Kursusoversigt</h1>
      {Object.entries(groupedCourses).map(([courseType, courses]) => (
        <div key={courseType} className="mb-8">
          <h2 className="text-xl font-bold mb-4">{courseType}</h2>
          <table className="min-w-full border-collapse border border-gray-300">

            <thead className={`${threadColor(courseType)} text-white`}>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Kursusnummer</th>
                <th className="border border-gray-300 px-4 py-2">Kursusnavn</th>
                <th className="border border-gray-300 px-4 py-2">ECTS</th>
                <th className="border border-gray-300 px-4 py-2">Placering</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c.course_id}>
                  <CourseID courseID ={c.course_id}></CourseID>
                  <CourseName courseName={c.course_name}></CourseName>
                  <ECTS ects={c.ects}></ECTS>
                  <Placement placement={c.placement}></Placement>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
