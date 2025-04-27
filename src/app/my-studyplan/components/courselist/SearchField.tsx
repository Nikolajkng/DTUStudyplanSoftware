import React from "react";
import { useStudyPlan } from "../hooks/useStudyPlan";
function SearchField() {
    const { searchQuery, setSearchQuery } = useStudyPlan();

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
    };

    return (
        <div className="flex flex-col mb-2">
            <strong>Søgefelt: </strong>
            <input
                type="text"
                placeholder="Søg efter kursusID/kursusnavn"
                className="px-4 py-2 border rounded w-80"
                value={searchQuery}
                onChange={handleSearch}
            />
        </div>
    );
}

export default SearchField;
