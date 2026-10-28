import {useState} from "react";
import TaskCard from "./TaskCard";

function Column({ column,prevId,nextId,onAddTask ,onmoveTask}) {
const[text,setText]=useState("");

function handleAdd(){
  onAddTask(column.id,text);
  setText("");
}

  return (
    <div className="w-72 shrink-0 bg-gray-100 rounded-xl p-3">
      <h2 className="font-semibold mb-3">{column.title}</h2>

    <input
    value={text}
    onChange={(e)=> setText(e.target.value)}
    onKeyDown={(e)=>{
      if(e.key==="Enter") handleAdd();
    }}
    placeholder="New task..."
    className="border rounded px-2 py-1 w-full text-sm mb-3"
    />
    <button
      onClick={handleAdd}
      className="bg-blue-600 text-white rounded px-3 py-1 text-sm mb-3">
     Add</button>

      <div className="flex flex-col gap-2">
        {column.tasks.map((task) => (
          <TaskCard 
          key={task.id} 
          task={task}
          hasPrev={Boolean(prevId)}
          hasNext={Boolean(nextId)} 
          onPrev={() => onMoveTask(task.id, column.id, prevId)}
            onNext={() => onMoveTask(task.id, column.id, nextId)}
              />
        ))}
      </div>
    </div>
  );
}

export default Column;