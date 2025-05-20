import React, { useState } from 'react';

function HabitForm({ onAddHabit }) {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() === '') {
        alert('Please enter a habit name.');
        return;
    }
    onAddHabit(name);
    setName(''); // Clear the input field after adding
  };

  return (
    <form onSubmit={handleSubmit} className="habit-form-container">
      <input
        type="text"
        id="habitName" // Retain ID for consistency if needed
        placeholder="Enter new habit..."
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button type="submit" id="addHabitButton">Add Habit</button>
    </form>
  );
}

export default HabitForm;