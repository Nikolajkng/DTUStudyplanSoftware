import { useDroppable } from "@dnd-kit/core";

// Fills the course grid (study plan) with placeholder cells
const GridFiller = ({ x, y }: { x: number; y: number }) => {
    const { setNodeRef } = useDroppable({ id: `${x + 1}-${y}` });
    const borderStyling = x % 2 == 0 ? "border-r-4" : "";

    return (
        <div
            className={`bg-gray-300 border-white ${borderStyling}`}
            style={{
                width: "100%", // Fill the grid cell
                height: "100%", // Fill the grid cell
                gridRowStart: y + 1,
                gridColumnStart: x + 2,
            }}
            ref={setNodeRef}
        />
    );
};
export default GridFiller;