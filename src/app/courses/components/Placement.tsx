import React from 'react'

export default function Placement(props:{placement: string}) {
    return (
        <td className="border border-gray-300 px-4 py-2 text-center">
            {props.placement}
        </td>
      )
    }
    