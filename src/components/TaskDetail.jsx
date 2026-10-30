import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

function TaskDetail({ columns, onUpdateTask }) {
  const { taskId } = useParams();
  const navigate = useNavigate();

  const column = columns.find((col) => col.tasks.some((t) => t.id === taskId));
  const task = column?.tasks.find((t) => t.id === taskId);


  const [title, setTitle] = useState(task?.text ?? "");
  const [description, setDescription] = useState(task?.description ?? "");

  if (!task) {
    return (
      <div className="min-h-screen bg-slate-200 p-6">
        <h1 className="text-2xl font-bold mb-4">Task not found</h1>
        <Link to="/" className="text-blue-600 hover:underline">
          Back to board
        </Link>
      </div>
    );
  }
  function handleSave() {
    const cleanTitle = title.trim();
    if (cleanTitle === "") return;
    onUpdateTask(task.id, { text: cleanTitle, description: description.trim() });
    navigate("/");
  }

  return (
    <div
      onClick={() => navigate("/")}
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">

      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">

        <p className="text-sm text-slate-500 mb-4">In column: {column.title}</p>

        <label className="block text-sm font-medium mb-1" htmlFor="title">Title</label>

        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
          }}
          className="border rounded px-2 py-1 w-full text-sm mb-4"
        />

        <label className="block text-sm font-medium mb-1" htmlFor="desc">Description</label>
        <textarea
          id="desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSave();
            }
          }}
          rows={5}
          placeholder="Add more details..."
          className="border rounded px-2 py-1 w-full text-sm mb-6"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={() => navigate("/")}
            className="px-3 py-1 rounded bg-slate-200 text-sm">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white rounded px-3 py-1 text-sm">
            Save
          </button>
        </div>

      </div>
    </div>
  );
}

export default TaskDetail;