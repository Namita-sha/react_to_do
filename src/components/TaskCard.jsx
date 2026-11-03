import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";

function TaskCard({ task, onSetPriority, hasPrev, hasNext, onPrev, onNext, onDelete }) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  function handleCopyLink() {
    const link = `${window.location.origin}/task/${task.id}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function handleEdit() {
    navigate(`/task/${task.id}`);
  }
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

  const priority = task.priority ?? "medium";
  const priorityStyles = {
    high: "bg-rose-100 text-rose-700",
    medium: "bg-amber-100 text-amber-700",
    low: "bg-emerald-100 text-emerald-700",
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

        <Menu>
          <MenuButton
            aria-label="Task options"
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            className="px-1.5 rounded text-slate-400 hover:bg-slate-100 hover:text-slate-600 leading-none">
            ⋮
          </MenuButton>

          <MenuItems
            anchor="bottom end"
            onClick={(e) => e.stopPropagation()}
            className="z-50 w-36 rounded-md border border-slate-200 bg-white p-1 text-sm shadow-lg focus:outline-none">
            <MenuItem>
              <button
                onClick={handleEdit}
                className="block w-full rounded px-3 py-1.5 text-left text-slate-700 data-[focus]:bg-sky-50">
                Edit
              </button>
            </MenuItem>

            <MenuItem>
              <button
                onClick={handleCopyLink}
                className="block w-full rounded px-3 py-1.5 text-left text-slate-700 data-[focus]:bg-sky-50">
                Copy link
              </button>
            </MenuItem>

            <MenuItem>
              <button
                onClick={onDelete}
                className="block w-full rounded px-3 py-1.5 text-left text-rose-600 data-[focus]:bg-rose-50">
                Delete
              </button>
            </MenuItem>
          </MenuItems>
        </Menu>
      </div>
      {copied && (
        <p className="mb-2 text-xs text-emerald-600">Link copied</p>
      )}

      <Menu>
        <MenuButton
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          className={`mb-2 rounded px-2 py-0.5 text-[10px] font-medium capitalize ${priorityStyles[priority]}`}>
          {priority} ▾
        </MenuButton>

        <MenuItems
          anchor="bottom start"
          onClick={(e) => e.stopPropagation()}
          className="z-50 w-28 rounded-md border border-slate-200 bg-white p-1 text-xs shadow-lg focus:outline-none">
          {["high", "medium", "low"].map((p) => (
            <MenuItem key={p}>
              <button
                onClick={() => onSetPriority(p)}
                className="block w-full rounded px-3 py-1.5 text-left capitalize text-slate-700 data-[focus]:bg-sky-50">
                {p}
              </button>
            </MenuItem>
          ))}
        </MenuItems>
      </Menu>

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