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
            return false; // skip checking against itself
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
    if (activeCourse.course_name.includes("Bachelorprojekt") && isLargeProjectCourse) {
        // Bachelorprojekt must be taken in 6th semester or later
        return (hy >= 7) && (hx >= 9);
    } else if (activeCourse.course_name.includes("Fagprojekt") && isLargeProjectCourse) {
        // Fagprojekt must be taken in 4th semester
        return (hx >= 11 && hy === 5);
    }
    return true;
};