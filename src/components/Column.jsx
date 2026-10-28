import {useState} from "react";
import TaskCard from "./TaskCard";

function Column({ column,onAddTask }) {
const[text,setText]=useState("");
  return (
    <div className="w-72 shrink-0 bg-gray-100 rounded-xl p-3">
      <h2 className="font-semibold mb-3">{column.title}</h2>

    <input
    value={text}
    onChange={(e)=> setText(e.target.value)}
    className="border rounded px-2 py-1 w-full text-sm mb-3"
    />
    <button
      onClick={()=> onAddTask(column.id,text)}
      className="bg-blue-600 text-white rounded px-3 py-1 text-sm mb-3">
     Add</button>

      <div className="flex flex-col gap-2">
        {column.tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}

export default Column;