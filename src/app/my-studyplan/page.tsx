"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import Cookies from "js-cookie";

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

// Function to determine the color based on course type
const courseColor = ({ course_type }: { course_type: string }) => {
    switch (course_type) {
        case "Naturvidenskabelig grundfag":
            return "bg-green-500";
        case "Projekter og almene fag":
            return "bg-red-700";
        case "Teknologisk linjefag":
            return "bg-blue-700";
        case "Valgfri fag":
            return "bg-yellow-600";
        default:
            return "bg-slate-600";
    }
};

// Controls the look of the "dragable" courses in the course list
const DraggableCourse = ({ course }: { course: Course }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: course.course_id,
    });

    const style = transform
        ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
        : undefined;

    return (
        <div
            className={`w-140 h-16 ${courseColor({ course_type: course.course_type })} m-1 text-white flex justify-center items-center cursor-pointer white-space: normal overflow-visible z-50 text-`}
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
        >
            <p className="mr-10">{course.course_name}</p>
            <p>{course.ects} ects</p>
        </div>
    );
};

// fill the grid with grey boxes
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

// The grid showing the studyplan
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
            className={`${courseColor({ course_type: placement.course.course_type })} text-white flex justify-center items-center z-10`}
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
    const [savedPlans, setSavedPlans] = useState<{
        [key: string]: { placements: CoursePlacement[]; semesters: number };
    }>({});
    const [selectedPlan, setSelectedPlan] = useState<string>("");
    const [courses, setCourses] = useState<Course[]>([]);
    const [semesters, setSemesters] = useState(6);
    const [selectedCourseType, setSelectedCourseType] = useState<string>("");

    // Fetch the courses from the database 
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

    // save the studyplan in cookies
    useEffect(() => {
        Cookies.set("savedStudyPlans", JSON.stringify(savedPlans), { expires: 365 * 100 }); // Expires in 100 years
    }, [savedPlans]);

    const saveStudyPlan = () => {
        const planName = prompt("Enter a name for your study plan:");
        if (planName) {
            setSavedPlans((prevPlans) => ({
                ...prevPlans,
                [planName]: { placements, semesters, },
            }));
            alert(`Study plan "${planName}" saved!`);
        }
    };

    // Delete selected studyplan from the cookies and returns to "default" selected study plan
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
        const plan = savedPlans[planName];
        if (plan) {
            setPlacements(plan.placements || []);
            setSemesters(plan.semesters || 6);
        }
        setSelectedPlan(planName);
    };

    // Adds another row in the course grid, representing a semester
    const addAnotherSemester = () => {
        if (semesters >= 10) return;
        setSemesters((prev) => prev + 1);
        console.log(semesters);
    };

    // removes a row from the course grid
    const removeOneSemester = () => {
        if (semesters <= 6) return;
        setSemesters((prev) => prev - 1);
        console.log(semesters);
    };

    // Function for determining the courses not currently in the course grid (study plan)
    // Used by the "tilgængelige kurser"
    const notUsedCourses = courses.filter(
        (c) => !placements.some((p) => p.course.course_id === c.course_id)
    );

    const baseCoords = Array.from({ length: 7 })
        .map((_, x) =>
            Array.from({ length: semesters }).map((_, y) => [x, y] as [number, number])
        )
        .flat();

    const filteredCourses = notUsedCourses.filter(
        (c) => !selectedCourseType || c.course_type === selectedCourseType
    );

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
                    <div className="flex justify-center mt-10 h-screen">
                        <div className="flex justify-center mt-10">
                            <div className="m-10">
                                <h2 className="text-2xl font-semibold mb-4">{selectedPlan || "Ny Studieplan"}</h2>
                                <div
                                    className={`grid grid-rows-${semesters} grid-cols-7 gap-1 border border-gray-400 p-2`}
                                    style={{
                                        width: "1100px", // Fixed width for the grid
                                        height: `${semesters}00px`, // Fixed height for the grid
                                        gridTemplateColumns: "repeat(7, 1fr)", // 7 equal columns
                                        gridTemplateRows: `repeat(${semesters}, 1fr)`, // 6 equal rows
                                    }}
                                >
                                    {baseCoords.map(([x, y]) => (
                                        <GridFiller key={`${x}-${y}`} x={x} y={y} />
                                    ))}
                                    {placements.map((p) => (
                                        <GridCourse key={p.course.course_id} placement={p} />
                                    ))}
                                    <button
                                        onClick={addAnotherSemester}
                                        className="px-4 py-2 bg-red-700 text-white rounded hover:bg-gray-800"
                                    >
                                        Tilføj semester
                                    </button>

                                    <button
                                        onClick={removeOneSemester}
                                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-800"
                                    >
                                        Fjern semester
                                    </button>
                                </div>
                            </div>

                            <div className="m-10 flex flex-col">
                                <h2 className="text-2xl font-semibold mb-4">Tilgængelige kurser</h2>
                                <div className="mb-4">
                                    <label htmlFor="courseType" className="mr-2 font-semibold">
                                        Vælg kursustype:
                                    </label>
                                    <select
                                        id="courseType"
                                        value={selectedCourseType}
                                        onChange={(e) => setSelectedCourseType(e.target.value)}
                                        className="px-4 py-4 border rounded"
                                    >
                                        <option value=""> Alle Kurser </option>
                                        {[...new Set(courses.map((c) => c.course_type))].map((type) =>
                                            <option key={type} value={type}>
                                                {type}
                                            </option>)}
                                    </select>
                                </div>


                                <div className="overflow-y-scroll overflow-x-visible mb-20 p-3">
                                    {filteredCourses.map((c) => (
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
                        className="px-4 py-2 bg-red-700 text-white rounded hover:bg-gray-800"
                    >
                        Gem nuværende studieplan
                    </button>
                    <button
                        onClick={deleteStudyPlan}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-800"
                    >
                        Slet nuværende studieplan
                    </button>
                </div >

            </div >
        </>
    );
}
