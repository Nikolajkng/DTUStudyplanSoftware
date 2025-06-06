import { useDraggable } from "@dnd-kit/core";
import { courseTypeColors, CourseWithSem } from "./CourseTypes";
import { getCourseDragId } from "./CourseTypes";

// Function to determine the color based on course type
const courseColor = ({ course_type }: { course_type: string }) => {
    return courseTypeColors.get(course_type) || "bg-slate-600";
};

// The draggable course component
const DraggableCourse = ({ course }: { course: CourseWithSem }) => {
    const draggableId = getCourseDragId(course); // composite key id

    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: draggableId,
    });

    const style = transform
        ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
        : undefined;

    const courseTypeClass = courseColor({ course_type: course.course_type });

    const isHardSplit = courseTypeClass === "hard-split";

    // controls the "course-box"
    const ectsNum = Number(course.ects);
    const isWholeNumber = Number.isInteger(ectsNum);

    // Fix: Prevents breaking text by inserting a hyphen before all course name with "programmering".
    function insertSoftHyphens(text: string) {
        // Smarter patterns to insert soft hyphens before/inside important keywords
        const patterns = [
            { regex: /(\w+?)(programmering)/gi },
            { regex: /(\w+?)(konstruktion(er)?)/gi },
            { regex: /(\w+?)(projekt(er|styring|ledelse)?)/gi },
            { regex: /(data)(\w+)/gi },
            { regex: /(\w+?)(netværk|netværksopsamling)/gi },
        ];

        let newText = text;
        for (const { regex } of patterns) {
            newText = newText.replace(regex, (...args) => {
                const match = args[0];
                const groups = args.slice(1, -2); // Get all groups
                if (groups.length >= 2) {
                    return `${groups[0]}\u00AD${groups[1]}`;
                }
                return match;
            });
        }
        return newText;
    }

    return (
        <div
            className={`relative w-80 min-h-15 m-1 text-white 
                        flex flex-col sm:flex-row sm:items-center sm:justify-between 
                        p-2 rounded-2xl overflow-hidden ${isHardSplit ? "" : courseTypeClass}`}
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
        >
            {/* Edge-case for 02100 Indledende programmering og softwareteknologi */}
            {isHardSplit && (
                <div className="absolute inset-0 flex">
                    <div className="w-1/2 h-full bg-green-500" />
                    <div className="w-1/2 h-full bg-blue-400" />
                </div>
            )}
            {/* Course ID display */}
            <div className="relative z-10 font-medium whitespace-nowrap">
                {course.course_id === "00000" || course.course_id === "00001" || course.course_id === "00002" ? (
                    <div className="font-bold">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                ) : (
                    <div className="font-bold">{course.course_id}</div>
                )}
            </div>
            {/* Course name display */}
            <div
                className="relative z-10 w-full h-full flex-1 p-3 flex items-center justify-center 
                            text-center leading-tight break-words hyphens-auto" lang="da">

                <strong>{insertSoftHyphens(course.course_name)}</strong>
            </div>
            {/* ECTS display */}
            <div className="relative z-10 font-medium whitespace-nowrap">
                <strong> {isWholeNumber ? ectsNum : ectsNum.toFixed(1)} ECTS</strong>
            </div>
        </div>
    );
};

export default DraggableCourse;