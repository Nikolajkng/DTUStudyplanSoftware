import React from 'react';
import { useStudyPlan } from '../hooks/useStudyPlan';
import { FunnelIcon } from '@heroicons/react/16/solid';

function Filter() {
    const { selectedCourseType, setSelectedCourseType, courses } = useStudyPlan();

    return (
        <div className="relative flex flex-row mb-2">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                <FunnelIcon className="w-5 h-5" />
            </div>
            <select
                id="courseType"
                value={selectedCourseType}
                onChange={(e) => setSelectedCourseType(e.target.value)}
                className="w-full md:w-80 pl-10 pr-8 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:outline-none text-base appearance-none bg-white"
            >
                <option value="">Alle kurser </option>
                {[...new Set(
                    courses.flatMap((c) =>
                        c.course_type === "Polyteknisk grundlag & Retningsspecifikke kurser"
                            ? ["Polyteknisk grundlag", "Retningsspecifikke kurser"]
                            : [c.course_type]
                    )
                )].map((type) => (
                    <option key={type} value={type}>
                        {type}
                    </option>
                ))}
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
                ▼
            </div>
        </div>
    );
}

export default Filter;
