import { useNavigate } from "react-router-dom";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function TaskCard({ task, hasPrev, hasNext, onPrev, onNext, onDelete }) {
  const navigate = useNavigate();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => navigate(`/task/${task.id}`)}
      className={`group relative rounded-lg border p-3 text-sm cursor-grab ${isDragging
          ? "border-dashed border-sky-400 bg-sky-50 shadow-none [&>*]:invisible"
          : "border-slate-100 bg-white shadow-sm"
        }`}>

      <div className="flex justify-between items-start gap-2 mb-2">
        <p className="wrap-break-word min-w-0 text-slate-700">{task.text}</p>

        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          aria-label="Delete task"
          className="text-slate-400 hover:text-rose-500 text-sm leading-none">
          ×
        </button>
      </div>
      {task.description && (
        <p className="text-xs text-slate-500 line-clamp-2 mb-2">
          {task.description}
        </p>
      )}
      <div className="flex justify-between items-center">
        <div>
          {hasPrev && (
            <button
              onClick={(e) => { e.stopPropagation(); onPrev(); }}
              className="px-2 py-1 rounded bg-sky-100 text-sky-700 hover:bg-sky-200 text-xs">
              Prev
            </button>
          )}
        </div>

        <div>
          {hasNext && (
            <button
              onClick={(e) => { e.stopPropagation(); onNext(); }}
              className="px-2 py-1 rounded bg-sky-100 text-sky-700 hover:bg-sky-200 text-xs">
              Next
            </button>
          )}
        </div>
      </div>
      {task.description && !isDragging && (
        <div className="pointer-events-none absolute left-0 top-full z-20 mt-1 w-64 max-h-48 overflow-hidden rounded-md bg-slate-700 px-3 py-2 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
          <p className="whitespace-pre-line">{task.description}</p>
        </div>
      )}

    </div>
  );
}

export default TaskCard;