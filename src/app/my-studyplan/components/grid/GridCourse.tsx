import { useDraggable } from "@dnd-kit/core";
import { courseTypeColors, CoursePlacement } from "../CourseTypes";
import { getCourseDragId } from "../CourseTypes";

// Function to determine the color based on course type
const courseColor = ({ course_type }: { course_type: string }) => {
    return courseTypeColors.get(course_type) || "bg-slate-600";
}

// The grid showing the studyplan
const GridCourse = ({ placement }: { placement: CoursePlacement }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: getCourseDragId(placement.course),
    });

    const scaledEcts = placement.course.ects / 2.5; // Scale the ECTS to fit the grid

    const style = transform
        ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
        : undefined;

    return (
        <div
            className={`${courseColor({ course_type: placement.course.course_type })} text-white flex justify-center items-center z-10`}
            style={{
                width: "99%", // Fill the grid cell
                height: "100%", // Fill the grid cell
                gridColumnStart: placement.x,
                gridColumnEnd: placement.x + scaledEcts,
                gridRowStart: placement.y,
                gridRowEnd: placement.y + (placement.course.sem || 1),
                ...style,
            }}
            ref={setNodeRef}
            {...attributes}
            {...listeners}
        >
            <strong className="w-full h-full flex items-center justify-center text-sm leading-tight break-words text-center">{
                placement.course.course_name}
            </strong>
        </div>
    );
};
export default GridCourse;