import React from 'react';
import { useStudyPlan } from "../hooks/useStudyPlan";

export function UploadAsJsonBtn() {
    const { setPlacements, setSemesters, setSavedPlans, setSelectedPlan, savedPlans } = useStudyPlan();

    const handleUploadAsJSON = async (file: File) => {
        const reader = new FileReader();
        reader.onload = async (event) => {
            const fileContent = event.target?.result;
            if (typeof fileContent === "string") {
                try {
                    const parsedData = JSON.parse(fileContent);

                    // Ensure the parsed data contains placements and semesters
                    if (!Array.isArray(parsedData.placements) || typeof parsedData.semesters !== "number") {
                        throw new Error("Invalid file format. Expected an object with placements and semesters.");
                    }

                    const { placements, semesters } = parsedData;

                    // Prompt the user for a name for the uploaded plan
                    const planName = prompt("Angiv et navn til studieforløbet:");
                    if (!planName) {
                        alert("Angiv venligst et navn for at uploade studieforløb.");
                        return;
                    }

                    // Update the saved plans state and localStorage
                    const updatedPlans = {
                        ...savedPlans,
                        [planName]: { placements, semesters },
                    };
                    setSavedPlans(updatedPlans); // Update the state
                    localStorage.setItem("savedStudyPlans", JSON.stringify(updatedPlans)); // Save to localStorage

                    // Set the uploaded plan as the currently selected plan
                    setPlacements(placements);
                    setSemesters(semesters);
                    setSelectedPlan(planName);

                    alert(`Studieforløb "${planName}" uploaded og valgt succesfuldt!`);
                } catch (error) {
                    console.error("Error parsing file:", error);
                    alert("Fejl ved indhentning af studieforløb, venligst sørg for at filen er JSON.");
                }
            }
        };
        reader.readAsText(file);
    };

    return (
        <>
            <input
                type="file"
                id="fileInput"
                style={{ display: "none" }}
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                        handleUploadAsJSON(file);
                    }
                }}
            />
            <button
                onClick={() => document.getElementById("fileInput")?.click()}
                className="px-4 py-2 bg-blue-400 text-white rounded hover:bg-gray-800"
            >
                Upload Studieforløb (importér JSON fil)
            </button>
        </>
    );
}

