import { useState } from "react";
import Column from "./components/Column";

function App() {
  const [columns, setColumns] = useState([
    { id: "c1", title: "To Do", tasks: [{ id: "t1", text: "Learn React" }, { id: "t2", text: "Build Kanban" }] },
    { id: "c2", title: "Pending", tasks: [{ id: "t3", text: "Read Tailwind docs" }] },
    { id: "c3", title: "Complete", tasks: [] },
  ]);

  //add
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

//shift
function MoveTask(taskId,fromId,toId){
if(!toId)
  return;

const fromColumn=columns.find((col)=>col.id===fromId);
const task=fromColumn.tasks.find((t)=>t.id===taskId);

setColumns(
  columns.map((col)=>{
    if(col.id===fromId){
      return {
        ...col,tasks:col.tasks.filter((t)=>t.id!==taskId)
      };
    }
    if(col.id===toId){
      return {
        ...col,tasks:[...col.tasks,task]
      };
    }
    return col;
  })
);
}

  return (
    <div className="min-h-screen bg-slate-200 p-6">
      <h1 className="text-2xl font-bold mb-6">Kanban Board</h1>

      <div className="flex gap-4 overflow-x-auto items-start">
        {columns.map((column,index) => (
          <Column key={column.id}
          column={column}
          prevId={columns[index-1]?.id}
          nextId={columns[index+1]?.id}
          onAddTask={addTask}
          onMoveTask={MoveTask}
          />
        ))}
      </div>
    </div>
  );
}

export default App;