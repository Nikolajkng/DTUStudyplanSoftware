'use client';

import Head from "next/head";
import { useState } from "react";
import { Course } from "../../db/fetchCourses";
import GridCourse from "../my-studyplan/components/grid/GridCourse";
import GridFiller from "../my-studyplan/components/grid/GridFiller";

type CourseWithSem = Course & {
    sem?: number;
};

export type CoursePlacement = {
    x: number;
    y: number;
    course: CourseWithSem;
};

const predefinedCourses = [
    "Overordnet",
    "Generalitet",
    "Algoritmik",
    "Billedanalyse",
    "Datasikkerhed",
    "Kunstig intelligens",
    "Softwareudvikling"
];

export default function RecommendedStudyPlan() {
    const [placements, setPlacements] = useState<CoursePlacement[]>([]);
    const [semesters, setSemesters] = useState(7);
    const [selectedPlan, setSelectedPlan] = useState<string>("");

    const loadStudyPlan = (planName: string) => {
        const fetchPlan = async (planName: string) => {
            const response = await fetch(`/predefined_courses/${planName}.json`);
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

    const baseCoords = Array.from({ length: 14 })
        .map((_, x) =>
            Array.from({ length: semesters }).map((_, y) => [x, y] as [number, number])
        )
        .flat();

    return (
        <div className="flex flex-col min-h-screen">
            <Head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="icon" type="image/png" href="/assets/icons/favicon-32x32.png" />
            </Head>

            <div className="flex flex-col min-h-screen items-center">
                <h1 className="text-4xl font-bold mt-10">Anbefalede studieforløb</h1>
                <div className="flex justify-center">
                    <div className="flex justify-center ">
                        <div className="flex flex-row m-10">
                            <div className="flex flex-col">
                                <h2 className="text-2xl font-semibold mb-4">{selectedPlan || ""}</h2>
                                <div
                                    className={`grid grid-rows-${semesters} grid-cols-14 gap-y-1 border border-gray-400 p-2`}
                                    style={{
                                        width: "1200px",
                                        height: `${semesters}00px`,
                                        gridTemplateColumns: "repeat(14, 1fr)",
                                        gridTemplateRows: `repeat(${semesters}, 1fr)`,
                                        overflowX: "auto",
                                    }}
                                >
                                    {baseCoords.map(([x, y]) => (
                                        <GridFiller key={`${x}-${y}`} x={x + 1} y={y + 1} />
                                    ))}
                                    {placements.map((p) => (
                                        <GridCourse key={`${p.course.course_id}-${p.course.course_name}`} placement={p} />
                                    ))}

                                    <div
                                        className="flex items-center justify-center bg-gray-200 text-black font-semibold"
                                        style={{
                                            gridRowStart: 1,
                                            gridColumnStart: 1,
                                            gridColumnEnd: 3,
                                        }}
                                    >
                                        <strong>Semester</strong>
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
                                        jan/jun/aug (5 ects)
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
                            </div>
                            <div className="ml-20 flex flex-col">
                                <h2 className="text-2xl font-semibold mb-4">Forløbseksempler</h2>
                                {predefinedCourses.map((course, index) => (
                                    <button
                                        key={index}
                                        className="w-60 h-15 bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-slate-500"
                                        onClick={() => loadStudyPlan(course)}
                                    >
                                        <strong>{course}</strong>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
