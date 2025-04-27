import React from 'react'
import { useStudyPlan } from '../hooks/useStudyPlan';

function AddSemesterBtn() {
  const { semesters, setSemesters } = useStudyPlan();

  // Adds another row in the course grid, representing a semester
  const addAnotherSemester = () => {
    if (semesters >= 10) return;
    setSemesters((prev) => prev + 1);
    console.log(semesters);
  };

  return (
    <button
      onClick={addAnotherSemester}
      className="px-4 py-2 bg-red-700 text-white rounded hover:bg-gray-800 mr-2"
    >
      <strong>Tilføj semester</strong>
    </button>
  )
}

export default AddSemesterBtn