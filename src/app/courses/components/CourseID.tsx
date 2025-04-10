import React from 'react'



export default function CourseID(props: { courseID: string }) {
    return (
        <td className="border border-gray-300 py-2 text-center">
            <a href={`https://kurser.dtu.dk/course/${props.courseID}`} className='text-blue-500 hover:text-blue-700 underline '>
                {props.courseID}
            </a>
        </td>
    )
}
