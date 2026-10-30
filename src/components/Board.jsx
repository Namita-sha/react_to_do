import { useState } from "react";
import Column from "./Column";

function Board({ columns, onAddColumn, onAddTask, onMoveTask, onDeleteColumn, onDeleteTask }) {
    const [newTitle, setNewTitle] = useState("");
    function handleAddColumn() {
        onAddColumn(newTitle);
        setNewTitle("");
    }

    return (
        <div className="min-h-screen bg-slate-200 p-6">
            <h1 className="text-2xl font-bold mb-6">Kanban Board</h1>

            <div className="flex gap-2 mb-6">
                <input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleAddColumn();
                    }}
                    placeholder="New column"
                    className="border rounded px-2 py-1 text-sm" />
                <button onClick={handleAddColumn}
                    className="bg-blue-600 text-white rounded px-3 py-1 text-sm">
                    Add column </button>
            </div>

            <div className="flex gap-4 overflow-x-auto min-h-[70vh]">
                {columns.map((column, index) => (
                    <Column key={column.id}
                        column={column}
                        prevId={columns[index - 1]?.id}
                        nextId={columns[index + 1]?.id}
                        onAddTask={onAddTask}
                        onMoveTask={onMoveTask}
                        onDeleteColumn={onDeleteColumn}
                        onDeleteTask={onDeleteTask}
                    />
                ))}
            </div>
        </div>
    );
}

export default Board;