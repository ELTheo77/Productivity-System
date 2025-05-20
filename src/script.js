document.addEventListener('DOMContentLoaded', function() {
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
		firstDay: 1,
        headerToolbar: {
            left: 'prev,next',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: calendarEvents,
        selectable: true,
        editable: true,
        eventDisplay: 'block',
        height: 'auto',
        contentHeight: 'auto',
        eventTimeFormat: {
            hour: 'numeric',
            minute: '2-digit',
            meridiem: false,
			hour12: false
        },

        select: function(selectionInfo) {
            clearEventForm();
            currentlyEditingEventId = null;
            eventStartDateInput.value = selectionInfo.startStr.substring(0, 10);

            if (selectionInfo.allDay) {
                if (selectionInfo.startStr !== selectionInfo.endStr) {
                    const endDate = new Date(selectionInfo.endStr);
                    endDate.setDate(endDate.getDate() - 1);
                    eventEndDateInput.value = endDate.toISOString().substring(0, 10);
                }
            } else {
                if (selectionInfo.startStr.includes('T')) {
                    eventStartTimeInput.value = selectionInfo.startStr.substring(11, 16);
                }
                if (selectionInfo.endStr && selectionInfo.endStr.includes('T')) {
                    eventEndDateInput.value = selectionInfo.endStr.substring(0, 10);
                    eventEndTimeInput.value = selectionInfo.endStr.substring(11, 16);
                }
            }
            showEventForm(false);
            eventTitleInput.focus();
        },

        eventClick: function(clickInfo) {
            clickInfo.jsEvent.preventDefault();

            currentlyEditingEventId = clickInfo.event.id;

            eventTitleInput.value = clickInfo.event.title;

            if (clickInfo.event.start) {
                const startDate = clickInfo.event.start;
                eventStartDateInput.value = startDate.toISOString().substring(0, 10);
                if (!clickInfo.event.allDay && clickInfo.event.startStr.includes('T')) {
                    eventStartTimeInput.value = startDate.toTimeString().substring(0, 5);
                } else {
                    eventStartTimeInput.value = '';
                }
            }

            if (clickInfo.event.end) {
                const endDate = clickInfo.event.end;
                if (clickInfo.event.allDay) {
                    const displayEndDate = new Date(endDate.valueOf());
                    displayEndDate.setDate(endDate.getDate() - 1);
                    if (displayEndDate.toISOString().substring(0,10) !== eventStartDateInput.value) {
                        eventEndDateInput.value = displayEndDate.toISOString().substring(0, 10);
                    } else {
                        eventEndDateInput.value = '';
                    }
                } else {
                     eventEndDateInput.value = endDate.toISOString().substring(0, 10);
                }

                if (!clickInfo.event.allDay && clickInfo.event.endStr.includes('T')) {
                    eventEndTimeInput.value = endDate.toTimeString().substring(0, 5);
                } else {
                    eventEndTimeInput.value = '';
                }
            } else {
                eventEndDateInput.value = '';
                eventEndTimeInput.value = '';
            }

            eventDescriptionInput.value = clickInfo.event.extendedProps.description || '';
            eventColorInput.value = clickInfo.event.backgroundColor || '#007bff';

            showEventForm(true);
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
            calendarEvents[eventIndex].end = changedEvent.endStr;
            calendarEvents[eventIndex].allDay = changedEvent.allDay;
            calendarEvents[eventIndex].backgroundColor = changedEvent.backgroundColor;
            calendarEvents[eventIndex].borderColor = changedEvent.borderColor;
            saveCalendarEventsToLocalStorage();
        }
    }

    showEventFormButton.addEventListener('click', function() {
        clearEventForm();
        currentlyEditingEventId = null;
        eventStartDateInput.value = new Date().toISOString().split('T')[0];
        showEventForm(false);
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
        let isAllDay = true;
        if (startTimeValue || endTimeValue) { isAllDay = false; }

        if (endDateValue) {
            endISO = endDateValue;
            if (endTimeValue) {
                endISO += 'T' + endTimeValue + ':00';
            } else if (startTimeValue && !isAllDay) {
                endISO += 'T' + startTimeValue + ':00';
            }
        } else if (startTimeValue) {
            isAllDay = false;
        }
        
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
            borderColor: color,
            extendedProps: {
                description: description
            }
        };
        
        if (eventData.allDay && eventData.end) {
            const endCheck = new Date(eventData.end);
            if (eventData.start.substring(0,10) !== eventData.end.substring(0,10) ) {
                 endCheck.setDate(endCheck.getDate() + 1);
                 eventData.end = endCheck.toISOString().split('T')[0];
            } else {
                 eventData.end = null;
            }
        }


        if (currentlyEditingEventId) {
            const eventToUpdate = calendar.getEventById(currentlyEditingEventId);
            if (eventToUpdate) {
                eventToUpdate.setProp('title', eventData.title);
                eventToUpdate.setStart(eventData.start);
                eventToUpdate.setEnd(eventData.end);
                eventToUpdate.setAllDay(eventData.allDay);
                eventToUpdate.setProp('backgroundColor', eventData.backgroundColor);
                eventToUpdate.setProp('borderColor', eventData.borderColor);
                eventToUpdate.setExtendedProp('description', eventData.extendedProps.description);

                const eventIndex = calendarEvents.findIndex(ev => ev.id === currentlyEditingEventId);
                if (eventIndex > -1) {
                    calendarEvents[eventIndex] = {
                        id: currentlyEditingEventId,
                        title: eventData.title,
                        start: eventToUpdate.startStr,
                        end: eventToUpdate.endStr,
                        allDay: eventToUpdate.allDay,
                        backgroundColor: eventData.backgroundColor,
                        borderColor: eventData.borderColor,
                        extendedProps: eventData.extendedProps
                    };
                }
            }
        } else {
            const newEventForCalendar = {
                ...eventData,
                id: Date.now().toString(),
            };
            calendarEvents.push(newEventForCalendar);
            calendar.addEvent(newEventForCalendar);
        }

        saveCalendarEventsToLocalStorage();
        hideEventForm();
    });

    cancelEventFormButton.addEventListener('click', function() {
        hideEventForm();
    });

    deleteEventButton.addEventListener('click', function() {
        if (!currentlyEditingEventId) return;

        if (confirm('Are you sure you want to delete this event?')) {
            const eventToDelete = calendar.getEventById(currentlyEditingEventId);
            if (eventToDelete) {
                eventToDelete.remove();
            }
            calendarEvents = calendarEvents.filter(event => event.id !== currentlyEditingEventId);
            saveCalendarEventsToLocalStorage();
            hideEventForm();
        }
    });


    const taskInput = document.getElementById('taskInput');
    const addTaskButton = document.getElementById('addTaskButton');
    const taskListUl = document.getElementById('taskList');
    let tasks = JSON.parse(localStorage.getItem('tasks_v4')) || [];

    function saveTasksToLocalStorage() { localStorage.setItem('tasks_v4', JSON.stringify(tasks)); }
    function renderTasks() {
        taskListUl.innerHTML = '';
        if (tasks.length === 0) {
            const li = document.createElement('li');
            li.textContent = "No tasks yet!";
            li.style.textAlign = "center";
            li.style.color = "#888";
            taskListUl.appendChild(li);
            return;
        }
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = task.completed ? 'completed' : '';
            const taskSpan = document.createElement('span');
            taskSpan.textContent = task.text;
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'task-actions';
            const toggleButton = document.createElement('button');
            toggleButton.className = 'toggle-btn' + (task.completed ? ' completed-task' : '');
            toggleButton.innerHTML = task.completed ? '&#x21B6;' : '&#x2714;';
            toggleButton.title = task.completed ? 'Mark Incomplete' : 'Mark Complete';
            toggleButton.onclick = () => {
                tasks[index].completed = !tasks[index].completed;
                saveTasksToLocalStorage(); renderTasks();
            };
            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-btn';
            deleteButton.innerHTML = '&#x1F5D1;';
            deleteButton.title = 'Delete Task';
            deleteButton.onclick = () => {
                tasks.splice(index, 1);
                saveTasksToLocalStorage(); renderTasks();
            };
            actionsDiv.appendChild(toggleButton); actionsDiv.appendChild(deleteButton);
            li.appendChild(taskSpan); li.appendChild(actionsDiv);
            taskListUl.appendChild(li);
        });
    }
    addTaskButton.onclick = () => {
        const text = taskInput.value.trim();
        if (text) { tasks.push({text: text, completed: false}); taskInput.value = ''; saveTasksToLocalStorage(); renderTasks(); }
        else { alert('Please enter a task.'); }
    };
    taskInput.onkeypress = (e) => { if (e.key === 'Enter') addTaskButton.click(); };
    renderTasks();
});
