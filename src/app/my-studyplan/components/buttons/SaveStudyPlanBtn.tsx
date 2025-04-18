import { useState } from "react";
import { useStudyPlan } from "../hooks/useStudyPlan";


const saveStudyPlan = () => {
    const { placements, semesters, setSavedPlans } = useStudyPlan();
    const planName = prompt("Angiv et navn til studieforløbet:");
    if (planName) {
        setSavedPlans((prevPlans) => ({
            ...prevPlans,
            [planName]: { placements, semesters, },
        }));
        alert(`Studieforløb "${planName}" gemt!`);
    }
};


export default function SaveStudyPlanBtn() {
    return (
        <button
            onClick={saveStudyPlan}
            className="px-4 py-2 bg-red-700 text-white rounded hover:bg-gray-800"
        >
            Gem nuværende studieforløb
        </button>
    )
}
