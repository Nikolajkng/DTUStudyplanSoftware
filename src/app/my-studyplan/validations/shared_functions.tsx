import { CoursePlacement, CourseWithSem } from "../components/courselist/CourseTypes";

export const getScheduleValue = (row: number, col: number): string[] => {
    const is3Weeks = row > 12;
    const evenSem = (col + 1) % 2 === 0;

    if (is3Weeks) {
        return evenSem
            ? ["juni", "juli", "august", "Juni", "Juli", "August"]
            : ["januar", "Januar"];
    } else {
        return evenSem
            ? ["F", "forår", "Forår"]
            : ["E", "efterår", "Efterår"];
    }
}



// Function to check for overlap
export const checkForOverlap = (
    courseWidth: number,
    courseHeight: number,
    courseX: number,
    courseY: number,
    excludeCourseId?: string,
    placements: CoursePlacement[] = [],):
    boolean => {

    // Get cells the course would occupy
    const targetCells = new Set<string>();
    for (let dx = 0; dx < courseWidth; dx++) {
        for (let dy = 0; dy < courseHeight; dy++) {
            targetCells.add(`${courseX + dx}-${courseY + dy}`);
        }
    }

    // Check for overlap
    const hasOverlap = placements.some((p) => {
        if (excludeCourseId && p.course.course_id === excludeCourseId) {
            return false;
        }

        const px = p.x;
        const py = p.y;
        const pw = p.course.ects / 2.5;
        const ph = p.course.sem || 1;

        for (let dx = 0; dx < pw; dx++) {
            for (let dy = 0; dy < ph; dy++) {
                if (targetCells.has(`${px + dx}-${py + dy}`)) {
                    return true;
                }
            }
        }
        return false;
    });

    return hasOverlap;
};


// Check for project courses
export const checkLargeProjectCourses = (hx: number, hy: number, activeCourse: CourseWithSem): boolean => {
    const isLargeProjectCourse = activeCourse.course_type.includes("Projekt") && activeCourse.ects >= 10;

    // Bachelorprojekt can be taken in any semester

    const _13Weeks = hx <= 10;
    const _span3weeks = hx >= 11;
    const _evenSem = ((hy-1) % 2 === 0);

    switch (activeCourse.course_id) {
        case "00000": // Bachelorprojekt 15 ECTS
            return _13Weeks;
        case "00001": // Bachelorprojekt 17.5 ECTS
            return _13Weeks;
        case "00002": // Bachelorprojekt 20 ECTS - allowed to span 3 weeks
            return true;
        case "02122": // Fagprojekt 10 ECTS
            return _span3weeks && _evenSem;
        default:
            break;
    }

    return true;
};