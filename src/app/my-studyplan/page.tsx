"use client";

import React, { useState } from "react";
import {
    DndContext,
    DragEndEvent,
    closestCenter,
    useDraggable,
    useDroppable,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import "../styles/grid.css";
import "../styles/courses.css";

export default function MyStudyPlan() {
    type Course = {
        id: number;
        name: string;
        ects: number;
        gridIndex?: number;
    };


    const initialCourses: Course[] = [
        { id: 1, name: "Machine Learning", ects: 5 },
        { id: 2, name: "Matematik 1", ects: 20 },
        { id: 3, name: "Parallel", ects: 5 },
        { id: 4, name: "Funktions", ects: 5 },
        { id: 5, name: "Softwareteknologi", ects: 10 },
        { id: 6, name: "Datasikkerhed", ects: 7.5 },
        { id: 7, name: "Systemudvikling", ects: 5 },
        { id: 8, name: "Teknologi", ects: 5 },
        { id: 9, name: "Programmering", ects: 5 },
        { id: 10, name: "Fysik", ects: 5 },
    ];

    const [courses, setCourses] = useState(initialCourses);
    const [usedCourses, setUsedCourses] = useState<Course[]>([]);

    function DraggableItem({ course }: { course: Course }) {
        const { attributes, listeners, setNodeRef, transform } = useDraggable({
            id: course.id.toString(),
        });

        const dragStyle = {
            transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
        };

        return (
            <div
                className="course"
                ref={setNodeRef}
                {...attributes}
                {...listeners}
                style={dragStyle}
            >
                {course.name}
            </div>
        );
    }
    // Calculate scale factor based on ECTS
    const getScaleFromEcts = (ects: number) => {
        const scaleMapping = {
            5: 1,
            10: 1.2,
            15: 1,
            20: 1.5,
        };
        return scaleMapping[ects as keyof typeof scaleMapping] || 1; 
    };
    function GridCellDropZone({ id }: { id: number }) {
        const { setNodeRef, isOver } = useDroppable({ id: id.toString() });

        const courseInCell = usedCourses.find((course) => course.gridIndex === id);

        // If the course is dropped, apply a scaling transformation

        const dropStyle = courseInCell
            ? {
                transform: `scale(${getScaleFromEcts(courseInCell.ects)})`,
                transition: "transform 0.3s"
            }
            : {};

        return (
            <div
                ref={setNodeRef}
                className={`grid_cell ${isOver ? "highlight" : ""}`}
            >
                {courseInCell && (
                    <div style={dropStyle}>
                        <DraggableItem course={courseInCell} />
                    </div>
                )}
            </div>
        );
    }
    function AvailableCoursesDropZone() {
        const { setNodeRef, isOver } = useDroppable({ id: "available-courses" });

        return (
            <div ref={setNodeRef} className={`courses_window ${isOver ? "highlight" : ""}`}>
                <div className="courses_layout">
                    {courses.map((course) => (
                        <DraggableItem key={course.id} course={course} />
                    ))}
                </div>
            </div>
        );
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (!over) return;

        const courseID = Number(active.id);
        const dropZoneID = over.id.toString();

        // If dropped back into available courses
        if (dropZoneID === "available-courses") {
            setUsedCourses((prev) => prev.filter((course) => course.id !== courseID));
            const returningCourse = usedCourses.find((course) => course.id === courseID);
            if (returningCourse) {
                setCourses((prev) => [...prev, returningCourse]);
            }
            return;
        }

        // Check if course is already in the grid
        const movingCourse = usedCourses.find((course) => course.id === courseID);
        const targetIndex = Number(dropZoneID);
        const existingCourse = usedCourses.find((course) => course.gridIndex === targetIndex);

        if (movingCourse) {
            // Move within the grid (swap positions if needed)
            setUsedCourses((prev) =>
                prev.map((course) => {
                    if (course.id === courseID) {
                        return { ...course, gridIndex: targetIndex };
                    }
                    if (existingCourse && course.id === existingCourse.id) {
                        return { ...course, gridIndex: movingCourse.gridIndex };
                    }
                    return course;
                })
            );
        } else {
            // Move from available courses to grid
            const droppedCourse = courses.find((course) => course.id === courseID);
            if (droppedCourse) {
                setUsedCourses((prev) => [...prev, { ...droppedCourse, gridIndex: targetIndex }]);
                setCourses((prev) => prev.filter((course) => course.id !== courseID));
            }
        }
    }

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex justify-center items-center h-screen gap-20">
                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <div>
                        <h2>
                            <strong>My Study Plan</strong>
                        </h2>
                        <SortableContext items={usedCourses.map((item) => item.id.toString())} strategy={verticalListSortingStrategy}>
                            <div className="grid_window">
                                <div className="grid_layout">
                                    {Array.from({ length: 6 * 6 }).map((_, index) => (
                                        <GridCellDropZone key={index} id={index} />
                                    ))}
                                </div>
                            </div>
                        </SortableContext>
                    </div>

                    <div>
                        <h1>
                            <strong>Available courses</strong>
                        </h1>
                        <AvailableCoursesDropZone />
                    </div>
                </DndContext>
            </div>
        </div>
    );
}
