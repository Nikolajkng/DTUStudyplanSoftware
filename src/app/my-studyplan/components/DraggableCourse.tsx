import { useDraggable } from "@dnd-kit/core";
import { courseTypeColors, CourseWithSem } from "./CourseTypes";


// Function to determine the color based on course type
const courseColor = ({ course_type }: { course_type: string }) => {
    return courseTypeColors.get(course_type) || "bg-slate-600";
}

const DraggableCourse = ({ course }: { course: CourseWithSem }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: course.course_id,
    });

    const style = transform
        ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
        : undefined;

    // controls the "course-box"
    const ectsNum = Number(course.ects)
    const isWholeNumber = Number.isInteger(ectsNum)

    return (
        <div
            className={`w-120 min-h-16 ${courseColor({ course_type: course.course_type })} m-1 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 rounded-2xl`}
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
        >

            <div className="font-medium whitespace-nowrap">
                {course.course_id == '00000' ?
                    // &nbsp = White-space, to fill out the gap
                    <div className="font-bold">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                    : <div className="font-bold">{course.course_id}</div>}
            </div>
            <div
                className="text-sm sm:text-base break-words hyphens-auto max-w-full sm:max-w-[60%] text-left"
                lang="da"
            >
                <strong>{course.course_name}</strong>
            </div>
            <div className="font-medium whitespace-nowrap">
                {isWholeNumber ? ectsNum : ectsNum.toFixed(1)} ects
            </div>
        </div>
    );
};
export default DraggableCourse;