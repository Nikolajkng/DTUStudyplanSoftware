import { useState } from "react";
import { useStudyPlan } from "../hooks/useStudyPlan";

export default function SaveBtn() {
    const { placements, semesters, setSavedPlans } = useStudyPlan();
    const handleSave = () => {
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
            onClick={handleSave}
            className="px-4 py-2 bg-red-700 text-white rounded hover:bg-gray-800"
        >
            Gem nuværende studieforløb
        </button>
    )
}
