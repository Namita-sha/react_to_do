function TaskCard({ task,hasPrev, hasNext, onPrev, onNext }) {
  return (
    <div className="bg-white rounded-lg shadow p-3 text-sm">
      <p className="mb-2">{task.text}</p>
       <div className="flex justify-between">
        <button
          onClick={onPrev}
          disabled={!hasPrev}
          className="px-2 py-1 rounded bg-slate-200 text-xs disabled:opacity-40 disabled:cursor-not-allowed">
          Prev
        </button>
        <button
          onClick={onNext}
          disabled={!hasNext}
          className="px-2 py-1 rounded bg-slate-200 text-xs disabled:opacity-40 disabled:cursor-not-allowed">
          Next
        </button>
      </div>
    </div>
  );
}

export default TaskCard;