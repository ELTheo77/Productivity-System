# Productivity System

This is a personal productivity application designed to help manage events, tasks, and eventually, much more. It started as a personal project, but hopefully will evolve into much more.

## Current Features

* **Interactive Calendar:**
    * View events by month, week, or day
    * Add new events with title, start/end dates & times, description, and color-coding
    * Edit existing events directly from the calendar
    * Delete events
    * Drag & drop events to reschedule
* **To-Do List:**
    * Add new tasks
    * Mark tasks as complete/incomplete
    * Delete tasks
* **Data Persistence:**
    * Events and tasks are saved locally in the browser's `localStorage`

## Technologies Used

* **Frontend:** HTML5, CSS3, JavaScript (ES6+)
* **Calendar:** [FullCalendar](https://fullcalendar.io/) library
* **Data Storage:** Browser LocalStorage (for now)

## Setup and Run

Currently, the application is a pure frontend project. To run it locally:

1.  **Clone the repository (or download the files):**
    ```bash
    git clone https://github.com/ELTheo77/Productivity-System.git
    cd productivity-system
    ```
2.  **Open `index.html` in your web browser:**
    * Navigate to the project directory in your file explorer
    * Double-click the `index.html` file, or right-click and choose "Open with" your preferred browser

No build steps or dependencies (other than the included FullCalendar library) are required at this stage.

## Future Roadmap

### Near Future / Next Changes:

* **Recurring Events:** Implement functionality for daily, weekly, monthly, and yearly recurring events in the calendar
* **Task Categories/Labels:** Allow users to assign categories or labels to tasks for better organization and filtering
* **Task Importance/Urgency:** Add a way to mark tasks by importance or urgency and sort/filter accordingly
* **Habit Tracker:**
    * Add, edit, and delete habits
    * Track daily progress for each habit
* **Backend & Database Integration:** Introduce a backend service and database for persistent data storage, enabling data access across devices and sessions (moving beyond `localStorage`)

### Further Future:

* **Integrations:**
    * Connect with Gmail, Outlook, and other social media platforms to streamline task and event creation.
* **AI Agent:**
    * Develop an AI agent trained on user preferences to:
        * Automatically add tasks or suggest events based on email/social content
        * Send intelligent notifications for important items
        * Suggest calendar or task management optimizations
        * This will likely involve a combination of custom ML algorithms and existing LLMs
* **AI Task Completion (Long-term Vision):**
    * Enable the AI agent to complete simple tasks on behalf of the user, such as drafting emails, scheduling basic follow-ups, etc.

## Contributing

This is currently a personal project. However, if you have suggestions or find bugs, feel free to open an issue in the GitHub repository.

## License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.