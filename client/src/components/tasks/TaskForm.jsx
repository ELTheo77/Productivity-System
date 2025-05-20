import React, { useState } from 'react';

function TaskForm({ onAddTask }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission which reloads the page
    onAddTask(text);
    setText(''); // Clear the input field after adding
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <input
        type="text"
        id="taskInput" // Retaining ID for consistency with original CSS/JS if needed
        placeholder="New task..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit" id="addTaskButton">Add Task</button>
    </form>
  );
}

export default TaskForm;