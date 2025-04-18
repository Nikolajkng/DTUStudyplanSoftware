import { useState } from "react";
import { useStudyPlan } from "../hooks/useStudyPlan";

export default function SaveStudyPlanBtn() {
    const { placements, semesters, setSavedPlans } = useStudyPlan();
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


    return (
        <button
            onClick={saveStudyPlan}
            className="px-4 py-2 bg-red-700 text-white rounded hover:bg-gray-800"
        >
            Gem nuværende studieforløb
        </button>
    )
}
