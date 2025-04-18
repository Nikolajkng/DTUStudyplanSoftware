export default function ECTS(props: { ects: number | string }) {
  const ectsNum = Number(props.ects)
  const isWholeNumber = Number.isInteger(ectsNum)

  return (
    <td className="border border-gray-300 px-4 py-2 text-center">
      <span>{isWholeNumber ? ectsNum : ectsNum.toFixed(1)}</span>
    </td>
  )
}
