// useStudyPlan.tsx
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { cachedFetchCourses } from "../../../../db/fetchCourses";
import { CoursePlacement, CourseWithSem } from "../CourseTypes";


export const useStudyPlan = () => {
    const [placements, setPlacements] = useState<CoursePlacement[]>([]);
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

    return {
        placements,
        setPlacements,
        savedPlans,
        setSavedPlans,
        selectedPlan,
        setSelectedPlan,
        courses,
        setCourses,
        semesters,
        setSemesters,
        selectedCourseType,
        setSelectedCourseType,
        saveStudyPlan,
        
    };
};
