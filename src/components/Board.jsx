import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, closestCorners } from "@dnd-kit/core";
import { useState } from "react";
import Column from "./Column";
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";

function Board({ columns, onAddColumn, onAddTask, onMoveTask, onMoveTaskTo, onMoveColumn, onRenameColumn, onDeleteColumn, onDeleteTask }) {
    const [newTitle, setNewTitle] = useState("");
    function handleAddColumn() {
        onAddColumn(newTitle);
        setNewTitle("");
    }

    const [activeTask, setActiveTask] = useState(null);
    const [activeColumn, setActiveColumn] = useState(null);
    const [sourceColumnId, setSourceColumnId] = useState(null);
    const [overColumnId, setOverColumnId] = useState(null);

    function findColumnOf(id) {
        return (
            columns.find((col) => col.id === id) ||
            columns.find((col) => col.tasks.some((t) => t.id === id))
        );
    }

    function resetDrag() {
        setActiveTask(null);
        setActiveColumn(null);
        setSourceColumnId(null);
        setOverColumnId(null);
    }

    function handleDragStart(event) {
        if (event.active.data.current?.type === "column") {
            setActiveColumn(columns.find((c) => c.id === event.active.id) ?? null);
            return;
        }
        const col = findColumnOf(event.active.id);
        const task = col?.tasks.find((t) => t.id === event.active.id);
        setActiveTask(task ?? null);
        setSourceColumnId(col?.id ?? null);
    }

    function handleDragOver(event) {
        if (!event.over) {
            setOverColumnId(null);
            return;
        }
        setOverColumnId(findColumnOf(event.over.id)?.id ?? null);
    }

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
    );

    function handleDragEnd(event) {
        resetDrag();
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        //drag column
        if (active.data.current?.type === "column") {
            const overColumn =
                columns.find((col) => col.id === over.id) ||
                columns.find((col) => col.tasks.some((t) => t.id === over.id));
            if (overColumn) onMoveColumn(active.id, overColumn.id);
            return;
        }

        //drop on empty area
        const overColumn = columns.find((col) => col.id === over.id);
        if (overColumn) {
            onMoveTaskTo(active.id, overColumn.id, overColumn.tasks.length);
            return;
        }

        //drop on another task
        const targetColumn = columns.find((col) => col.tasks.some((t) => t.id === over.id));
        if (!targetColumn) return;

        const sourceColumn = columns.find((col) => col.tasks.some((t) => t.id === active.id));
        let index = targetColumn.tasks.findIndex((t) => t.id === over.id);

        if (sourceColumn?.id !== targetColumn.id) {
            const dragged = active.rect.current.translated;
            if (dragged) {
                const draggedMiddle = dragged.top + dragged.height / 2;
                const overMiddle = over.rect.top + over.rect.height / 2;
                if (draggedMiddle > overMiddle) index += 1;
            }
        }
        onMoveTaskTo(active.id, targetColumn.id, index);
    }

    return (
        <div className="min-h-screen bg-sky-50 p-6">
            <h1 className="text-2xl font-bold text-slate-700 mb-6">Kanban Board</h1>

            <div className="flex gap-2 mb-6">
                <input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleAddColumn();
                    }}
                    placeholder="New column"
                    className="border border-sky-200 bg-white rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200" />
                <button onClick={handleAddColumn}
                    className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded px-3 py-1 text-sm">
                    Add column </button>
            </div>
            <DndContext sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
                onDragCancel={resetDrag}>
                <SortableContext
                    items={columns.map((col) => col.id)}
                    strategy={horizontalListSortingStrategy}>
                    <div className="flex gap-4 overflow-x-auto min-h-[70vh]">
                        {columns.map((column, index) => (
                            <Column key={column.id}
                                column={column}
                                isSource={Boolean(activeTask) && sourceColumnId === column.id}
                                isOver={Boolean(activeTask) && overColumnId === column.id && sourceColumnId !== column.id}
                                prevId={columns[index - 1]?.id}
                                nextId={columns[index + 1]?.id}
                                onAddTask={onAddTask}
                                onMoveTask={onMoveTask}
                                onRenameColumn={onRenameColumn}
                                onDeleteColumn={onDeleteColumn}
                                onDeleteTask={onDeleteTask}
                            />
                        ))}
                    </div>
                </SortableContext>
                <DragOverlay>
                    {activeColumn ? (
                        <div className="w-72 rotate-2 rounded-xl border-2 border-indigo-300 bg-sky-100 p-3 shadow-xl cursor-grabbing">
                            <h2 className="font-semibold text-slate-700 mb-3">{activeColumn.title}</h2>
                            <p className="text-xs text-slate-500">
                                {activeColumn.tasks.length} task(s)
                            </p>
                        </div>
                    ) : activeTask ? (
                        <div className="w-64 rotate-2 rounded-lg border border-slate-100 bg-white p-3 text-sm text-slate-700 shadow-xl cursor-grabbing">
                            {activeTask.text}
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}

export default Board;