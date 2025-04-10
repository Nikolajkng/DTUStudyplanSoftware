import React from 'react'

export default function CourseName(props: {courseName: string}) {    
  return (
    <td className="border border-gray-300 px-4 py-2 ">
        {props.courseName}
    </td>
  )
}
