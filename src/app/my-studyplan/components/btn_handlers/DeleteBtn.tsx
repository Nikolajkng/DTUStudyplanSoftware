import React from 'react'
import { useStudyPlan } from '../hooks/useStudyPlan';
import { TrashIcon } from '@heroicons/react/24/solid';



function DeleteBtn() {
    const { savedPlans, setSavedPlans, setPlacements, setSelectedPlan, selectedPlan } = useStudyPlan();

    // Delete selected studyplan from the cookies and returns to "default" selected study plan
    const handleDelete = () => {
        if (!selectedPlan) return;
        if (!confirm("Er du sikker på, at du vil slette studieforløbet?")) return;
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
            className="flex items-cener px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-800"
        >
            <TrashIcon className="h-5 w-5 mr-2" /> 
            Slet
        </button>
    )
}

export default DeleteBtn