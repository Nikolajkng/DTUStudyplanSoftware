import { useDroppable } from "@dnd-kit/core";

interface GridFillerProps {
    x: number;
    y: number;
    highlight?: "valid" | "invalid" | null;
}

// Fills the course grid (study plan) with placeholder cells
const GridFiller = ({ x, y, highlight = null }: GridFillerProps) => {
    const { setNodeRef } = useDroppable({ id: `${x - 1}-${y - 1}` }); // match baseCoords [x, y]

    const borderStyling = x % 2 === 0 ? "border-r-4" : "";

    let bgColor = "bg-gray-300"; // default
    if (highlight === "valid") bgColor = "bg-green-200";
    if (highlight === "invalid") bgColor = "bg-red-300";

    return (
        <div
            ref={setNodeRef}
            className={`${bgColor} border-white ${borderStyling}`}
            style={{
                width: "100%",
                height: "100%",
                gridRowStart: y,
                gridColumnStart: x,
            }}

        />

    );
};

export default GridFiller;
