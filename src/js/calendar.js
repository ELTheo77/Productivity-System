function initializeCalendar(calendarEl, eventFormContainer, eventFormTitle, eventTitleInput, eventStartDateInput, eventStartTimeInput, eventEndDateInput, eventEndTimeInput, eventDescriptionInput, eventColorInput, saveEventButton, deleteEventButton) {
    let calendarEvents = JSON.parse(localStorage.getItem('calendarEvents_v4')) || [];
    let currentlyEditingEventId = null;

    function showEventForm(isEditing = false) {
        eventFormContainer.classList.add('visible');
        if (isEditing) {
            eventFormTitle.textContent = 'Edit Event';
            saveEventButton.textContent = 'Update Event';
            deleteEventButton.style.display = 'inline-block';
        } else {
            eventFormTitle.textContent = 'Add New Event';
            saveEventButton.textContent = 'Save Event';
            deleteEventButton.style.display = 'none';
        }
    }

    function hideEventForm() {
        eventFormContainer.classList.remove('visible');
        clearEventForm();
        currentlyEditingEventId = null;
    }

    function clearEventForm() {
        eventTitleInput.value = '';
        eventStartDateInput.value = '';
        eventStartTimeInput.value = '';
        eventEndDateInput.value = '';
        eventEndTimeInput.value = '';
        eventDescriptionInput.value = '';
        eventColorInput.value = '#007bff';
    }

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
		firstDay: 1, // Sunday is 0, Monday is 1
        headerToolbar: {
            left: 'prev,next',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: calendarEvents,
        selectable: true,
        editable: true,
        eventDisplay: 'block', // Ensure events are rendered as blocks
        height: 'auto', // Adjust height to content
        contentHeight: 'auto', // Adjust content height to content
        eventTimeFormat: { // Example: 09:00
            hour: 'numeric',
            minute: '2-digit',
            meridiem: false, // Use 24-hour format
			hour12: false
        },

        select: function(selectionInfo) {
            clearEventForm();
            currentlyEditingEventId = null; // Ensure we're adding a new event
            eventStartDateInput.value = selectionInfo.startStr.substring(0, 10); //YYYY-MM-DD

            if (selectionInfo.allDay) {
                // For all-day selections, FullCalendar's end date is exclusive.
                // If it's a multi-day all-day selection, adjust the end date for display.
                if (selectionInfo.startStr !== selectionInfo.endStr) {
                    const endDate = new Date(selectionInfo.endStr);
                    endDate.setDate(endDate.getDate() - 1); // Make it inclusive for display
                    eventEndDateInput.value = endDate.toISOString().substring(0, 10);
                }
            } else { // Timed selection
                if (selectionInfo.startStr.includes('T')) {
                    eventStartTimeInput.value = selectionInfo.startStr.substring(11, 16); // HH:mm
                }
                if (selectionInfo.endStr && selectionInfo.endStr.includes('T')) {
                    eventEndDateInput.value = selectionInfo.endStr.substring(0, 10); // YYYY-MM-DD
                    eventEndTimeInput.value = selectionInfo.endStr.substring(11, 16); // HH:mm
                }
            }
            showEventForm(false);
            eventTitleInput.focus();
        },

        eventClick: function(clickInfo) {
            clickInfo.jsEvent.preventDefault(); // Prevent browser navigation for links

            currentlyEditingEventId = clickInfo.event.id;

            eventTitleInput.value = clickInfo.event.title;

            if (clickInfo.event.start) {
                const startDate = clickInfo.event.start;
                eventStartDateInput.value = startDate.toISOString().substring(0, 10);
                if (!clickInfo.event.allDay && clickInfo.event.startStr.includes('T')) {
                    eventStartTimeInput.value = startDate.toTimeString().substring(0, 5); // HH:mm
                } else {
                    eventStartTimeInput.value = '';
                }
            }

            // Handle end date/time population
            if (clickInfo.event.end) {
                const endDate = clickInfo.event.end;
                if (clickInfo.event.allDay) {
                    // For all-day events, FullCalendar stores the end date as the morning of the next day.
                    // For display, we want the actual last day of the event.
                    const displayEndDate = new Date(endDate.valueOf());
                    displayEndDate.setDate(endDate.getDate() - 1);
                    if (displayEndDate.toISOString().substring(0,10) !== eventStartDateInput.value) {
                        eventEndDateInput.value = displayEndDate.toISOString().substring(0, 10);
                    } else {
                        // if end is same as start for allday, don't populate end date
                         eventEndDateInput.value = '';
                    }
                } else {
                     eventEndDateInput.value = endDate.toISOString().substring(0, 10);
                }

                if (!clickInfo.event.allDay && clickInfo.event.endStr.includes('T')) {
                    eventEndTimeInput.value = endDate.toTimeString().substring(0, 5); // HH:mm
                } else {
                    eventEndTimeInput.value = '';
                }
            } else { // No end date/time from FullCalendar
                eventEndDateInput.value = '';
                eventEndTimeInput.value = '';
            }

            eventDescriptionInput.value = clickInfo.event.extendedProps.description || '';
            eventColorInput.value = clickInfo.event.backgroundColor || '#007bff'; // Default color if none set

            showEventForm(true); // Open form in editing mode
            eventTitleInput.focus();
        },

        eventDrop: function(dropInfo) {
            updateEventInStorage(dropInfo.event);
        },
        eventResize: function(resizeInfo) {
            updateEventInStorage(resizeInfo.event);
        }
    });
    calendar.render();

    function saveCalendarEventsToLocalStorage() {
        localStorage.setItem('calendarEvents_v4', JSON.stringify(calendarEvents));
    }

    function updateEventInStorage(changedEvent) {
        const eventIndex = calendarEvents.findIndex(event => event.id === changedEvent.id);
        if (eventIndex > -1) {
            calendarEvents[eventIndex].title = changedEvent.title;
            calendarEvents[eventIndex].start = changedEvent.startStr;
            calendarEvents[eventIndex].end = changedEvent.endStr; // Make sure to get endStr
            calendarEvents[eventIndex].allDay = changedEvent.allDay;
            calendarEvents[eventIndex].backgroundColor = changedEvent.backgroundColor;
            calendarEvents[eventIndex].borderColor = changedEvent.borderColor;
            // extendedProps should be preserved if not directly changed by FullCalendar
            // If you modify extendedProps via the form, ensure they're saved here too.
            saveCalendarEventsToLocalStorage();
        }
    }

    // Expose functions and variables that might be needed by main.js
    return {
        showEventForm,
        hideEventForm,
        clearEventForm,
        saveCalendarEventsToLocalStorage,
        getCalendarInstance: () => calendar, // Allow access to calendar instance if needed
        getCurrentlyEditingEventId: () => currentlyEditingEventId,
        setCurrentlyEditingEventId: (id) => { currentlyEditingEventId = id; },
        getCalendarEvents: () => calendarEvents, // Expose calendarEvents array
        setCalendarEvents: (events) => { calendarEvents = events; } // Allow updating calendarEvents array
    };
}