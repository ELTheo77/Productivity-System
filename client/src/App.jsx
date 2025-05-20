import React from 'react';
import { Routes, Route } from 'react-router-dom';

// We will create these components in the next steps
import Navigation from './components/Navigation';
import MainPage from './pages/MainPage';
import CalendarPage from './pages/CalendarPage';
import TasksPage from './pages/TasksPage';
import HabitsPage from './pages/HabitsPage';

// Import feature-specific CSS that applies broadly or if not imported by specific pages/components
// Alternatively, each page can import its own specific CSS.
import './css/calendar.css';
import './css/tasks.css';
import './css/habits.css';

function App() {
  return (
    <>
      <Navigation /> {/* Shared navigation across all pages */}
      <div className="page-container"> {/* Wrapper for content below the nav */}
        {/* The 'app-container' class from your original CSS can be applied here or within each page */}
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/habits" element={<HabitsPage />} />
          {/* Default route if no other matches, often same as "/" */}
          <Route index element={<MainPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;