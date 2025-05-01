"use client";

import Head from "next/head";
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent } from "@dnd-kit/core";
import { useMemo, useState } from "react";
import DraggableCourse from "./components/courselist/DraggableCourseItem";
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
import DroppableCourseList from "./components/courselist/DroppableCourseList";
import { CourseWithSem, getCourseDragId } from "./components/courselist/CourseTypes";
import { checkValidPlacementRules } from "./validations/checkValidPlacementRules";
import { getScheduleValue } from "./validations/shared_functions";
import { highlightPlacement_onDragOver } from "./validations/highlightPlacement_onDragOver";
import { highlightPlacement_onDragStart } from "./validations/highlightPlacement_onDragStart";
import Filter from "./components/courselist/Filter";
import SearchField from "./components/courselist/SearchField";

function StudyPlanContent() {
    // Load all hooks and states from hooks/useStudyPlan
    const {
        placements, setPlacements,
        savedPlans,
        selectedPlan, setSelectedPlan,
        courses,
        semesters, setSemesters,
        selectedCourseType,
        hoveredCell, setHoveredCell,
        searchQuery,
        validGridCells, setValidGridCells, }
        = useStudyPlan();

    const [activeCourse, setActiveCourse] = useState<CourseWithSem | null>(null);


    const baseCoords = useMemo(() => {
        return Array.from({ length: 14 })
            .map((_, x) =>
                Array.from({ length: semesters }).map((_, y) => ({
                    x: x + 1,
                    y: y + 1,
                    schedule: getScheduleValue(x + 1, y + 1),
                }))
            )
            .flat();
    }, [semesters]);

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

        if (course) {
            const validCells = baseCoords.filter(({ x, y }) => {
                const courseWidth = course.ects / 2.5;
                const courseHeight = course.sem || 1;
                const highlightX = (x - courseWidth) + 1;
                const highlightY = y;

                return highlightPlacement_onDragStart(x, y, course, highlightX, highlightY, courseWidth, courseHeight, semesters, placements);
            });

            setValidGridCells(validCells);
        }
    };

    const handleDragOver = (event: DragOverEvent) => {
        if (!event.over || !activeCourse) {
            setHoveredCell(null);
            return;
        }

        const [x, y] = event.over.id.toString().split("-").map(Number);
        setHoveredCell([x + 1, y + 1]);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const course = courses.find((c) => getCourseDragId(c) === event.active.id);
        if (!course) return;

        // Case 1: Dropped in the course list
        if (event.over?.id === "course-list") {
            setPlacements((prev) =>
                prev.filter(
                    (p) => getCourseDragId(p.course) !== getCourseDragId(course)
                )
            );
        }

        // Case 2: Dropped in the grid
        if (event.over) {
            const [x, y] = event.over.id.toString().split("-").map(Number);

            // Positions and size of gridcell
            const courseX = x + 1;
            const courseY = y + 1;
            const courseWidth = course.ects / 2.5;;
            const courseHeight = course.sem || 1;

            const validPlacement = checkValidPlacementRules(x, y, course, courseX, courseY, courseWidth, courseHeight, semesters, placements)
            if (validPlacement) {
                setPlacements((prev) => [
                    ...prev.filter((p) => getCourseDragId(p.course) !== getCourseDragId(course)),
                    { x: courseX, y: courseY, course },
                ]);
            }
        }

        setValidGridCells([]);
        setActiveCourse(null);
        setHoveredCell(null);
    };



    // Function for determining the courses not currently in the course grid (study plan)
    // Used by the "tilgængelige kurser"
    const notUsedCourses = courses.filter(
        (c) => !placements.some((p) => getCourseDragId(p.course) === getCourseDragId(c))
    );

    const filteredCourses = notUsedCourses.filter((c) => {
        const courseTypeMatch = (() => {
            if (!selectedCourseType) return true;
            if (c.course_type === "Polyteknisk grundlag & Retningsspecifikke kurser") {
                return selectedCourseType === "Polyteknisk grundlag" || selectedCourseType === "Retningsspecifikke kurser";
            }
            return c.course_type === selectedCourseType;
        })();

        // Check search field (course_id or course_name)
        const searchFieldMatch = (() => {
            if (!searchQuery) return true;
            return (
                c.course_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.course_name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        })();

        return courseTypeMatch && searchFieldMatch;
    });


    return (<>
        <div className="flex flex-col min-h-screen items-center">
            <Head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="icon" type="image/png" href="/assets/icons/favicon-32x32.png" />
            </Head>
            <h1 className="text-4xl font-bold mt-10">Mine studieforløb</h1>

            <DndContext
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div className="w-full overflow-x-auto">
                    <div className="flex mt-5 justify-around">
                        <div className="flex flex-row">
                            {/* ######################### Grid for the study plan ######################### */}
                            <div className="m-10">
                                <h2 className="text-2xl font-semibold mb-4">{selectedPlan || "Nyt studieforløb"}</h2>
                                <div
                                    className={`grid grid-rows-${semesters} grid-cols-14 gap-y-1 border border-gray-400 p-2 rounded`}
                                    style={{
                                        width: "1200px",
                                        height: `${semesters}00px`,
                                        gridTemplateColumns: "repeat(14, minmax(0, 1fr))",
                                        gridTemplateRows: `repeat(${semesters}, 1fr)`,
                                    }}
                                >
                                    {baseCoords.map(({ x, y, schedule }) => {
                                        let highlight: "valid" | "invalid" | null = null;

                                        // Highlight valid cells on drag start
                                        if (validGridCells.some((cell) => cell.x === x && cell.y === y)) {
                                            highlight = "valid";
                                        }

                                        // Highlight valid cell on hover
                                        if (hoveredCell && activeCourse) {
                                            const [hx, hy] = hoveredCell;
                                            const courseWidth = activeCourse.ects / 2.5;
                                            const courseHeight = activeCourse.sem || 1;

                                            const isInRange =
                                                x >= hx &&
                                                x < hx + courseWidth &&
                                                y >= hy &&
                                                y < hy + courseHeight;

                                            if (isInRange) {
                                                highlight = highlightPlacement_onDragOver(activeCourse, hx, hy, courseWidth, courseHeight, schedule, semesters, placements)
                                                    ? "invalid"
                                                    : "valid";
                                            }
                                        }

                                        return <GridFiller key={`${x}-${y}`} x={x} y={y} highlight={highlight} />;
                                    })}

                                    {placements.map((p) => {
                                        const isBeingDragged = activeCourse && getCourseDragId(activeCourse) === getCourseDragId(p.course);
                                        return (
                                            <GridCourse
                                                key={p.course.course_id}
                                                style={isBeingDragged ? { visibility: "hidden" } : {}}
                                                placement={p}
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
                                        13-ugers periode <br></br> (25 ECTS)
                                    </div>
                                    <div
                                        className="flex items-center p-2 justify-center bg-gray-200 text-black font-semibold"
                                        style={{
                                            gridRowStart: 1,
                                            gridColumnStart: 13,
                                            gridColumnEnd: 15,
                                        }}
                                    >
                                        jan/jun/aug <br></br> (5 ECTS)
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
                                <div className="flex justify-between items-center border border-gray-400 p-2 rounded">
                                    <div className="flex space-x-3">
                                        <AddSemesterBtn />
                                        <RemoveSemesterBtn />
                                        <ClearBtn />
                                    </div>
                                    <div className="flex space-x-3">
                                        <SaveBtn />
                                        <DeleteBtn />
                                    </div>
                                </div>
                                <p>
                                    <strong>*OBS: </strong>
                                    Værktøjet er tiltænkt som et <u>vejledende</u> værktøj, der kan hjælpe med at skabe overblik over din studieplan
                                    som bachelorstuderende i Softwareteknologi.
                                    <br />
                                    Det er derfor vigtigt at få bekræftet din studieplan i <a href="https://kurser.dtu.dk/search" className="text-blue-500 underline">DTU&apos;s studieplanlægger</a>,
                                    hos &nbsp;
                                    <a href="https://www.dtu.dk/uddannelse/vejledning/studievejledningen" className="text-blue-500 underline">DTU Studievejledning</a>
                                    &nbsp; eller hos studielederen for Software Bachelor,&nbsp;
                                    <a href="/contact" className="text-blue-500 underline">Carsten Witt</a>.
                                    <br />
                                    For mere information om kurserne og kursusfordeling, henvises der til &nbsp;
                                    <a href="https://student.dtu.dk/studieordninger/bachelor/softwareteknologi/studieplan" className="text-blue-500 underline">DTU officielle studieplan for Softwareteknologi</a>.

                                    <br />
                                </p>
                            </div>

                            {/* ######################### Course list for available courses ######################### */}
                            <div className="m-10 flex flex-col">
                                <h2 className="text-2xl font-semibold mb-4">Tilgængelige kurser</h2>
                                <SearchField />
                                <Filter />
                                <DroppableCourseList>
                                    {filteredCourses.map((c) => (
                                        <DraggableCourse key={getCourseDragId(c)} course={c} />
                                    ))}
                                </DroppableCourseList>

                            </div>
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
