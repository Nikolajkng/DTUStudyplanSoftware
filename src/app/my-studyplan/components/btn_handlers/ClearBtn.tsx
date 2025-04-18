import React from 'react'
import { useStudyPlan } from '../hooks/useStudyPlan';

function ClearBtn() {
    const { setPlacements } = useStudyPlan();

    return (
        <button
            onClick={() => {
                if (confirm("Er du sikker på, at du vil rydde studieforløbet?")) {
                    setPlacements([]);
                }
            }}
            className=" px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-800"
        >
            Ryd studieforløb
        </button>
    )
}

export default ClearBtn