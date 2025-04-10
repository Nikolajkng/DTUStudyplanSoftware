import { NextResponse } from 'next/server';
import { cachedFetchCourses } from '@/db/fetchCourses'; 

export async function GET() {
  const courses = await cachedFetchCourses();
  return NextResponse.json(courses);
}

