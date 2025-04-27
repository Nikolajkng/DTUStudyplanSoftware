import { useStudyPlan } from "../hooks/useStudyPlan";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid"; // Import the scale icon

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
            className="flex items-center px-4 py-2 bg-red-700 text-white rounded hover:bg-gray-800"
        >
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" /> {/* Add the save icon */}
            <strong>Gem</strong>
        </button>
    );
}
