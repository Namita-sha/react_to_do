import { useState, useRef, useEffect } from "react";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TaskCard from "./TaskCard";

function Column({ column, isSource, isOver, prevId, nextId, onAddTask, onMoveTask, onRenameColumn, onDeleteColumn, onDeleteTask }) {
  const [text, setText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(column.title);
  const renameRef = useRef(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.id, data: { type: "column" } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  useEffect(() => {
    if (isEditing) {
      const id = setTimeout(() => renameRef.current?.select(), 0);
      return () => clearTimeout(id);
    }
  }, [isEditing]);

  //add
  function handleAdd() {
    onAddTask(column.id, text);
    setText("");
  }

  //rename
  function startEdit() {
    setEditTitle(column.title);
    setIsEditing(true);
  }

  function saveEdit() {
    onRenameColumn(column.id, editTitle);
    setIsEditing(false);
  }

  function cancelEdit() {
    setIsEditing(false);
  }

  return (
    <div
      
      ref={setNodeRef}
      style={style}
      className={`relative w-72 shrink-0 rounded-xl p-3 border-2 transition-colors ${isDragging
        ? "bg-sky-50 border-dashed border-sky-400"
        : isOver
          ? "bg-indigo-100 border-indigo-400"
          : isSource
            ? "bg-sky-50 border-dashed border-sky-500"
            : "bg-sky-100/60 border-transparent"
        }`}>
          {isSource && (
        <p className="absolute -top-3 left-3 rounded bg-sky-500 px-2 py-0.5 text-[10px] font-medium text-white">
          Dragged from here
        </p>
      )}
      {isDragging && (
        <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-sky-500">
          Moving "{column.title}"...
        </div>
      )}

      <div className={isDragging ? "invisible" : ""}>
        <Menu>
          <MenuButton
            aria-label="Column options"
            className="absolute top-2 right-2 px-2 py-1 rounded text-slate-500 hover:bg-sky-200/60 leading-none">
            ⋮
          </MenuButton>

          <MenuItems
            anchor="bottom end"
            className="z-50 w-44 rounded-md border border-slate-200 bg-white p-1 text-sm shadow-lg focus:outline-none">
            <MenuItem>
              <button
                onClick={startEdit}
                className="block w-full rounded px-3 py-1.5 text-left text-slate-700 data-[focus]:bg-sky-50">
                Rename column
              </button>
            </MenuItem>

            <MenuItem>
              <button
                onClick={() => onDeleteColumn(column.id)}
                className="block w-full rounded px-3 py-1.5 text-left text-rose-600 data-[focus]:bg-rose-50">
                Delete column
              </button>
            </MenuItem>
          </MenuItems>
        </Menu>

        {/* header: drag handle + title */}
        <div className="flex items-center gap-2 mb-3 pr-8">
          <button
            ref={setActivatorNodeRef}
            {...attributes}
            {...listeners}
            aria-label="Drag column"
            className="cursor-grab touch-none text-slate-400 hover:text-slate-600">
            ⠿
          </button>

          {isEditing ? (
            <input
              ref={renameRef}
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveEdit();
                if (e.key === "Escape") cancelEdit();
              }}
              onBlur={cancelEdit}
              className="border rounded px-2 py-0.5 flex-1 min-w-0 text-sm font-semibold"
            />
          ) : (
            <h2 className="font-semibold text-slate-700">{column.title}</h2>
          )}
        </div>

        {/* input row and add button */}
        <div className="flex gap-2 mb-3">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
            }}
            placeholder="New task..."
            className="border border-sky-200 bg-white rounded px-2 py-1 flex-1 min-w-0 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
          <button
            onClick={handleAdd}
            className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded px-3 py-1 text-sm">
            Add
          </button>
        </div>

        <SortableContext
          items={column.tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-2">
            {column.tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                hasPrev={Boolean(prevId)}
                hasNext={Boolean(nextId)}
                onPrev={() => onMoveTask(task.id, column.id, prevId)}
                onNext={() => onMoveTask(task.id, column.id, nextId)}
                onDelete={() => onDeleteTask(column.id, task.id)}
              />
            ))}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}

export default Column;