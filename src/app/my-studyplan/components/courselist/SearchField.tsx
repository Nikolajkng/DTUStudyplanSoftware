import React from "react";
import { useStudyPlan } from "../hooks/useStudyPlan";
function SearchField() {
    const { searchQuery, setSearchQuery } = useStudyPlan();

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
    };

    return (
        <div className="flex flex-col md:flex-row gap-4 items-center my-2">
            <div className="relative w-full md:w-1/2">
                <input
                    type="text"
                    placeholder="Søg efter kursusID/kursusnavn"
                    className="w-80 pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:outline-none text-base"
                    onChange={handleSearch}
                    value={searchQuery}
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    🔍
                </div>
            </div>

            
        </div>
    );
}

export default SearchField;
