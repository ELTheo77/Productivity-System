document.addEventListener('DOMContentLoaded', function() {

    const currentPagePath = window.location.pathname;
    const navLinks = document.querySelectorAll('.main-nav ul li a');

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (currentPagePath.endsWith(linkPath)) {
            link.classList.add('active');
        }
    });


    if (document.getElementById('calendar')) {
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

        if (typeof initializeCalendar === 'function') {
            const calendarManager = initializeCalendar(
                calendarEl, eventFormContainer, eventFormTitle, eventTitleInput,
                eventStartDateInput, eventStartTimeInput, eventEndDateInput, eventEndTimeInput,
                eventDescriptionInput, eventColorInput, saveEventButton, deleteEventButton
            );

            if (showEventFormButton) {
                showEventFormButton.addEventListener('click', function() {
                    calendarManager.clearEventForm();
                    calendarManager.setCurrentlyEditingEventId(null);
                    eventStartDateInput.value = new Date().toISOString().split('T')[0];
                    calendarManager.showEventForm(false);
                    if(eventTitleInput) eventTitleInput.focus();
                });
            }

            if (saveEventButton) {
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
                    if (startTimeValue || endTimeValue) {
                        isAllDay = false;
                    }

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

                            const eventIndex = calendarEventsArray.findIndex(ev => ev.id === currentlyEditingEventId);
                            if (eventIndex > -1) {
                                calendarEventsArray[eventIndex] = {
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
                        calendarEventsArray.push(newEventForCalendar);
                        calendarInstance.addEvent(newEventForCalendar);
                    }

                    calendarManager.setCalendarEvents(calendarEventsArray);
                    calendarManager.saveCalendarEventsToLocalStorage();
                    calendarManager.hideEventForm();
                });
            }

            if (cancelEventFormButton) {
                cancelEventFormButton.addEventListener('click', function() {
                    calendarManager.hideEventForm();
                });
            }

            if (deleteEventButton) {
                deleteEventButton.addEventListener('click', function() {
                    const currentlyEditingEventId = calendarManager.getCurrentlyEditingEventId();
                    if (!currentlyEditingEventId) return;

                    if (confirm('Are you sure you want to delete this event?')) {
                        const calendarInstance = calendarManager.getCalendarInstance();
                        const eventToDelete = calendarInstance.getEventById(currentlyEditingEventId);
                        if (eventToDelete) {
                            eventToDelete.remove();
                        }
                        let calendarEventsArray = calendarManager.getCalendarEvents();
                        calendarEventsArray = calendarEventsArray.filter(event => event.id !== currentlyEditingEventId);
                        calendarManager.setCalendarEvents(calendarEventsArray);

                        calendarManager.saveCalendarEventsToLocalStorage();
                        calendarManager.hideEventForm();
                    }
                });
            }
        } else {
        }
    }

    if (document.getElementById('taskList')) {
        const taskInput = document.getElementById('taskInput');
        const addTaskButton = document.getElementById('addTaskButton');
        const taskListUl = document.getElementById('taskList');

        if (typeof initializeTasks === 'function') {
            initializeTasks(taskInput, addTaskButton, taskListUl);
        } else {
        }
    }

    if (document.getElementById('habitList')) {
        const habitNameInput = document.getElementById('habitName');
        const addHabitButton = document.getElementById('addHabitButton');
        const habitListUl = document.getElementById('habitList');
        if (typeof initializeHabits === 'function') {
             initializeHabits(habitNameInput, addHabitButton, habitListUl);
        } else {
        }
    }
});