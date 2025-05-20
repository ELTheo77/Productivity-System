import React from 'react';
import { NavLink } from 'react-router-dom'; // NavLink provides styling for active links

function Navigation() {
  return (
    <nav className="main-nav">
      <ul>
        <li><NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>Home</NavLink></li>
        <li><NavLink to="/calendar" className={({ isActive }) => isActive ? "active" : ""}>Calendar</NavLink></li>
        <li><NavLink to="/tasks" className={({ isActive }) => isActive ? "active" : ""}>Tasks</NavLink></li>
        <li><NavLink to="/habits" className={({ isActive }) => isActive ? "active" : ""}>Habits</NavLink></li>
      </ul>
    </nav>
  );
}

export default Navigation;