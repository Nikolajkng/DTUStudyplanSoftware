import React from 'react'
import { useStudyPlan } from '../hooks/useStudyPlan';


function DeleteBtn() {
    const { savedPlans, setSavedPlans, setPlacements, setSelectedPlan, selectedPlan } = useStudyPlan();

    // Delete selected studyplan from the cookies and returns to "default" selected study plan
    const handleDelete = () => {
        if (!selectedPlan) return;
        const restPlans = Object.fromEntries(
            Object.entries(savedPlans).filter(([key]) => key !== selectedPlan)
        );
        setSavedPlans(restPlans);
        setPlacements([]);
        setSelectedPlan("");
    };

    return (
        <button
            onClick={handleDelete}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-800"
        >
            Slet nuværende studieforløb
        </button>
    )
}

export default DeleteBtn