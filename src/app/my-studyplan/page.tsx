"use client";

import React, { useState } from "react";
import { DndContext, DragEndEvent, DragOverEvent, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import "../styles/grid.css";
import "../styles/courses.css";


export default function MyStudyPlan() {
    const [items, setItems] = useState([
        { id: "1", name: "Matematik 1" },
        { id: "2", name: "Parallel" },
        { id: "3", name: "Funktions" },
        { id: "4", name: "Matematik 1" },
        { id: "5", name: "Parallel" },
        { id: "6", name: "Funktions" },
        { id: "7", name: "Matematik 1" },
        { id: "8", name: "Parallel" },
        { id: "9", name: "Funktions" },
    ]);

    const [droppedItems, setDroppedItems] = useState<any[]>([]);


    function DraggableItem({ item, className }: { className: string; item: { id: string; name: string } }) {
        const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });

        const dragStyle = {
            transition: transition,
            transform: CSS.Transform.toString(transform),
        };


        return (
            <div className={className} key={item.id} ref={setNodeRef} {...attributes} {...listeners} style={dragStyle}>
                {item.name}
            </div>
        );
    }



    function handleDragOver(event: DragOverEvent): void {
        throw new Error("Function not implemented.");
    }

    function handleDrop(event: DragEndEvent): void {
        throw new Error("Function not implemented.");
    }

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex justify-center items-center h-screen gap-20">

                <div>
                    <h2><strong>My Study Plan</strong></h2>
                    <DndContext collisionDetection={closestCenter} onDragOver={handleDragOver} onDragEnd={handleDrop}>
                        <SortableContext items={droppedItems.map(item => item.id)} strategy={verticalListSortingStrategy}>
                            <div className="grid_window">

                                <div className="grid_layout">
                                    {Array.from({ length: 6*6 }).map((_, index) => (
                                        <div key={index} className="grid_cell">
                                            
                                        </div>
                                    ))}

                                </div>
                            </div>
                        </SortableContext>
                    </DndContext>
                </div>

                <div>
                    <h1> <strong>Available courses</strong></h1>
                    <DndContext collisionDetection={closestCenter}>
                        <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
                            <div className="courses_window">
                                <div className="courses_layout">
                                    {items.map((item) => (
                                        <DraggableItem key={item.id} item={item} className={"course"} />
                                    ))}
                                </div>
                            </div>
                        </SortableContext>
                    </DndContext>
                </div>

            </div>
        </div >
    );
}
