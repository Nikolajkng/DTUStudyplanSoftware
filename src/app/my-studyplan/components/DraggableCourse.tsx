import { useDraggable } from "@dnd-kit/core";
import { courseTypeColors, CourseWithSem } from "./CourseTypes";
import { getCourseDragId } from "../page";


// Function to determine the color based on course type
const courseColor = ({ course_type }: { course_type: string }) => {
    return courseTypeColors.get(course_type) || "bg-slate-600";
}

// The draggable course component
const DraggableCourse = ({ course }: { course: CourseWithSem }) => {
    const draggableId = getCourseDragId(course); // composite key id
    
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: draggableId,
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
            <div className="w-full h-full flex items-center justify-center leading-tight break-words text-center" lang="da">
                <strong>{course.course_name}</strong>
            </div>
            <div className="font-medium whitespace-nowrap">
            <strong> {isWholeNumber ? ectsNum : ectsNum.toFixed(1)} ects</strong>
            </div>
        </div>
    );
};
export default DraggableCourse;