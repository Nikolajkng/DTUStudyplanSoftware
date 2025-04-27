import React from "react";
import { useStudyPlan } from "../hooks/useStudyPlan";

export function ExportAsJsonBtn() {

    const { placements, semesters } = useStudyPlan();


    // Function to export the current study plan as a JSON file
    const handleExportAsJson = () => {
        const planName = prompt("Angiv et navn til studieforløbet:");
        if (planName) {
            // Include both placements and semesters in the exported JSON
            const studyPlanData = {
                placements,
                semesters,
            };

            const blob = new Blob([JSON.stringify(studyPlanData)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            console.log("created temporary download url: " + url);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${planName}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    };


    return (
        <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            onClick={handleExportAsJson}
        >
            <strong>Download Studieforløb som JSON</strong>
        </button>
    );
}