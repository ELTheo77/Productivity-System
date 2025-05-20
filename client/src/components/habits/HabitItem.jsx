import React, { useState } from 'react';

function HabitItem({ habit, onDelete, onToggleTrack, onEdit }) {
  const todayKey = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  const isTrackedToday = habit.progress && habit.progress[todayKey];

  // Basic state for inline editing (can be moved to a modal later)
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(habit.name);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (editText.trim() === '') {
        alert('Habit name cannot be empty.');
        setEditText(habit.name); // Reset to original if save fails
        setIsEditing(false);
        return;
    }
    onEdit(habit.id, editText.trim());
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditText(habit.name);
    setIsEditing(false);
  }

  return (
    <li>
      {isEditing ? (
        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <input 
            type="text" 
            value={editText} 
            onChange={(e) => setEditText(e.target.value)} 
            style={{ flexGrow: 1, marginRight: '10px', padding: '6px', border: '1px solid #ccc', borderRadius: '3px' }}
            autoFocus
          />
          <button onClick={handleSaveEdit} style={{ marginRight: '5px', padding: '6px 10px', fontSize:'0.85em' }}>Save</button>
          <button onClick={handleCancelEdit} style={{ padding: '6px 10px', fontSize:'0.85em' }}>Cancel</button>
        </div>
      ) : (
        <>
          <span>{habit.name}</span>
          <div className="habit-actions">
            <button
              className={`track-btn ${isTrackedToday ? 'tracked' : ''}`}
              title={isTrackedToday ? `Untrack for Today (${todayKey})` : `Track for Today (${todayKey})`}
              onClick={() => onToggleTrack(habit.id, todayKey)}
            >
              {isTrackedToday ? 'Tracked' : 'Track'}
            </button>
            <button 
                onClick={handleEdit} 
                title="Edit Habit"
                style={{ backgroundColor: '#ffc107', color: '#212529', borderColor: '#ffc107'}} // Example edit button style
            >
                Edit
            </button>
            <button
              onClick={() => onDelete(habit.id)}
              title="Delete Habit"
              className="btn-danger" // Reusing style from main.css
            >
              Delete
            </button>
          </div>
        </>
      )}
    </li>
  );
}

export default HabitItem;