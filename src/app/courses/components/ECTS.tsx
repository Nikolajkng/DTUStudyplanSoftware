import React from 'react'

export default function ECTS({ects}: {ects: number}) {    
  return (
    <td className="border border-gray-300 px-4 py-2 text-center">
        {ects}
    </td>
  )
}
