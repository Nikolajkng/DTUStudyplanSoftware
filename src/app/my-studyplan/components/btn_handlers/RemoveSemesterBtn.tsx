import React from 'react'
import { useStudyPlan } from '../hooks/useStudyPlan';

function RemoveSemesterBtn() {
    const { semesters, setSemesters } = useStudyPlan();
    
    // removes a row from the course grid
    const removeOneSemester = () => {
        if (semesters <= 7) return;
        setSemesters((prev) => prev - 1);
        console.log(semesters);
    };


    return (
        <button
            onClick={removeOneSemester}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-800 mr-2"
        >
            Fjern semester
        </button>
    )
}

export default RemoveSemesterBtn