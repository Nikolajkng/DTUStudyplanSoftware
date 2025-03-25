"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import Cookies from "js-cookie";

type Course = {
    name: string;
    ects: number;
    sem?: number;
};

const courses: Course[] = [
    { name: "Mat1", ects: 2, sem: 2 },
    { name: "Mat2", ects: 1 },
    { name: "Parallel", ects: 1 },
];

type CoursePlacement = {
    x: number;
    y: number;
    course: Course;
};

const DraggableCourse = ({ course }: { course: Course }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: course.name,
    });

    const style = transform
        ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
        : undefined;

    return (
        <div
            className="w-32 h-16 bg-slate-600 m-1 text-white flex justify-center items-center cursor-pointer"
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
        >
            <p>{course.name}</p>
        </div>
    );
};

const GridFiller = ({ x, y }: { x: number; y: number }) => {
    const { setNodeRef } = useDroppable({ id: `${x}-${y}` });

    return (
        <div
            className="bg-gray-300 w-32 h-16 m-1"
            style={{ gridRowStart: y + 1, gridColumnStart: x + 1 }}
            ref={setNodeRef}
        />
    );
};

const GridCourse = ({ placement }: { placement: CoursePlacement }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: placement.course.name,
    });

    const style = transform
        ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
        : undefined;

    return (
        <div
            className="bg-blue-800 text-white flex justify-center items-center z-10"
            style={{
                gridColumnStart: placement.x,
                gridColumnEnd: placement.x + placement.course.ects,
                gridRowStart: placement.y,
                gridRowEnd: placement.y + (placement.course.sem || 1),
                ...style,
            }}
            ref={setNodeRef}
            {...attributes}
            {...listeners}
        >
            {placement.course.name}
        </div>
    );
};

export default function MyStudyPlan() {
    const [placements, setPlacements] = useState<CoursePlacement[]>([]);
    const [savedPlans, setSavedPlans] = useState<{ [key: string]: CoursePlacement[] }>({});
    const [selectedPlan, setSelectedPlan] = useState<string>("");

    // Load saved plans from cookies when the component mounts
    useEffect(() => {
        const savedPlansCookie = Cookies.get("savedStudyPlans");
        if (savedPlansCookie) {
            setSavedPlans(JSON.parse(savedPlansCookie));
        }
    }, []);

    // Save all study plans to cookies whenever they change
    useEffect(() => {
        Cookies.set("savedStudyPlans", JSON.stringify(savedPlans), { expires: 7 }); // Expires in 7 days
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

        const { [selectedPlan]: _, ...restPlans } = savedPlans;
        setSavedPlans(restPlans);
        setPlacements([]);
        setSelectedPlan("");
    };

    const loadStudyPlan = (planName: string) => {
        setPlacements(savedPlans[planName] || []);
        setSelectedPlan(planName);
    };

    const notUsedCourses = courses.filter(
        (c) => !placements.find((p) => p.course.name === c.name)
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
                        const course = courses.find((c) => c.name === e.active.id);
                        if (!course) return;

                        if (x + course.ects > 7 || (course.sem && y + course.sem > 6)) {
                            return;
                        }

                        setPlacements((prev) => [
                            ...prev.filter((c) => c.course.name !== e.active.id),
                            { x: x + 1, y: y + 1, course },
                        ]);
                    }}
                >
                    <div className="flex flex-wrap justify-center mt-10">
                        <div className="m-10">
                            <h2 className="text-2xl font-semibold mb-4">Placements</h2>
                            <div className="grid grid-rows-6 grid-cols-7 gap-1 border border-gray-400 p-2">
                                {baseCoords.map(([x, y]) => (
                                    <GridFiller key={`${x}-${y}`} x={x} y={y} />
                                ))}
                                {placements.map((p) => (
                                    <GridCourse key={p.course.name} placement={p} />
                                ))}
                            </div>
                        </div>

                        <div className="m-10">
                            <h2 className="text-2xl font-semibold mb-4">Available Courses</h2>
                            <div className="flex flex-wrap">
                                {notUsedCourses.map((c) => (
                                    <DraggableCourse key={c.name} course={c} />
                                ))}
                            </div>
                        </div>
                    </div>
                </DndContext>

                {/* Dropdown Menu for Saved Plans */}
                <div className="mt-6">
                    <label htmlFor="savedPlans" className="mr-2 font-semibold">
                        Load Study Plan:
                    </label>
                    <select
                        id="savedPlans"
                        value={selectedPlan}
                        onChange={(e) => loadStudyPlan(e.target.value)}
                        className="px-4 py-2 border rounded"
                    >
                        <option value="">Select a plan</option>
                        {Object.keys(savedPlans).map((planName) => (
                            <option key={planName} value={planName}>
                                {planName}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Save Button */}
                <button
                    onClick={saveStudyPlan}
                    className="mt-6 px-4 py-2 bg-red-700 text-white rounded hover:bg-blue-700"
                >
                    Save Study Plan
                </button>
                <button
                    onClick={deleteStudyPlan}
                    className="mt-6 px-4 py-2 bg-red-700 text-white rounded hover:bg-blue-700"
                >
                    Delete currently selected Study Plan
                </button>
            </div>
        </>
    );
}
