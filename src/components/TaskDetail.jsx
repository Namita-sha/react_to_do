import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

function TaskDetail({ columns, onUpdateTask }) {
  const { taskId } = useParams();
  const navigate = useNavigate();

  const column = columns.find((col) => col.tasks.some((t) => t.id === taskId));
  const task = column?.tasks.find((t) => t.id === taskId);


  const [title, setTitle] = useState(task?.text ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [priority, setPriority] = useState(task?.priority ?? "medium");

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
    onUpdateTask(task.id, { text: cleanTitle, description: description.trim(), priority });
    navigate("/");
  }

  return (
    <Dialog open={true} onClose={() => navigate("/")} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/40" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="bg-white border border-sky-100 rounded-xl shadow-lg p-6 w-full max-w-md">

          <DialogTitle className="sr-only">Edit task</DialogTitle>

          <p className="text-sm text-slate-500 mb-4">In column: {column.title}</p>

          <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="title">Title</label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
            }}
            className="border border-sky-200 bg-white rounded px-2 py-1 w-full text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />

          <label className="block text-sm font-medium mb-1" htmlFor="desc">Description</label>
          <textarea
            id="desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                handleSave();
              }
            }}
            rows={5}
            placeholder="Add more details..."
            className="border border-sky-200 bg-white rounded px-2 py-1 w-full text-sm mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
          <p className="block text-sm font-medium mb-1">Priority</p>
          <div className="flex gap-2 mb-6">
            {["high", "medium", "low"].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={`px-3 py-1 rounded text-sm capitalize border ${priority === p
                    ? "bg-indigo-100 text-indigo-700 border-indigo-300"
                    : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                  }`}>
                {p}
              </button>
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => navigate("/")}
              className="px-3 py-1 rounded bg-slate-100 text-slate-600 hover:bg-slate-200 text-sm">
              Cancel
            </button>

            <button
              onClick={handleSave}
              className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded px-3 py-1 text-sm">
              Save
            </button>
          </div>

        </DialogPanel>
      </div>
    </Dialog>
  );
}

export default TaskDetail;