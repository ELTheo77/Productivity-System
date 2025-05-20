// client/src/pages/TasksPage.jsx
import React, { useState, useEffect } from 'react';
import TaskForm from '../components/tasks/TaskForm';
import TaskItem from '../components/tasks/TaskItem';

function TasksPage() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks_v4');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  useEffect(() => {
    localStorage.setItem('tasks_v4', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (text) => {
    if (text.trim()) {
      const newTask = { 
        id: Date.now().toString(),
        text: text.trim(), 
        completed: false 
      };
      setTasks(prevTasks => [...prevTasks, newTask]);
    } else {
      alert('Please enter a task.');
    }
  };

  const handleToggleTask = (taskId) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (taskId) => {
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  return (
    // Use app-container for overall page padding and max-width from main.css
    <div className="app-container"> 
      <div className="tasks-page-container"> {/* New wrapper for layout */}
        <div className="todo-section"> 
          <h1>To-Do List</h1>
          <TaskForm onAddTask={handleAddTask} />
          <ul id="taskList">
            {tasks.length === 0 ? (
              <li style={{ textAlign: 'center', color: '#888', borderBottom: 'none', padding: '20px 0' }}>
                No tasks yet! Add one above.
              </li>
            ) : (
              tasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={handleToggleTask}
                  onDelete={handleDeleteTask}
                />
              ))
            )}
          </ul>
        </div>
        
        {/* Placeholder for future visualizations section */}
        {/* <div className="visualization-section">
          <h2>Visualizations</h2>
          <p>Charts and graphs will go here.</p>
        </div> */}
      </div>
    </div>
  );
}

export default TasksPage;