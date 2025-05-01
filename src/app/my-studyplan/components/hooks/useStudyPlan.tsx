// hooks/useStudyPlan.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { cachedFetchCourses } from "../../../../db/fetchCourses";
import { CoursePlacement, CourseWithSem } from "../courselist/CourseTypes";

type StudyPlanContextType = {
    placements: CoursePlacement[];
    setPlacements: React.Dispatch<React.SetStateAction<CoursePlacement[]>>;
    savedPlans: {
        [key: string]: { placements: CoursePlacement[]; semesters: number };
    };
    setSavedPlans: React.Dispatch<React.SetStateAction<{
        [key: string]: { placements: CoursePlacement[]; semesters: number };
    }>>;
    selectedPlan: string;
    setSelectedPlan: React.Dispatch<React.SetStateAction<string>>;
    courses: CourseWithSem[];
    setCourses: React.Dispatch<React.SetStateAction<CourseWithSem[]>>;
    semesters: number;
    setSemesters: React.Dispatch<React.SetStateAction<number>>;
    selectedCourseType: string;
    setSelectedCourseType: React.Dispatch<React.SetStateAction<string>>;
    saveStudyPlan: () => void;
    hoveredCell: [number, number] | null;
    setHoveredCell: React.Dispatch<React.SetStateAction<[number, number] | null>>;
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
    validGridCells: { x: number; y: number }[];
    setValidGridCells: React.Dispatch<React.SetStateAction<{ x: number; y: number }[]>>;
    previewCells: { x: number; y: number; valid: boolean }[];
    setPreviewCells: React.Dispatch<React.SetStateAction<{ x: number; y: number; valid: boolean }[]>>;
};

const StudyPlanContext = createContext<StudyPlanContextType | null>(null);

export const StudyPlanProvider = ({ children }: { children: ReactNode }) => {
    const [savedPlans, setSavedPlans] = useState<{
        [key: string]: { placements: CoursePlacement[]; semesters: number };
    }>(() => {
        if (typeof window !== "undefined") {
            // Check if running in the browser
            const savedPlansFromStorage = localStorage.getItem("savedStudyPlans");
            if (savedPlansFromStorage) {
                try {
                    return JSON.parse(savedPlansFromStorage);
                } catch (error) {
                    console.error("Error parsing saved plans from localStorage during initialization:", error);
                }
            }
        }
        return {};
    });

    const [placements, setPlacements] = useState<CoursePlacement[]>([]);
    const [selectedPlan, setSelectedPlan] = useState<string>("");
    const [courses, setCourses] = useState<CourseWithSem[]>([]);
    const [semesters, setSemesters] = useState(7);
    const [selectedCourseType, setSelectedCourseType] = useState<string>("");
    const [hoveredCell, setHoveredCell] = useState<[number, number] | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [validGridCells, setValidGridCells] = useState<{ x: number; y: number }[]>([]); 
    const [previewCells, setPreviewCells] = useState<{ x: number; y: number; valid: boolean }[]>([]);


    useEffect(() => {
        cachedFetchCourses().then((data) => {
            setCourses(data);
        });
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined") {
            // Save to localStorage only in the browser
            localStorage.setItem("savedStudyPlans", JSON.stringify(savedPlans));
        }
    }, [savedPlans]);

    const saveStudyPlan = () => {
        const planName = prompt("Angiv et navn til studieforløbet:");
        if (planName) {
            setSavedPlans((prevPlans) => ({
                ...prevPlans,
                [planName]: { placements, semesters },
            }));
            alert(`Studieforløb "${planName}" gemt!`);
        }
    };

    return (
        <StudyPlanContext.Provider value={{
            placements, setPlacements,
            savedPlans, setSavedPlans,
            selectedPlan, setSelectedPlan,
            courses, setCourses,
            semesters, setSemesters,
            selectedCourseType, setSelectedCourseType,
            saveStudyPlan,
            hoveredCell, setHoveredCell,
            searchQuery, setSearchQuery,
            validGridCells, setValidGridCells,
            previewCells, setPreviewCells,
        }}>
            {children}
        </StudyPlanContext.Provider>
    );
};

export const useStudyPlan = () => {
    const context = useContext(StudyPlanContext);
    if (!context) {
        throw new Error("useStudyPlan must be used within a StudyPlanProvider");
    }
    return context;
};
