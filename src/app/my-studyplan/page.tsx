"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import Cookies from "js-cookie";
import "./style.css";

interface Course {
    course_id: string;
    course_name: string;
    ects: number;
    course_type: string;
    sem: 1;
};


type CoursePlacement = {
    x: number;
    y: number;
    course: Course;
};

const DraggableCourse = ({ course }: { course: Course }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: course.course_id,
    });

    const style = transform
        ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
        : undefined;

    return (
        <div
            className="w-32 h-16 bg-slate-600 m-1 text-white flex justify-center items-center cursor-pointer white-space: normal"
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
        >
            <p>{course.course_name}</p>
        </div>
    );
};

const GridFiller = ({ x, y }: { x: number; y: number }) => {
    const { setNodeRef } = useDroppable({ id: `${x}-${y}` });

    return (
        <div
            className="bg-gray-300"
            style={{
                width: "100%", // Fill the grid cell
                height: "100%", // Fill the grid cell
                gridRowStart: y + 1,
                gridColumnStart: x + 1,
            }}
            ref={setNodeRef}
        />
    );
};

const GridCourse = ({ placement }: { placement: CoursePlacement }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: placement.course.course_id,
    });

    const scaledEcts = placement.course.ects / 5;

    const style = transform
        ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
        : undefined;

    return (
        <div
            className="bg-blue-800 text-white flex justify-center items-center z-10"
            style={{
                width: "100%", // Fill the grid cell
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
            {placement.course.course_name}
        </div>
    );
};

export default function MyStudyPlan() {
    const [placements, setPlacements] = useState<CoursePlacement[]>([]);
    const [savedPlans, setSavedPlans] = useState<{ [key: string]: CoursePlacement[] }>({});
    const [selectedPlan, setSelectedPlan] = useState<string>("");
    const [courses, setCourses] = useState<Course[]>([]);


    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch("/api/courses");
                if (!response.ok) {
                    throw new Error("Failed to fetch courses");
                }
                const data: Course[] = await response.json();
                setCourses(data);
            } catch (err) {
                console.error("Error fetching courses:", err);
            }
        };

        fetchCourses();
    }, []);

    // Load saved plans from cookies when the component mounts
    useEffect(() => {
        const savedPlansCookie = Cookies.get("savedStudyPlans");
        if (savedPlansCookie) {
            setSavedPlans(JSON.parse(savedPlansCookie));
        }
    }, []);

    // Save all study plans to cookies whenever they change
    useEffect(() => {
        Cookies.set("savedStudyPlans", JSON.stringify(savedPlans), { expires: 365 * 100 }); // Expires in 100 years
    }, [savedPlans]);

    const saveStudyPlan = () => {
        const planName = prompt("Enter a name for your study plan:");
        if (planName) {
            setSavedPlans((prevPlans) => ({
                ...prevPlans,
                [planName]: placements,
            }));
            alert(`Study plan "${planName}" saved!`);
        }
    };

    const deleteStudyPlan = () => {
        if (!selectedPlan) return;

        const restPlans = Object.fromEntries(
            Object.entries(savedPlans).filter(([key]) => key !== selectedPlan)
        );
        setSavedPlans(restPlans);
        setPlacements([]);
        setSelectedPlan("");
    };

    const loadStudyPlan = (planName: string) => {
        setPlacements(savedPlans[planName] || []);
        setSelectedPlan(planName);
    };

    const notUsedCourses = courses.filter(
        (c) => !placements.some((p) => p.course.course_id === c.course_id)
    );

    const baseCoords = Array.from({ length: 7 })
        .map((_, x) =>
            Array.from({ length: 6 }).map((_, y) => [x, y] as [number, number])
        )
        .flat();

    return (
        <>
            <Head>
                <title>DTU Software Technology</title>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="icon" type="image/png" href="/assets/icons/favicon-32x32.png" />
            </Head>

            <div className="flex flex-col min-h-screen items-center">
                <h1 className="text-4xl font-bold mt-10">DTU Software Technology Study Plan</h1>

                <DndContext
                    onDragEnd={(e) => {
                        if (!e.over) return;

                        const [x, y] = e.over.id.toString().split("-").map(Number);
                        const course = courses.find((c) => c.course_id === e.active.id);
                        if (!course) return;

                        const scaledEcts = course.ects / 5;

                        if (x + scaledEcts > 7 || (course.sem && y + course.sem > 6)) {
                            return;
                        }


                        setPlacements((prev) => [
                            ...prev.filter((c) => c.course.course_id !== course.course_id),
                            { x: x + 1, y: y + 1, course },
                        ]);
                    }}
                >
                    <div className="flex justify-center mt-10">
                        <div className="flex flex-wrap justify-center mt-10">
                            <div className="m-10">
                                <h2 className="text-2xl font-semibold mb-4">{selectedPlan || "Studieplan"}</h2>
                                <div
                                    className="grid grid-rows-6 grid-cols-7 gap-1 border border-gray-400 p-2"
                                    style={{
                                        width: "1100px", // Fixed width for the grid
                                        height: "600px", // Fixed height for the grid
                                        gridTemplateColumns: "repeat(7, 1fr)", // 7 equal columns
                                        gridTemplateRows: "repeat(6, 1fr)", // 6 equal rows
                                    }}
                                >
                                    {baseCoords.map(([x, y]) => (
                                        <GridFiller key={`${x}-${y}`} x={x} y={y} />
                                    ))}
                                    {placements.map((p) => (
                                        <GridCourse key={p.course.course_id} placement={p} />
                                    ))}
                                </div>
                            </div>


                            <div className="m-10 courseList"
                                >
                                <h2 className="text-2xl font-semibold mb-4">Tilgængelige kurser</h2>
                                <div className="flex flex-wrap">
                                    {notUsedCourses.map((c) => (
                                        <DraggableCourse key={c.course_id} course={c} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </DndContext >

                {/* Dropdown Menu for Saved Plans */}
                < div className="mt-6" >
                    <label htmlFor="savedPlans" className="mr-2 font-semibold">
                        Vælg studieplan:
                    </label>
                    <select
                        id="savedPlans"
                        value={selectedPlan}
                        onChange={(e) => loadStudyPlan(e.target.value)}
                        className="px-4 py-2 border rounded"
                    >
                        <option value="">Vælg en plan</option>
                        {Object.keys(savedPlans).map((planName) => (
                            <option key={planName} value={planName}>
                                {planName}
                            </option>
                        ))}
                    </select>
                </div >

                {/* Save Button */}
                < div className="flex space-x-4 mt-6" >
                    <button
                        onClick={saveStudyPlan}
                        className="px-4 py-2 bg-red-700 text-white rounded hover:bg-blue-700"
                    >
                        Save Study Plan
                    </button>
                    <button
                        onClick={deleteStudyPlan}
                        className="px-4 py-2 bg-red-700 text-white rounded hover:bg-blue-700"
                    >
                        Delete currently selected Study Plan
                    </button>
                </div >

            </div >
        </>
    );
}
