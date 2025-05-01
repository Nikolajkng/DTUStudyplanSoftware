// components/DroppableCourseList.tsx
import { useDroppable } from "@dnd-kit/core";
import { ReactNode } from "react";

const DroppableCourseList = ({ children }: { children: ReactNode }) => {
    const { setNodeRef, isOver } = useDroppable({
        id: "course-list",
    });

    return (
        <div>
            {/* Course List containing all courses */}
            <div
                ref={setNodeRef}
                className={`overflow-y-scroll overflow-x-hidden relative w-86 p-2 h-147 transition-all flex flex-col items-center justify-start
                            border border-gray-400 rounded-lg
                            ${isOver ? "bg-blue-100 border-2 border-blue-500" : "bg-white border"}
                        `}
            >
                {children}
            </div>
            {/* Buttons box*/}
            <div className="w-86 h-14 flex flex-rows justify-around items-center border border-gray-400 rounded-lg">
                <button
                    className="px-3 py-2 bg-red-700 text-white rounded hover:bg-gray-800"
                    onClick={() => alert("Create custom course")}
                >
                    <strong>Opret eget kursus</strong>
                </button>
                <button
                    className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-800"
                    onClick={() => alert("Delete custom course")}
                >
                    <strong>Fjern egne kurser</strong>
                </button>
            </div>
        </div>
    );
};

export default DroppableCourseList;
