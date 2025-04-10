'use client';

import Head from "next/head";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { Course } from "../api/courses/route";
import { useState } from "react";

const predefinedCourses = ["Generalitet", "Algoritmik", "Billedanalyse", "Datasikkerhed", "Kunstig intelligens", "Softwareudvikling"]



type CourseWithSem = Course & {
    sem?: number;
};

export type CoursePlacement = {
    x: number;
    y: number;
    course: CourseWithSem;
};


const courseTypeColors = new Map<string, string>([
    ["Polyteknisk grundlag", "bg-green-500"],
    ["Projekter", "bg-red-500"],
    ["Retningsspecifikke kurser", "bg-blue-400"],
    ["Valgfrie kurser", "bg-yellow-500"],
]);



// Function to determine the color based on course type
// Used in the course grid and the course list
const courseColor = ({ course_type }: { course_type: string }) => {
    return courseTypeColors.get(course_type) || "bg-slate-600";
}



const GridCourse = ({ placement }: { placement: CoursePlacement }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: placement.course.course_id,
    });

    const scaledEcts = placement.course.ects / 2.5; // Scale the ECTS to fit the grid

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


export default function RecommendedStudyPlan() {

    const [placements, setPlacements] = useState<CoursePlacement[]>([]);
    const [savedPlans, setSavedPlans] = useState<{
        [key: string]: { placements: CoursePlacement[]; semesters: number };
    }>({});
    const [semesters, setSemesters] = useState(7);
    const [courses, setCourses] = useState<CourseWithSem[]>([]);
    const [selectedCourseType, setSelectedCourseType] = useState<string>("");
    const [selectedPlan, setSelectedPlan] = useState<string>("");

    const loadStudyPlan = (planName: string) => {
        const fetchPlan = async (planName: string) => {
            const response = await fetch(`/courses/${planName}.json`);
            if (!response.ok) {
                throw new Error(`Failed to fetch plan: ${planName}`);
            }
            return response.json();
        };

        fetchPlan(planName)
            .then((plan) => {
                setPlacements(plan.placements || []);
                setSemesters(plan.semesters || 7);
            })
            .catch((error) => {
                console.error("Error loading plan:", error);
            });
        setSelectedPlan(planName);
    };

    const GridFiller = ({ x, y }: { x: number; y: number }) => {
        const { setNodeRef } = useDroppable({ id: `${x + 1}-${y}` });
        const borderStyling = x % 2 == 0 ? "border-r-4" : "";

        return (
            <div
                className={`bg-gray-300 border-white ${borderStyling}`}
                style={{
                    width: "100%", // Fill the grid cell
                    height: "100%", // Fill the grid cell
                    gridRowStart: y + 1,
                    gridColumnStart: x + 2,
                }}
                ref={setNodeRef}
            />
        );
    };

    const exportStudyPlanAsJSON = () => {
        const planName = selectedPlan
        if (planName) {
            // Include both placements and semesters in the exported JSON
            const studyPlanData = {
                placements,
                semesters,
            };

            const blob = new Blob([JSON.stringify(studyPlanData)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            console.log("created temporary download url: " + url);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${planName}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } else {
            alert("Du kan ikke kopiere et tomt studieforløb");
        }
    };

    const notUsedCourses = courses.filter(
        (c) => !placements.some((p) => p.course.course_id === c.course_id)
    );

    const baseCoords = Array.from({ length: 14 })
        .map((_, x) =>
            Array.from({ length: semesters }).map((_, y) => [x, y] as [number, number])
        )
        .flat();

    const filteredCourses = notUsedCourses.filter(
        (c) => !selectedCourseType || c.course_type === selectedCourseType
    );


    return (


        <div className="flex flex-col min-h-screen">

            {/* Main Body Content */}
            <>
                <Head>
                    <title>DTU Software Technology</title>
                    <meta charSet="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <link rel="icon" type="image/png" href="/assets/icons/favicon-32x32.png" />
                </Head>

                <div className="flex flex-col min-h-screen items-center">
                    <h1 className="text-4xl font-bold mt-10">DTU Software Teknologi Studieforløb</h1>
                    <div className="flex justify-center mt-10 ">
                        <div className="flex justify-center mt-10">
                            <div className="m-10">
                                <h2 className="text-2xl font-semibold mb-4">{selectedPlan || ""}</h2>
                                <div
                                    className={`grid grid-rows-${semesters} grid-cols-14 gap-y-1 border border-gray-400 p-2`}
                                    style={{
                                        width: "1100px",
                                        height: `${semesters}00px`,
                                        gridTemplateColumns: "repeat(14, 1fr)",
                                        gridTemplateRows: `repeat(${semesters}, 1fr)`,
                                    }}
                                >
                                    {baseCoords.map(([x, y]) => (
                                        <GridFiller key={`${x}-${y}`} x={x + 1} y={y + 1} />
                                    ))}
                                    {placements.map((p) => (
                                        <GridCourse key={p.course.course_id} placement={p} />
                                    ))}

                                    <div
                                        className="flex items-center justify-center bg-gray-200 text-black font-semibold"
                                        style={{
                                            gridRowStart: 1,
                                            gridColumnStart: 1,
                                            gridColumnEnd: 3,
                                        }}
                                    ><strong>Semester</strong>
                                    </div>

                                    <div
                                        className="flex items-center justify-center bg-gray-200 text-black font-semibold"
                                        style={{
                                            gridRowStart: 1,
                                            gridColumnStart: 3,
                                            gridColumnEnd: 14,
                                        }}
                                    >
                                        13-ugers periode (25 ects)
                                    </div>
                                    <div
                                        className="flex items-center p-2 justify-center bg-gray-200 text-black font-semibold"
                                        style={{
                                            gridRowStart: 1,
                                            gridColumnStart: 13,
                                            gridColumnEnd: 15,
                                        }}
                                    >
                                        3-ugers periode (5 ects)
                                    </div>

                                    {Array.from({ length: semesters - 1 }).map((_, y) => (
                                        <div
                                            key={`row-label-${y}`}
                                            className="flex items-center justify-center bg-gray-200 text-black font-semibold"
                                            style={{
                                                gridRowStart: y + 2,
                                                gridColumnStart: 1,
                                                gridColumnEnd: 3,
                                            }}
                                        >
                                            {y + 1}
                                        </div>
                                    ))}

                                </div>
                                <div className=" justify-between border border-gray-400 p-2" >
                                    <button
                                    onClick={exportStudyPlanAsJSON}
                                        className="px-4 py-2 bg-red-700 text-white rounded hover:bg-gray-800 mr-2"
                                    >
                                        Kopiér studieforløb
                                    </button>
                                </div>

                            </div>
                            <div className="m-10 flex flex-col">
                                <h2 className="text-2xl font-semibold mb-4">Anbefalede studieforløb</h2>
                                {predefinedCourses.map((course, index) => (
                                    <button
                                        key={index}
                                        className="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-slate-500"
                                        onClick={() => loadStudyPlan(course)}
                                    >
                                        {course}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>



                </div >


            </>

        </div>

    );
}
