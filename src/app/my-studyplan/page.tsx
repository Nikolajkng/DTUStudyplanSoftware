"use client";

import Head from "next/head";
import { DndContext } from "@dnd-kit/core";
import DraggableCourse from "./components/DraggableCourse";
import GridCourse from "./components/grid/GridCourse";
import GridFiller from "./components/grid/GridFiller";
import { useStudyPlan } from "./components/hooks/useStudyPlan";

// Button & Eventhandlers
import { ExportAsJsonBtn } from "./components/handlers/ExportAsJsonBtn";
import { UploadAsJsonBtn } from "./components/handlers/UploadJsonBtn";
import ExportAsPdf from "./components/handlers/ExportAsPdfBtn";
import SaveBtn from "./components/handlers/SaveBtn";
import DeleteBtn from "./components/handlers/DeleteBtn";

export default function MyStudyPlan() {

    // Load all hooks and states from hooks/useStudyPlan
    const {
        placements, setPlacements,
        savedPlans, setSavedPlans,
        selectedPlan, setSelectedPlan,
        courses, setCourses,
        semesters, setSemesters,
        selectedCourseType, setSelectedCourseType, }
        = useStudyPlan();



    const loadStudyPlan = (planName: string) => {
        const plan = savedPlans[planName];
        if (plan) {
            setPlacements(plan.placements || []);
            setSemesters(plan.semesters || 7);
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

                {/* Buttons for saving, deleting, and exporting study plans */}
                < div className="flex space-x-3 mt-6" >
                    <SaveBtn />
                    <DeleteBtn />
                    <ExportAsJsonBtn />
                </div>
                <div className="flex space-x-3 mt-6">
                    <UploadAsJsonBtn />
                    <ExportAsPdf />
                </div >

            </div >
        </>
    );
}
