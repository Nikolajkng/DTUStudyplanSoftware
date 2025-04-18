import React from 'react'
import Cookies from "js-cookie";
import { useStudyPlan } from "../hooks/useStudyPlan";


    // Function to upload a study plan from a JSON file
    // The file should contain an array of course placements
    // The function parses the file and updates the state with the new placements
    const handleUploadStudyPlanAsJSON = async (file: File) => {
        const { setPlacements, setSemesters, setSavedPlans, setSelectedPlan } = useStudyPlan();

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

                    // Save the uploaded plan to the savedPlans state
                    setSavedPlans((prevPlans) => {
                        const updatedPlans = {
                            ...prevPlans,
                            [planName]: { placements, semesters },
                        };
                        Cookies.set("savedStudyPlans", JSON.stringify(updatedPlans), { expires: 365 * 100 }); // Save to cookies
                        return updatedPlans;
                    });

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

export function UploadStudyPlanAsJSON() {
    
    return (
        <><input
            type="file"
            id="fileInput"
            style={{ display: "none" }}
            onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                    handleUploadStudyPlanAsJSON(file);
                }
            }} /><button
                onClick={() => document.getElementById("fileInput")?.click()}
                className="px-4 py-2 bg-blue-400 text-white rounded hover:bg-gray-800"
            >
                Upload Studieforløb (importér JSON fil)
            </button>
        </>
    )
}

