import React from 'react'



export default function CourseID(props: { courseID: string }) {
    return (
        <td className="border border-gray-300 py-2 text-center">
            {/* Check if courseID is 00000, then do not link */}
            {props.courseID === '00000' ? (
                <span className='text-gray-500'>{ }</span>
            ) : (
                <a href={`https://kurser.dtu.dk/course/${props.courseID}`} className='text-blue-500 hover:text-blue-700 underline '>
                    {props.courseID}
                </a>
            )}
        </td>
    )
}
