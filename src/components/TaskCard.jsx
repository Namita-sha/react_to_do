import { useNavigate } from "react-router-dom";
function TaskCard({ task, hasPrev, hasNext, onPrev, onNext, onDragStart, onDelete }) {
  const navigate = useNavigate();
  return (
    <div
      draggable onDragStart={onDragStart}
      onClick={() => navigate(`/task/${task.id}`)}
      className="bg-white rounded-lg shadow p-3 text-sm cursor-grab">

      <div className="flex justify-between items-start gap-2 mb-2">
        <p className="wrap-break-word min-w-0">{task.text}</p>

        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          aria-label="Delete task"
          className="text-slate-400 hover:text-red-600 text-sm leading-none">×
        </button>
      </div>

      <div className="flex justify-between items-center">
        <div>
          {hasPrev && (
            <button
              onClick={(e) => { e.stopPropagation(); onPrev(); }}
              className="px-2 py-1 rounded bg-slate-200 text-xs">
              Prev
            </button>
          )}
        </div>

        <div>
          {hasNext && (
            <button
              onClick={(e) => { e.stopPropagation(); onNext(); }}
              className="px-2 py-1 rounded bg-slate-200 text-xs">
              Next
            </button>
          )}
        </div>
      </div>

    </div>
  );
}

export default TaskCard;