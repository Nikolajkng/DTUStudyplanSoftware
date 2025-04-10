import React from 'react'
import { Course } from '../../api/courses/route'



export default function CourseID({ courseID }: { courseID: String }) {
    return (
        <td className="border border-gray-300 px-4 py-2 text-center">
            <a href={`https://kurser.dtu.dk/course/${courseID}`} className='text-blue-500 hover:text-blue-700 underline'>
                {courseID}
            </a>
        </td>
    )
}
