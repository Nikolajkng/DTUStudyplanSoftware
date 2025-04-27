import { CourseWithSem } from "../components/courselist/CourseTypes";
import { checkForOverlap, checkLargeProjectCourses } from "./helper_functions";

export const checkPlacementHighlightRules = (
    activeCourse: CourseWithSem,
    hx: number,
    hy: number,
    courseWidth: number,
    courseHeight: number,
    schedule: string[],
    semesters: number) => {

    const hasOverlap = checkForOverlap(courseWidth, courseHeight, hx, hy, activeCourse.course_id);
    const isOutOfBounds = hx + courseWidth - 1 > 14 || hy + courseHeight - 1 > semesters;
    const hasOverlapWithGridTitles = hx < 3 || hy === 0;
    const checkScheduleResult = schedule.map((s) => (activeCourse.placement.includes(s)));
    const correctSchedule = checkScheduleResult.some(foundMatch => foundMatch);

    const projectHasCorrectWeekSpan = checkLargeProjectCourses(hx, hy, activeCourse);
    return (hasOverlap ||
        isOutOfBounds ||
        hasOverlapWithGridTitles ||
        !correctSchedule ||
        (!projectHasCorrectWeekSpan))
}

