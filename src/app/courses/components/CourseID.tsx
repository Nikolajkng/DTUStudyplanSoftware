import React from 'react'



export default function CourseID(props: { courseID: string }) {
    const bachelorProject_IDs = ['00000', '00001']
    const matched_BachelorProjectID = bachelorProject_IDs.map((id) => 
        props.courseID.match(id))
        .some((match) => match !== null);

    return (
        <td className="border border-gray-300 py-2 text-center">
            {/* No link attached to course id if bachelorproject course */}
            {matched_BachelorProjectID ?  (
                <span className='text-gray-500'>{ }</span>
            ) : (
                <a href={`https://kurser.dtu.dk/course/${props.courseID}`} className='text-blue-500 hover:text-blue-700 underline '>
                    {props.courseID}
                </a>
            )}
        </td>
    )
}
