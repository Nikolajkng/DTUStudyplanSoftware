"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import Cookies from "js-cookie";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { cachedFetchCourses, Course } from "../../db/fetchCourses";
import { CourseWithSem, CoursePlacement } from "./components/CourseTypes";
import DraggableCourse from "./components/DraggableCourse";
import GridCourse from "./components/grid/GridCourse";
import GridFiller from "./components/grid/GridFiller";
import { ExportStudyPlanAsJSON } from "./components/buttons/ExportStudyPlanAsJSON";


export default function MyStudyPlan() {
    const [placements, setPlacements] = useState<CoursePlacement[]>([]);
    const [savedPlans, setSavedPlans] = useState<{
        [key: string]: { placements: CoursePlacement[]; semesters: number };
    }>(() => {
        const savedPlansCookie = Cookies.get("savedStudyPlans");
        if (savedPlansCookie) {
            try {
                return JSON.parse(savedPlansCookie);
            } catch (error) {
                console.error("Error parsing saved plans from cookies during initialization:", error);
            }
        }
        return {}; // Default to an empty object if no cookie is found
    });
    const [selectedPlan, setSelectedPlan] = useState<string>("");
    const [courses, setCourses] = useState<CourseWithSem[]>([]);
    const [semesters, setSemesters] = useState(7);
    const [selectedCourseType, setSelectedCourseType] = useState<string>("");

    // Fetch the courses from the database 
    useEffect(() => {
        cachedFetchCourses().then((data) => {
            setCourses(data);
        })
    }, []);

    // save the studyplan in cookies
    useEffect(() => {
        Cookies.set("savedStudyPlans", JSON.stringify(savedPlans), {
            expires: 365 * 100, // Expires in 100 years
            path: "/", // Make the cookie accessible across all pages
        });
    }, [savedPlans]);

    const saveStudyPlan = () => {
        const planName = prompt("Angiv et navn til studieforløbet:");
        if (planName) {
            setSavedPlans((prevPlans) => ({
                ...prevPlans,
                [planName]: { placements, semesters, },
            }));
            alert(`Studieforløb "${planName}" gemt!`);
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
            setSemesters(plan.semesters || 7);
        }
        setSelectedPlan(planName);
    };

  

    // Function to upload a study plan from a JSON file
    // The file should contain an array of course placements
    // The function parses the file and updates the state with the new placements
    const uploadStudyPlanAsJSON = async (file: File) => {
        const reader = new FileReader();
        reader.onload = async (event) => {
            const fileContent = event.target?.result;
            if (typeof fileContent === "string") {
                try {
                    const parsedData = JSON.parse(fileContent);

                    // Ensure the parsed data contains placements and semesters
                    if (!Array.isArray(parsedData.placements) || typeof parsedData.semesters !== "number") {
                        throw new Error("Invalid file format. Expected an object with placements and semesters.");
                    }

                    const { placements, semesters } = parsedData;

                    // Prompt the user for a name for the uploaded plan
                    const planName = prompt("Angiv et navn til studieforløbet:");
                    if (!planName) {
                        alert("Angiv venligst et navn for at uploade studieforløb.");
                        return;
                    }

                    // Save the uploaded plan to the savedPlans state
                    setSavedPlans((prevPlans) => {
                        const updatedPlans = {
                            ...prevPlans,
                            [planName]: { placements, semesters },
                        };
                        Cookies.set("savedStudyPlans", JSON.stringify(updatedPlans), { expires: 365 * 100 }); // Save to cookies
                        return updatedPlans;
                    });

                    // Set the uploaded plan as the currently selected plan
                    setPlacements(placements);
                    setSemesters(semesters);
                    setSelectedPlan(planName);

                    alert(`Studieforløb "${planName}" uploaded og valgt succesfuldt!`);
                } catch (error) {
                    console.error("Error parsing file:", error);
                    alert("Fejl ved indhentning af studieforløb, venligst sørg for at filen er JSON.");
                }
            }
        };
        reader.readAsText(file);
    };

    // Function to export the current study plan as a PDF
    // The function captures the grid as a canvas and converts it to a PDF
    const exportSutdyPlanAsPDF = async () => {
        const gridElement = document.querySelector(".grid"); // Select the grid element
        if (!gridElement) {
            alert("Grid element not found!");
            return;
        }

        try {
            // Capture the grid as a canvas
            const canvas = await html2canvas(gridElement as HTMLElement, {
                scale: 2, // Increase resolution
                useCORS: true, // Handle cross-origin images
            });

            // Convert the canvas to an image
            const imgData = canvas.toDataURL("image/png");

            // Create a PDF document
            const pdf = new jsPDF("landscape", "mm", "a4");
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            // Add the image to the PDF
            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

            const planName = prompt("Angiv et navn til studieforløbet:");
            if (!planName) {
                alert("Angiv venligst et navn for at gemme studieforløb.");
                return;
            }

            // Save the PDF
            pdf.save(planName + ".pdf");
        } catch (error) {
            console.error("Error exporting grid as PDF:", error);
            alert("Der opstod en fejl under eksporten af studieforløbet.");
        }
    };

    // Adds another row in the course grid, representing a semester
    const addAnotherSemester = () => {
        if (semesters >= 10) return;
        setSemesters((prev) => prev + 1);
        console.log(semesters);
    };

    // removes a row from the course grid
    const removeOneSemester = () => {
        if (semesters <= 7) return;
        setSemesters((prev) => prev - 1);
        console.log(semesters);
    };

    // Function for determining the courses not currently in the course grid (study plan)
    // Used by the "tilgængelige kurser"
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
        <>
            <Head>
                <title>DTU Software Technology</title>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="icon" type="image/png" href="/assets/icons/favicon-32x32.png" />
            </Head>

            <div className="flex flex-col min-h-screen items-center">
                <h1 className="text-4xl font-bold mt-10">DTU Software Teknologi Studieforløb</h1>

                <DndContext
                    onDragEnd={(e) => {
                        if (!e.over) {
                            setPlacements((prev) =>
                                prev.filter((placement) => placement.course.course_id !== e.active.id));
                            return;
                        }
                        const [x, y] = e.over.id.toString().split("-").map(Number);
                        const course = courses.find((c) => c.course_id === e.active.id);
                        if (!course) return;
                        const scaledEcts = course.ects / 2.5;

                        // Check border on right side (the end of semester)
                        if (x + scaledEcts > 7 * 2 || (course.sem || 1 && y + (course.sem || 1) > semesters)) {
                            return;
                        }


                        setPlacements((prev) => [
                            ...prev.filter((c) => c.course.course_id !== course.course_id),
                            { x: x + 1, y: y + 1, course },

                        ]);
                    }}
                >
                    <div className="flex justify-center mt-10 ">
                        <div className="flex justify-center mt-10">
                            <div className="m-10">
                                <h2 className="text-2xl font-semibold mb-4">{selectedPlan || "Nyt studieforløb"}</h2>
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
                                        onClick={addAnotherSemester}
                                        className="px-4 py-2 bg-red-700 text-white rounded hover:bg-gray-800 mr-2"
                                    >
                                        Tilføj semester
                                    </button>

                                    <button
                                        onClick={removeOneSemester}
                                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-800 mr-2"
                                    >
                                        Fjern semester
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (confirm("Er du sikker på, at du vil rydde studieforløbet? (Dette vil fjerne alle kurser fra deres placeringer og placere dem tilbage i listen)")) {
                                                setPlacements([]);
                                            }
                                        }}
                                        className=" px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-800"
                                    >
                                        Ryd studieforløb
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


                                <div className="overflow-y-scroll overflow-x-visible mb-20 p-3 h-170">
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
                        Vælg studieforløb:
                    </label>
                    <select
                        id="savedPlans"
                        value={selectedPlan}
                        onChange={(e) => loadStudyPlan(e.target.value)}
                        className="px-4 py-2 border rounded"
                    >
                        <option value="">Vælg et forløb</option>
                        {Object.keys(savedPlans).map((planName) => (
                            <option key={planName} value={planName}>
                                {planName}
                            </option>
                        ))}
                    </select>
                </div >

                {/* Save Button */}
                < div className="flex space-x-3 mt-6" >
                    <button
                        onClick={saveStudyPlan}
                        className="px-4 py-2 bg-red-700 text-white rounded hover:bg-gray-800"
                    >
                        Gem nuværende studieforløb
                    </button>
                    <button
                        onClick={deleteStudyPlan}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-800"
                    >
                        Slet nuværende studieforløb
                    </button>
                    <ExportStudyPlanAsJSON/>
                </div>
                <div className="flex space-x-3 mt-6">
                    <input
                        type="file"
                        id="fileInput"
                        style={{ display: "none" }}
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                uploadStudyPlanAsJSON(file);
                            }
                        }}
                    />
                    <button
                        onClick={() => document.getElementById("fileInput")?.click()}
                        className="px-4 py-2 bg-blue-400 text-white rounded hover:bg-gray-800"
                    >
                        Upload Studieforløb (importér JSON fil)
                    </button>
                    <button
                        onClick={exportSutdyPlanAsPDF}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
                    >
                        Eksportér Studieforløb som PDF
                    </button>
                </div >

            </div >
        </>
    );
}
