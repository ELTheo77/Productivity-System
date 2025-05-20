import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid'; // For week/day views with time slots
import interactionPlugin from '@fullcalendar/interaction'; // For selectable, draggable, resizable
import EventForm from '../components/calendar/EventForm'; // Import the form

function CalendarPage() {
  const [events, setEvents] = useState(() => {
    // Load events from localStorage on initial render
    const savedEvents = localStorage.getItem('calendarEvents_v4');
    return savedEvents ? JSON.parse(savedEvents) : [];
  });

  const [showForm, setShowForm] = useState(false);
  // This state will hold the event being edited, or null if creating a new one
  const [currentEventForForm, setCurrentEventForForm] = useState(null);
  // This state will hold information from FullCalendar's `select` callback
  const [selectionInfoForForm, setSelectionInfoForForm] = useState(null);

  const calendarRef = useRef(null); // For accessing FullCalendar API if needed

  // Save events to localStorage whenever the events state changes
  useEffect(() => {
    localStorage.setItem('calendarEvents_v4', JSON.stringify(events));
  }, [events]);

  // Handler for when a date or range of dates is selected on the calendar
  const handleDateSelect = (selectInfo) => {
    setShowForm(true);
    setCurrentEventForForm(null); // Clear any existing event being edited
    setSelectionInfoForForm(selectInfo); // Pass selection data to the form
  };

  // Handler for when an existing event is clicked
  const handleEventClick = (clickInfo) => {
    clickInfo.jsEvent.preventDefault(); // Prevent browser navigation for event URLs
    const clickedEvent = events.find(e => e.id === clickInfo.event.id); // Find the event in our state
    if (clickedEvent) {
      // Pass a copy of the event to the form for editing
      setCurrentEventForForm({ ...clickedEvent });
      setSelectionInfoForForm(null); // Clear selection info as we are editing an existing event
      setShowForm(true);
    }
  };
  
  // Handler for when an event is changed by drag-and-drop or resizing
  const handleEventChange = (changeInfo) => {
    const updatedFcEvent = changeInfo.event; // The FullCalendar event object
    setEvents(prevEvents =>
      prevEvents.map(ev =>
        ev.id === updatedFcEvent.id
          ? { // Update the event in our state array
              ...ev, // Spread existing properties first
              title: updatedFcEvent.title,
              start: updatedFcEvent.startStr, // Use string representations from FullCalendar
              end: updatedFcEvent.endStr,
              allDay: updatedFcEvent.allDay,
              backgroundColor: updatedFcEvent.backgroundColor,
              borderColor: updatedFcEvent.borderColor,
              extendedProps: updatedFcEvent.extendedProps,
              description: updatedFcEvent.extendedProps?.description || ev.description, // Preserve description
            }
          : ev
      )
    );
  };

  // Handler for saving a new or edited event from the form
  const handleSaveEvent = (eventDataFromForm) => {
    if (currentEventForForm && currentEventForForm.id) { // Editing existing event
      setEvents(prevEvents =>
        prevEvents.map(ev => (ev.id === currentEventForForm.id ? 
            { ...eventDataFromForm, id: currentEventForForm.id } // Ensure ID is preserved
            : ev))
      );
    } else { // Creating a new event
      setEvents(prevEvents => [
        ...prevEvents,
        { ...eventDataFromForm, id: Date.now().toString() }, // Assign a new ID
      ]);
    }
    // Close form and reset form-related states
    setShowForm(false);
    setCurrentEventForForm(null);
    setSelectionInfoForForm(null);
  };

  // Handler for deleting an event
  const handleDeleteEvent = (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setEvents(prevEvents => prevEvents.filter(ev => ev.id !== eventId));
      setShowForm(false);
      setCurrentEventForForm(null);
      setSelectionInfoForForm(null);
    }
  };

  // Handler for closing the event form
  const handleCloseForm = () => {
    setShowForm(false);
    setCurrentEventForForm(null);
    setSelectionInfoForForm(null);
  };

  return (
    // Use app-container for consistent padding and max-width
    <div className="app-container">
      <div className="calendar-section"> {/* Specific styling for calendar page content */}
        <div className="calendar-header">
          <h1>My Calendar</h1>
          <button 
            onClick={() => { 
              setShowForm(true); 
              setCurrentEventForForm(null); 
              // Provide a sensible default for new event date (e.g., today)
              setSelectionInfoForForm({ startStr: new Date().toISOString().split('T')[0], allDay: true }); 
            }} 
            className="btn-show-form"
          >
            Create New Event
          </button>
        </div>

        {showForm && ( /* Conditionally render the EventForm */
          <EventForm
            event={currentEventForForm}
            selectionInfo={selectionInfoForForm}
            onSave={handleSaveEvent}
            onClose={handleCloseForm}
            onDelete={currentEventForForm ? handleDeleteEvent : null} // Pass delete handler only if editing
          />
        )}

        <div id="calendar"> {/* FullCalendar will mount here */}
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth" // Default view
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay', // View switcher
            }}
            events={events} // Pass the events from React state
            selectable={true} // Allow date selection
            editable={true}  // Allow event dragging and resizing
            select={handleDateSelect} // Callback for date selection
            eventClick={handleEventClick} // Callback for event click
            eventDrop={handleEventChange} // Callback for event drag-n-drop
            eventResize={handleEventChange} // Callback for event resize
            firstDay={1} // Start week on Monday (0 is Sunday)
            eventTimeFormat={{ // Format for event times displayed on the calendar
                hour: 'numeric', // e.g., '9'
                minute: '2-digit', // e.g., '05'
                meridiem: false, // Use 24-hour format
                hour12: false
            }}
            height="auto" // Let the container and CSS manage height
            contentHeight="auto" // Adjusts content height to events
            eventDisplay="block"
          />
        </div>
      </div>
    </div>
  );
}

export default CalendarPage;