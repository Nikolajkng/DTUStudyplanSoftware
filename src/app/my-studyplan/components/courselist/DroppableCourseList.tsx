// components/DroppableCourseList.tsx
import { useDroppable } from "@dnd-kit/core";
import { ReactNode } from "react";

const DroppableCourseList = ({ children }: { children: ReactNode }) => {
    const { setNodeRef, isOver } = useDroppable({
        id: "course-list",
    });

    return (
        <div
            ref={setNodeRef}
            className={`overflow-y-scroll overflow-x-hidden relative w-86 p-2 h-170 transition-all rounded-xl border-gray-500
                        ${isOver ? "bg-blue-100 border-2 border-blue-500" : "bg-white border"
                        
                        }
                `}
        >
            {children}
        </div>
    );
};

export default DroppableCourseList;
