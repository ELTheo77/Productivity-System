document.addEventListener('DOMContentLoaded', function() {
    // Calendar related DOM elements
    const calendarEl = document.getElementById('calendar');
    const eventFormContainer = document.getElementById('eventFormContainer');
    const eventFormTitle = document.getElementById('eventFormTitle');
    const eventTitleInput = document.getElementById('eventTitle');
    const eventStartDateInput = document.getElementById('eventStartDate');
    const eventStartTimeInput = document.getElementById('eventStartTime');
    const eventEndDateInput = document.getElementById('eventEndDate');
    const eventEndTimeInput = document.getElementById('eventEndTime');
    const eventDescriptionInput = document.getElementById('eventDescription');
    const eventColorInput = document.getElementById('eventColor');
    const saveEventButton = document.getElementById('saveEventButton');
    const cancelEventFormButton = document.getElementById('cancelEventFormButton');
    const showEventFormButton = document.getElementById('showEventFormButton');
    const deleteEventButton = document.getElementById('deleteEventButton');

    // Initialize Calendar
    const calendarManager = initializeCalendar(
        calendarEl, eventFormContainer, eventFormTitle, eventTitleInput,
        eventStartDateInput, eventStartTimeInput, eventEndDateInput, eventEndTimeInput,
        eventDescriptionInput, eventColorInput, saveEventButton, deleteEventButton
    );

    // Event listeners that are primarily for the calendar but were in the global scope
    showEventFormButton.addEventListener('click', function() {
        calendarManager.clearEventForm();
        calendarManager.setCurrentlyEditingEventId(null);
        eventStartDateInput.value = new Date().toISOString().split('T')[0]; // Default to today
        calendarManager.showEventForm(false);
        eventTitleInput.focus();
    });

    saveEventButton.addEventListener('click', function() {
        const title = eventTitleInput.value.trim();
        const startDateValue = eventStartDateInput.value;
        const startTimeValue = eventStartTimeInput.value;
        let endDateValue = eventEndDateInput.value;
        let endTimeValue = eventEndTimeInput.value;
        const description = eventDescriptionInput.value.trim();
        const color = eventColorInput.value;

        if (!title || !startDateValue) {
            alert('Please enter a title and start date.');
            return;
        }

        let startISO = startDateValue;
        if (startTimeValue) { startISO += 'T' + startTimeValue + ':00'; }

        let endISO = null;
        let isAllDay = true; // Assume all-day unless time is specified
        if (startTimeValue || endTimeValue) { // If either time is set, it's not all-day
            isAllDay = false;
        }
        
        // Construct endISO based on inputs
        if (endDateValue) {
            endISO = endDateValue;
            if (endTimeValue) {
                endISO += 'T' + endTimeValue + ':00';
            } else if (startTimeValue && !isAllDay) { // If start time given for a non-all-day event, use it for end time if end time is blank
                endISO += 'T' + startTimeValue + ':00';
            }
        } else if (startTimeValue) { // If no end date, but start time exists, it implies a timed event on the start day.
            isAllDay = false; // Not all-day if there's a start time without an end date.
            // FullCalendar handles null end for timed events correctly (defaults to a duration)
        }
        
        // Validate that end date/time is not before start date/time
        if (endISO && new Date(endISO) < new Date(startISO)) {
            alert('End date/time cannot be before start date/time.');
            return;
        }


        const eventData = {
            title: title,
            start: startISO,
            end: endISO,
            allDay: isAllDay,
            backgroundColor: color,
            borderColor: color, // Typically same as background for simple events
            extendedProps: {
                description: description
            }
        };
        
        // Adjust end date for all-day events for FullCalendar
        // FullCalendar expects the end of an all-day event to be the start of the next day.
        // If the user picked the same day for start and end for an all-day event,
        // FullCalendar treats it as a single day event.
        // If they pick an end date, we need to make it exclusive by adding a day.
        if (eventData.allDay && eventData.end) {
            const endCheck = new Date(eventData.end);
            // Only add a day if the event spans multiple days (start and end are different)
            // OR if it's a single day event and an end date was explicitly provided (even if same as start)
            if (eventData.start.substring(0,10) !== eventData.end.substring(0,10) ) {
                 endCheck.setDate(endCheck.getDate() + 1);
                 eventData.end = endCheck.toISOString().split('T')[0]; // Format as YYYY-MM-DD
            } else {
                 // If it's a single day all-day event, FullCalendar is fine with start date only,
                 // or end date being the same as start. For consistency, we can set end to null
                 // or the start of the next day. Let's set to null if it's same day.
                 eventData.end = null;
            }
        }


        const currentlyEditingEventId = calendarManager.getCurrentlyEditingEventId();
        const calendarInstance = calendarManager.getCalendarInstance();
        let calendarEventsArray = calendarManager.getCalendarEvents();


        if (currentlyEditingEventId) {
            const eventToUpdate = calendarInstance.getEventById(currentlyEditingEventId);
            if (eventToUpdate) {
                eventToUpdate.setProp('title', eventData.title);
                eventToUpdate.setStart(eventData.start);
                eventToUpdate.setEnd(eventData.end);
                eventToUpdate.setAllDay(eventData.allDay);
                eventToUpdate.setProp('backgroundColor', eventData.backgroundColor);
                eventToUpdate.setProp('borderColor', eventData.borderColor);
                eventToUpdate.setExtendedProp('description', eventData.extendedProps.description);

                // Update in our source array
                const eventIndex = calendarEventsArray.findIndex(ev => ev.id === currentlyEditingEventId);
                if (eventIndex > -1) {
                    calendarEventsArray[eventIndex] = {
                        id: currentlyEditingEventId,
                        title: eventData.title,
                        start: eventToUpdate.startStr, // Use startStr from FullCalendar event for accuracy
                        end: eventToUpdate.endStr,     // Use endStr from FullCalendar event
                        allDay: eventToUpdate.allDay,
                        backgroundColor: eventData.backgroundColor,
                        borderColor: eventData.borderColor,
                        extendedProps: eventData.extendedProps
                    };
                }
            }
        } else {
            // Add new event
            const newEventForCalendar = {
                ...eventData,
                id: Date.now().toString(), // Simple unique ID
            };
            calendarEventsArray.push(newEventForCalendar); // Add to our source array
            calendarInstance.addEvent(newEventForCalendar);
        }
        
        calendarManager.setCalendarEvents(calendarEventsArray); // Update the manager's copy
        calendarManager.saveCalendarEventsToLocalStorage();
        calendarManager.hideEventForm();
    });

    cancelEventFormButton.addEventListener('click', function() {
        calendarManager.hideEventForm();
    });

    deleteEventButton.addEventListener('click', function() {
        const currentlyEditingEventId = calendarManager.getCurrentlyEditingEventId();
        if (!currentlyEditingEventId) return;

        if (confirm('Are you sure you want to delete this event?')) {
            const calendarInstance = calendarManager.getCalendarInstance();
            const eventToDelete = calendarInstance.getEventById(currentlyEditingEventId);
            if (eventToDelete) {
                eventToDelete.remove(); // Remove from FullCalendar
            }
            // Remove from our source array
            let calendarEventsArray = calendarManager.getCalendarEvents();
            calendarEventsArray = calendarEventsArray.filter(event => event.id !== currentlyEditingEventId);
            calendarManager.setCalendarEvents(calendarEventsArray); // Update the manager's copy

            calendarManager.saveCalendarEventsToLocalStorage();
            calendarManager.hideEventForm();
        }
    });


    // Tasks related DOM elements
    const taskInput = document.getElementById('taskInput');
    const addTaskButton = document.getElementById('addTaskButton');
    const taskListUl = document.getElementById('taskList');

    // Initialize Tasks
    initializeTasks(taskInput, addTaskButton, taskListUl);

    // Future: Initialize Habits
    // const habitManager = initializeHabits(...);
});