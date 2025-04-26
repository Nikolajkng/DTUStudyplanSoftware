import { Course } from "@/db/fetchCourses";

export type CourseWithSem = Course & {
    sem?: number;
};

export type CoursePlacement = {
    x: number;
    y: number;
    course: CourseWithSem;
};


export const courseTypeColors = new Map<string, string>([
    ["Polyteknisk grundlag", "bg-green-500"],
    ["Projekter", "bg-red-500"],
    ["Retningsspecifikke kurser", "bg-blue-400"],
    ["Valgfrie kurser", "bg-yellow-500"],
    ["Polyteknisk grundlag & Retningsspecifikke kurser", "hard-split"],

]);


export const getCourseDragId = (course: Course | CourseWithSem) =>
    `${course.course_id}-${course.course_name}`;
