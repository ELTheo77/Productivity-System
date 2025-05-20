import React from 'react';

function MainPage() {
  return (
    // The 'app-container' class provides the consistent padding and max-width.
    // The 'main-content' class is for specific styling of this page's content area.
    <div className="app-container">
        <div className="main-content">
            <h1>Welcome to Your Productivity Hub!</h1>
            <p>Select a section from the menu to get started.</p>
            {/* You can add more content or components here later */}
        </div>
    </div>
  );
}

export default MainPage;