import { useState } from "react";
import Column from "./components/Column";

function App() {
  const [columns, setColumns] = useState([
    { id: "c1", title: "To Do", tasks: [{ id: "t1", text: "Learn React" }, { id: "t2", text: "Build Kanban" }] },
    { id: "c2", title: "Pending", tasks: [{ id: "t3", text: "Read Tailwind docs" }] },
    { id: "c3", title: "Complete", tasks: [] },
  ]);

function addTask(columnId,text){
  const cleanText=text.trim();
  if(cleanText=== "") //if no text added
    return;

  const newTask={id:crypto.randomUUID(),text: cleanText};
  setColumns(
    columns.map((col)=>
    col.id===columnId ? {...col,tasks:[...col.tasks,newTask]}:col
  )
  );
}

  return (
    <div className="min-h-screen bg-slate-200 p-6">
      <h1 className="text-2xl font-bold mb-6">Kanban Board</h1>

      <div className="flex gap-4 overflow-x-auto items-start">
        {columns.map((column) => (
          <Column key={column.id} column={column} onAddTask={addTask}/>
        ))}
      </div>
    </div>
  );
}

export default App;