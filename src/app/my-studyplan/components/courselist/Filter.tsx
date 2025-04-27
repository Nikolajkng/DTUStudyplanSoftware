import React from 'react'
import { useStudyPlan } from '../hooks/useStudyPlan'

function Filter() {
    const { selectedCourseType, setSelectedCourseType, courses } = useStudyPlan();

    return (
        <div className="flex flex-col mt-2">
            <strong>Filter:</strong>
            <select
                id="courseType"
                value={selectedCourseType}
                onChange={(e) => setSelectedCourseType(e.target.value)}
                className="px-4 py-4 border rounded relative w-80"
            >
                <option value=""> Alle Kurser </option>
                {[...new Set(
                    courses.flatMap((c) =>
                        c.course_type === "Polyteknisk grundlag & Retningsspecifikke kurser"
                            ? ["Polyteknisk grundlag", "Retningsspecifikke kurser"]
                            : [c.course_type]
                    )
                )].map((type) => (
                    <option key={type} value={type}>
                        {type}
                    </option>
                ))}
            </select>
        </div>
    )
}

export default Filter