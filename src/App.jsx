import { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import TaskDetail from "./components/TaskDetail";
import Board from "./components/Board";

const STORAGE_KEY = "kanban-columns";

const defaultColumns = [
  { id: "c1", title: "To Do", tasks: [{ id: "t1", text: "Learn React" }, { id: "t2", text: "Build Kanban" }] },
  { id: "c2", title: "Pending", tasks: [{ id: "t3", text: "Read Tailwind docs" }] },
  { id: "c3", title: "Complete", tasks: [] },
];

function loadColumns() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultColumns;
  } catch {
    return defaultColumns;
  }
}

function App() {
  const [columns, setColumns] = useState(loadColumns);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(columns));
  }, [columns]);

  //add task
  function addTask(columnId, text) {
    const cleanText = text.trim();
    if (cleanText === "") return;

    const newTask = { id: crypto.randomUUID(), text: cleanText };

    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId ? { ...col, tasks: [...col.tasks, newTask] } : col
      )
    );
  }

  //add column
  function addColumn(title) {
    const cleanTitle = title.trim();
    if (cleanTitle === "") return;

    const newColumn = {
      id: crypto.randomUUID(),
      title: cleanTitle,
      tasks: [],
    };
    setColumns((prev) => [...prev, newColumn]);
  }

  //shift
  function moveTask(taskId, fromId, toId) {
    if (!toId || fromId === toId) return;

    setColumns((prev) => {
      const task = prev
        .find((col) => col.id === fromId)
        ?.tasks.find((t) => t.id === taskId);
      if (!task) return prev;

      return prev.map((col) => {
        if (col.id === fromId) {
          return { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) };
        }
        if (col.id === toId) {
          return { ...col, tasks: [...col.tasks, task] };
        }
        return col;
      });
    });
  }

  //delete column
  function deleteColumn(columnId) {
    const column = columns.find((col) => col.id === columnId);
    if (!column) return;

    if (column.tasks.length > 0) {
      const ok = window.confirm(
        `Delete "${column.title}" and its ${column.tasks.length} task(s)?`
      );
      if (!ok) return;
    }
    setColumns((prev) => prev.filter((col) => col.id !== columnId));
  }

  //delete task
  function deleteTask(columnId, taskId) {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId
          ? { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) }
          : col
      )
    );
  }

  //update task
  function updateTask(taskId, changes) {
    setColumns((prev) =>
      prev.map((col) => ({
        ...col,
        tasks: col.tasks.map((t) =>
          t.id === taskId ? { ...t, ...changes } : t
        ),
      }))
    );
  }

  const board = (
    <Board
      columns={columns}
      onAddColumn={addColumn}
      onAddTask={addTask}
      onMoveTask={moveTask}
      onDeleteColumn={deleteColumn}
      onDeleteTask={deleteTask}
    />
  );

  return (
    <Routes>
      <Route path="/" element={board} />

      <Route
        path="/task/:taskId"
        element={
          <>
            {board}
            <TaskDetail columns={columns} onUpdateTask={updateTask} />
          </>
        }
      />

      <Route
        path="*"
        element={
          <div className="min-h-screen bg-slate-200 p-6">
            <h1 className="text-2xl font-bold mb-4">Page not found</h1>
            <Link to="/" className="text-blue-600 hover:underline">
              Back to board
            </Link>
          </div>
        }
      />
    </Routes>
  );
}

export default App;