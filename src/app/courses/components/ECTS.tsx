import React from 'react'

export default function ECTS(props: {ects: number}) {    
  return (
    <td className="border border-gray-300 px-4 py-2 text-center">
        {props.ects}
    </td>
  )
}
