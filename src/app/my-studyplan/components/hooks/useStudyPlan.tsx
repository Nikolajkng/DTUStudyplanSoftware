// hooks/useStudyPlan.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import Cookies from "js-cookie";
import { cachedFetchCourses } from "../../../../db/fetchCourses";
import { CoursePlacement, CourseWithSem } from "../CourseTypes";

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
};

const StudyPlanContext = createContext<StudyPlanContextType | null>(null);

export const StudyPlanProvider = ({ children }: { children: ReactNode }) => {

    const [savedPlans, setSavedPlans] = useState<{
        [key: string]: { placements: CoursePlacement[]; semesters: number };
    }>(() => {
        const savedPlansCookie = Cookies.get("savedStudyPlans");
        if (savedPlansCookie) {
            try {
                return JSON.parse(savedPlansCookie);
            } catch (error) {
                console.error("Error parsing saved plans from cookies during initialization:", error);
            }
        }
        return {};
    });

    const [placements, setPlacements] = useState<CoursePlacement[]>([]);
    const [hoveredCell, setHoveredCell] = useState<[number, number] | null>(null);
    const [selectedPlan, setSelectedPlan] = useState<string>("");
    const [courses, setCourses] = useState<CourseWithSem[]>([]);
    const [semesters, setSemesters] = useState(7);
    const [selectedCourseType, setSelectedCourseType] = useState<string>("");

    useEffect(() => {
        cachedFetchCourses().then((data) => {
            setCourses(data);
        });
    }, []);

    useEffect(() => {
        Cookies.set("savedStudyPlans", JSON.stringify(savedPlans), {
            expires: 365 * 100,
            path: "/",
        });
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
