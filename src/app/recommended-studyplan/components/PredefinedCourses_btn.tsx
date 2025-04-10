import React from 'react'


const predefinedCourses = ["Generalitet", "Algoritmitik", "Billedanalyse", "Datasikkerhed", "Kunstig intelligens", "Softwareudvikling"]



interface PredefinedCoursesBtnProps {
    onClick: (course: string) => void;
}

export default function PredefinedCourses_btn({ onClick }: PredefinedCoursesBtnProps) {
    return (
        <div className="m-10 flex flex-col">
            <h2 className="text-2xl font-semibold mb-4">Anbefalede studieforløb</h2>
            {predefinedCourses.map((course, index) => (
                <button
                    key={index}
                    className="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-slate-500"
                    onClick={() => onClick(course)}
                >
                    {course}
                </button>
            ))}
        </div>
    )
}
