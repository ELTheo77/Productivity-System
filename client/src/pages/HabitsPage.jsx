import React, { useState, useEffect } from 'react';
import HabitForm from '../components/habits/HabitForm';
import HabitItem from '../components/habits/HabitItem';
// import './habits.css'; // Alternative: import CSS directly

function HabitsPage() {
  const [habits, setHabits] = useState(() => {
    const savedHabits = localStorage.getItem('habits_v1'); // Using a new key for habits
    return savedHabits ? JSON.parse(savedHabits) : [];
  });

  useEffect(() => {
    localStorage.setItem('habits_v1', JSON.stringify(habits));
  }, [habits]);

  const handleAddHabit = (name) => {
    if (name.trim()) {
      const newHabit = {
        id: Date.now().toString(),
        name: name.trim(),
        progress: {}, // { 'YYYY-MM-DD': true/false }
        // Future: add color, category, target, etc.
      };
      setHabits(prevHabits => [...prevHabits, newHabit]);
    } else {
      alert('Please enter a habit name.');
    }
  };

  const handleDeleteHabit = (habitId) => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      setHabits(prevHabits => prevHabits.filter(habit => habit.id !== habitId));
    }
  };

  const handleToggleTrackHabit = (habitId, dateKey) => {
    // dateKey should be in 'YYYY-MM-DD' format
    setHabits(prevHabits =>
      prevHabits.map(habit => {
        if (habit.id === habitId) {
          const newProgress = { ...habit.progress };
          newProgress[dateKey] = !newProgress[dateKey]; // Toggle true/false
          return { ...habit, progress: newProgress };
        }
        return habit;
      })
    );
  };

  // Placeholder for editing a habit
  const handleEditHabit = (habitId, newName) => {
    setHabits(prevHabits =>
      prevHabits.map(habit =>
        habit.id === habitId ? { ...habit, name: newName } : habit
      )
    );
    // console.log(`Edit habit ${habitId} to ${newName} - UI for this needs to be built`);
  };


  return (
    // Use app-container for consistent padding and max-width from main.css
    <div className="app-container">
      <div className="habits-section"> {/* Specific styling for habits page content */}
        <h1>Habit Tracker</h1>
        <p>Add new habits and track your daily progress.</p>
        <HabitForm onAddHabit={handleAddHabit} />
        <ul id="habitList">
          {habits.length === 0 ? (
            <li style={{ textAlign: 'center', color: '#888', borderBottom: 'none', padding: '20px 0' }}>
              No habits yet. Add one above!
            </li>
          ) : (
            habits.map(habit => (
              <HabitItem
                key={habit.id}
                habit={habit}
                onDelete={handleDeleteHabit}
                onToggleTrack={handleToggleTrackHabit}
                onEdit={handleEditHabit} // Pass edit handler
              />
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default HabitsPage;