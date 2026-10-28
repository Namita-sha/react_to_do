function TaskCard({ task }) {
  return (
    <div className="bg-white rounded-lg shadow p-3 text-sm">
      {task.text}
    </div>
  );
}

export default TaskCard;