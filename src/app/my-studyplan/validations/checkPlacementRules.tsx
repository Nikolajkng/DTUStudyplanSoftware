import { CoursePlacement, CourseWithSem } from "../components/courselist/CourseTypes";
import { checkForOverlap, checkLargeProjectCourses, getScheduleValue } from "./shared_functions";


export const checkPlacementRules = (
    x: number,
    y: number,
    course: CourseWithSem,
    courseX: number,
    courseY: number,
    courseWidth: number,
    courseHeight: number,
    semesters: number,
    placements: CoursePlacement[],
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
    let correctSchedule = true;
    for (let dx = 0; dx < courseWidth; dx++) {
        for (let dy = 0; dy < courseHeight; dy++) {
            const scheduleKeys = getScheduleValue(courseX + dx, courseY + dy);
            const matchFound = scheduleKeys.some((s) => course.placement.includes(s));
            if (!matchFound) {
                correctSchedule = false;
                break;
            }
        }
        if (!correctSchedule) break;
    }


    // Checks for overlap
    const hasOverlap = checkForOverlap(courseWidth, courseHeight, courseX, courseY, course.course_id, placements);
    const hasOverlapWithGridTitles = (x < 2) || (y == 0);

    // Check for large project course
    const largeProjectHasCorrectWeekSpan = checkLargeProjectCourses(courseX, courseY, course);



    // Return true on valid rules:
    return (
        inBound &&
        correctSchedule &&
        !hasOverlap &&
        !hasOverlapWithGridTitles &&
        largeProjectHasCorrectWeekSpan
    );
}