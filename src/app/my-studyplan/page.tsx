"use client";

import Head from "next/head";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from "@dnd-kit/core";
import { useState } from "react";
import DraggableCourse from "./components/DraggableCourse";
import GridCourse from "./components/grid/GridCourse";
import GridFiller from "./components/grid/GridFiller";
import { useStudyPlan } from "./components/hooks/useStudyPlan";

// Button & Eventhandlers
import { ExportAsJsonBtn } from "./components/btn_handlers/ExportAsJsonBtn";
import { UploadAsJsonBtn } from "./components/btn_handlers/UploadJsonBtn";
import ExportAsPdf from "./components/btn_handlers/ExportAsPdfBtn";
import SaveBtn from "./components/btn_handlers/SaveBtn";
import DeleteBtn from "./components/btn_handlers/DeleteBtn";
import AddSemesterBtn from "./components/btn_handlers/AddSemesterBtn";
import RemoveSemesterBtn from "./components/btn_handlers/RemoveSemesterBtn";
import ClearBtn from "./components/btn_handlers/ClearBtn";
import { StudyPlanProvider } from "./components/hooks/useStudyPlan";
import { Course } from "@/db/fetchCourses";
import DroppableCourseList from "./components/DroppableCourseList";
import { getCourseDragId } from "./components/CourseTypes";




function StudyPlanContent() {

    // Load all hooks and states from hooks/useStudyPlan
    const {
        placements, setPlacements,
        savedPlans,
        selectedPlan, setSelectedPlan,
        courses,
        semesters, setSemesters,
        selectedCourseType, setSelectedCourseType }
        = useStudyPlan();

    const [activeCourse, setActiveCourse] = useState<Course | null>(null);

    const loadStudyPlan = (planName: string) => {
        const plan = savedPlans[planName];
        if (plan) {
            setPlacements(plan.placements || []);
            setSemesters(plan.semesters || 7);
        }
        setSelectedPlan(planName);
    };

    const handleDragStart = (event: DragStartEvent) => {
        const course = courses.find((c) => getCourseDragId(c) === event.active.id);
        setActiveCourse(course || null);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const course = courses.find((c) => getCourseDragId(c) === event.active.id);
        if (!course) return;

        // Case 1: Dropped in the course list
        if (event.over?.id === "course-list") {
            setPlacements((prev) =>
                prev.filter((p) => p.course.course_id !== course.course_id)
            );
        }

        // Case 2: Dropped in the grid
        if (event.over) {
            const [x, y] = event.over.id.toString().split("-").map(Number);
            const scaledEcts = course.ects / 2.5;

            if (x + scaledEcts <= 14 && y + (course.sem || 1) <= semesters) {
                setPlacements((prev) => [
                    ...prev.filter(
                        (p) =>
                            !(
                                p.course.course_id === course.course_id &&
                                p.course.course_name === course.course_name
                            )
                    ),
                    { x: x + 1, y: y + 1, course },
                ]);
            }
        }

        setActiveCourse(null); // Clear the active course after dragging
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

    return (<>

        <Head>
            <title>DTU Software Technology</title>
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link rel="icon" type="image/png" href="/assets/icons/favicon-32x32.png" />
        </Head>

        <div className="flex flex-col min-h-screen items-center">
            <h1 className="text-4xl font-bold mt-10">DTU Software Teknologi Studieforløb</h1>

            <DndContext
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="flex justify-center mt-10 ">
                    <div className="flex justify-center mt-10">
                        <div className="m-10">
                            <h2 className="text-2xl font-semibold mb-4">{selectedPlan || "Nyt studieforløb"}</h2>
                            <div
                                className={`grid grid-rows-${semesters} grid-cols-14 gap-y-1 border border-gray-400 p-2`}
                                style={{
                                    width: "1200px",
                                    height: `${semesters}00px`,
                                    gridTemplateColumns: "repeat(14, 1fr)",
                                    gridTemplateRows: `repeat(${semesters}, 1fr)`,
                                }}
                            >
                                {baseCoords.map(([x, y]) => (
                                    <GridFiller key={`${x}-${y}`} x={x + 1} y={y + 1} />
                                ))}
                                {placements.map((p) => {
                                    const isBeingDragged = activeCourse?.course_id === p.course.course_id;
                                    return (
                                        <GridCourse
                                            key={p.course.course_id}
                                            placement={p}
                                            style={isBeingDragged ? { visibility: "hidden" } : {}}
                                        />
                                    );
                                })}


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
                                    13-ugers periode <br></br> (25 ects)
                                </div>
                                <div
                                    className="flex items-center p-2 justify-center bg-gray-200 text-black font-semibold"
                                    style={{
                                        gridRowStart: 1,
                                        gridColumnStart: 13,
                                        gridColumnEnd: 15,
                                    }}
                                >
                                    jan/jun/aug <br></br> (5 ects)
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
                                <AddSemesterBtn />
                                <RemoveSemesterBtn />
                                <ClearBtn />
                            </div>
                            <p>
                                <strong>*OBS: </strong>
                                Værktøjet er tiltænkt som et <u>vejledende</u> værktøj, der kan hjælpe med at skabe overblik over din studieplan,
                                som bachelorstuderende i Softwareteknologi.
                                <br />
                                Det er derfor vigtigt at få bekræftet din studieplan hos&nbsp;
                                <a href="https://www.dtu.dk/uddannelse/vejledning/studievejledningen" className="text-blue-500 underline">DTU Studievejledning</a>
                                &nbsp; eller hos studielederen for Software Bachelor,&nbsp;
                                <a href="/contact" className="text-blue-500 underline">Carsten Witt</a>.
                                <br />
                                For detaljeret og opdateret information om kurser og studieforløb henvises der til&nbsp;
                                <a href="https://kurser.dtu.dk/search" className="text-blue-500 underline">DTU&apos;s studieplanlægger</a>.
                                <br />
                            </p>
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
                            <DroppableCourseList>
                                {filteredCourses.map((c) => (
                                    <DraggableCourse key={getCourseDragId(c)} course={c} />
                                ))}
                            </DroppableCourseList>
                        </div>
                    </div>
                </div>

                <DragOverlay>
                    {activeCourse ? (
                        <DraggableCourse course={activeCourse} />
                    ) : null}
                </DragOverlay>
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

export default function MyStudyPlan() {
    return (
        <StudyPlanProvider>
            <StudyPlanContent />
        </StudyPlanProvider>
    );
}
