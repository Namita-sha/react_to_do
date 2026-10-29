import { useState,useEffect } from "react";
import Column from "./components/Column";

const STORAGE_KEY ="kanban-columns";

const defaultColumns =[
  { id: "c1", title: "To Do", locked: true, tasks: [{ id: "t1", text: "Learn React" }, { id: "t2", text: "Build Kanban" }] },
  { id: "c2", title: "Pending", locked: true, tasks: [{ id: "t3", text: "Read Tailwind docs" }] },
  { id: "c3", title: "Complete", locked: true, tasks: [] },
];

function loadColumns(){
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultColumns;
  } catch {
    return defaultColumns;
  }
}
function App(){
  const [newTitle, setNewTitle] = useState("");
  const [columns, setColumns] = useState(loadColumns);

  useEffect(()=>{
    localStorage.setItem(STORAGE_KEY,JSON.stringify(columns));
  },[columns]);
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

//add column
function addColumn(){
  const cleanTitle=newTitle.trim();
  if(cleanTitle==="") return;

  const newColumn={
    id:crypto.randomUUID(),
    title:cleanTitle,
    tasks:[],
  };
  setColumns([...columns,newColumn]);
  setNewTitle("");
}

//shift
function moveTask(taskId,fromId,toId){
if (!toId || fromId === toId) return;

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

//delete extra column
function deleteColumn(columnId){
  const column=columns.find((col)=>col.id===columnId);

  if(column.tasks.length>0){
    const ok=window.confirm(
      `Delete "${column.title}" and its ${column.tasks.length} task(s)?`
    );
    if(!ok) return;
  }
  setColumns(columns.filter((col)=>col.id!==columnId));
}

//delete task
function deleteTask(columnId,taskId){
  setColumns(
    columns.map((col)=>
    col.id=== columnId ?{...col,tasks:col.tasks.filter((t)=>t.id!==taskId)} :col)
  );
}

  return (
    <div className="min-h-screen bg-slate-200 p-6">
      <h1 className="text-2xl font-bold mb-6">Kanban Board</h1>

    <div className="flex gap-2 mb-6">
      <input
      value={newTitle}
      onChange={(e)=> setNewTitle(e.target.value)}
      onKeyDown={(e)=>{
        if(e.key==="Enter") addColumn();
      }}
      placeholder="New column"
      className="border rounded px-2 py-1 text-sm"/>
      <button onClick={addColumn}
      className="bg-blue-600 text-white rounded px-3 py-1 text-sm">
        Add column </button>

    </div>

      <div className="flex gap-4 overflow-x-auto min-h-[70vh]">
        {columns.map((column,index) => (
          <Column key={column.id}
          column={column}
          prevId={columns[index-1]?.id}
          nextId={columns[index+1]?.id}
          onAddTask={addTask}
          onMoveTask={moveTask}
          onDeleteColumn={deleteColumn}
          onDeleteTask={deleteTask}
          />
        ))}
      </div>
    </div>
  );
}

export default App;