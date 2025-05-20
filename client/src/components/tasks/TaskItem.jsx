import React from 'react';

function TaskItem({ task, onToggle, onDelete }) {
  return (
    <li className={task.completed ? 'completed' : ''}>
      <span>{task.text}</span>
      <div className="task-actions">
        <button
          className={`toggle-btn ${task.completed ? 'completed-task' : ''}`}
          title={task.completed ? 'Mark Incomplete' : 'Mark Complete'}
          onClick={() => onToggle(task.id)}
        >
          {/* Using text/symbols for checkmark/undo for simplicity, can be replaced with icons */}
          {task.completed ? <>&#x21B6;</> : <>&#x2714;</>} {/* Undo Arrow : Checkmark */}
        </button>
        <button
          className="delete-btn"
          title="Delete Task"
          onClick={() => onDelete(task.id)}
        >
          &#x1F5D1; {/* Trash Can Icon */}
        </button>
      </div>
    </li>
  );
}

export default TaskItem;