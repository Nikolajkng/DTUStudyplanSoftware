import React from 'react'
import { useStudyPlan } from '../hooks/useStudyPlan'

function SearchField() {
    const { selectedCourseType, setSelectedCourseType } = useStudyPlan()

    debugger;
    return (
        < div className="flex flex-col mb-2" >
            <strong>Søgefelt: </strong>
            <input
                type="text"
                placeholder="Søg efter kursusID/kursusnavn"
                className="px-4 py-2 border rounded w-80"
                onChange={(e) => setSelectedCourseType(e.target.value)}
            />
        </div>
    )
}

export default SearchField