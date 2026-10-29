import { useState } from "react";
import TaskCard from "./TaskCard";

function Column({ column, prevId, nextId, onAddTask, onMoveTask, onDeleteColumn, onDeleteTask }) {
  const [text, setText] = useState("");

  //add
  function handleAdd() {
    onAddTask(column.id, text);
    setText("");
  }

  //drag
  function handleDragStart(e, taskId) {
    e.dataTransfer.setData("text/plain",
      JSON.stringify({ taskId, fromId: column.id }));
  }

  //drop
  function handleDragOver(e) {
    e.preventDefault();
  }

  function handleDrop(e) {
    e.preventDefault();
    const { taskId, fromId } = JSON.parse(e.dataTransfer.getData("text/plain"));
    onMoveTask(taskId, fromId, column.id);
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className=" relative w-72 shrink-0 bg-gray-100 rounded-xl p-3">

      {!column.locked && (
        <button onClick={() => onDeleteColumn(column.id)}
          className="absolute top-2 right-2 px-2 py-1 rounded bg-red-100 text-red-700 text-xs hover:bg-red-200">
          Delete
        </button>
      )}
      <h2 className="font-semibold mb-3 pr-16">{column.title}</h2>

      {/* input row and add button */}
      <div className="flex gap-2 mb-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAdd();
          }}
          placeholder="New task..."
          className="border rounded px-2 py-1 flex-1 min-w-0 text-sm"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white rounded px-3 py-1 text-sm">
          Add</button>
      </div>

      <div className="flex flex-col gap-2">
        {column.tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            hasPrev={Boolean(prevId)}
            hasNext={Boolean(nextId)}
            onPrev={() => onMoveTask(task.id, column.id, prevId)}
            onNext={() => onMoveTask(task.id, column.id, nextId)}
            onDragStart={(e) => handleDragStart(e, task.id)}
            onDelete={() => onDeleteTask(column.id, task.id)}

          />
        ))}
      </div>
    </div>
  );
}

export default Column;