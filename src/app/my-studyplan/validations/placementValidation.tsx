import { CourseWithSem } from "../components/CourseTypes";
import { checkForOverlap, checkLargeProjectCourses, getScheduleValue } from "./helper_functions";


export const checkPlacementRules = (
    x: number,
    y: number,
    course: CourseWithSem,
    courseX: number,
    courseY: number,
    courseWidth: number,
    courseHeight: number,
    semesters: number,
): boolean => {

    // Fysik should fill out two courses
    if (course.course_id === "10060" || course.course_name === "Fysik") {
        course.sem = 2;
        course.ects = 5;
    }

    // Check for out of bounds:
    const courseXwithWidth = courseX + courseWidth - 1;
    const courseYwithHeight = courseY + courseHeight - 1;
    const inBound = courseXwithWidth <= 14 && courseYwithHeight <= semesters;


    // Check for schedule placement of course
    const checkScheduleResult = getScheduleValue(courseXwithWidth, courseY).map((s) => (course.placement.includes(s)));
    const correctSchedule = checkScheduleResult.some(foundMatch => foundMatch);

    // Checks for overlap
    const hasOverlap = checkForOverlap(courseWidth, courseHeight, courseX, courseY, course.course_id);
    const hasOverlapWithGridTitles = (x < 2) || (y == 0);

    // Check for large project course
    const largeProjectHasCorrectWeekSpan = checkLargeProjectCourses(courseX, courseY, course);

    return (
        inBound &&
        correctSchedule &&
        !hasOverlap &&
        !hasOverlapWithGridTitles &&
        largeProjectHasCorrectWeekSpan
    );
}