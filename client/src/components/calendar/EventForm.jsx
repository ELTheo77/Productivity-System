import React, { useState, useEffect } from 'react';

const paletteColors = [
  // Reds & Pinks
  { value: '#dc3545', name: 'Red' },        // Original Red (Danger)
  { value: '#f08080', name: 'Light Coral' },
  { value: '#ff69b4', name: 'Hot Pink' },
  { value: '#ffc0cb', name: 'Pink' },
  // Oranges & Yellows
  { value: '#fd7e14', name: 'Orange' },     // Original Orange
  { value: '#ffa500', name: 'Orange (Web)' },
  { value: '#ffc107', name: 'Amber' },
  { value: '#fffacd', name: 'Lemon Chiffon' },
  // Greens
  { value: '#28a745', name: 'Green' },      // Original Green (Success)
  { value: '#20c997', name: 'Teal Green' },
  { value: '#90ee90', name: 'Light Green' },
  { value: '#3cb371', name: 'Medium Sea Green' },
  // Blues & Teals
  { value: '#007bff', name: 'Blue' },       // Original Blue (Primary)
  { value: '#17a2b8', name: 'Teal' },       // Original Teal (Info)
  { value: '#0dcaf0', name: 'Cyan Info' },
  { value: '#add8e6', name: 'Light Blue' },
  { value: '#4169e1', name: 'Royal Blue' },
  // Purples
  { value: '#6f42c1', name: 'Purple' },     // Original Purple
  { value: '#8a2be2', name: 'Blue Violet' },
  { value: '#dda0dd', name: 'Plum' },
  { value: '#e6e6fa', name: 'Lavender' },
  // Browns & Grays
  { value: '#a52a2a', name: 'Brown' },
  { value: '#d2b48c', name: 'Tan' },
  { value: '#6c757d', name: 'Gray' },
  { value: '#343a40', name: 'Dark Gray' },  // Original Dark Gray
  { value: '#d3d3d3', name: 'Light Gray' },
];

function EventForm({ event: initialEvent, selectionInfo, onSave, onClose, onDelete }) {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#007bff');
  const [isAllDay, setIsAllDay] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (initialEvent) { // Editing existing event
      setIsEditing(true);
      setTitle(initialEvent.title || '');
      setIsAllDay(initialEvent.allDay || false);

      if (initialEvent.start) {
        const startDt = new Date(initialEvent.start);
        setStartDate(startDt.toISOString().split('T')[0]);
        if (!initialEvent.allDay && initialEvent.start.includes('T')) {
          // Format to HH:mm
          setStartTime(startDt.toTimeString().split(' ')[0].substring(0,5));
        } else {
          setStartTime('');
        }
      } else {
        setStartDate('');
        setStartTime('');
      }

      if (initialEvent.end) {
        const endDt = new Date(initialEvent.end);
        if (initialEvent.allDay) {
            // FullCalendar's allDay end is exclusive (start of next day).
            // For form display, make it inclusive (actual last day of event).
            const inclusiveEndDt = new Date(endDt.valueOf());
            // Only subtract a day if it's not the same day as start or if it was originally different
            if (initialEvent.start.split('T')[0] !== endDt.toISOString().split('T')[0] || 
                (new Date(initialEvent.start).valueOf() !== endDt.valueOf() - 86400000)) {
                 inclusiveEndDt.setDate(inclusiveEndDt.getDate() -1);
            }
             // Only set if it's different from start for multi-day all-day events
            if (initialEvent.start.split('T')[0] !== inclusiveEndDt.toISOString().split('T')[0]) {
                 setEndDate(inclusiveEndDt.toISOString().split('T')[0]);
            } else {
                 setEndDate(''); // Single day all-day, no end date needed in form
            }
        } else { // Timed event
            setEndDate(endDt.toISOString().split('T')[0]);
        }

        if (!initialEvent.allDay && initialEvent.end.includes('T')) {
          setEndTime(endDt.toTimeString().split(' ')[0].substring(0,5));
        } else {
          setEndTime('');
        }
      } else { // No end date provided from initialEvent (e.g. single all-day event from storage)
        setEndDate('');
        setEndTime('');
      }
      
      setDescription(initialEvent.extendedProps?.description || initialEvent.description || '');
      setColor(initialEvent.backgroundColor || '#007bff');

    } else if (selectionInfo) { // New event from calendar date selection
        setIsEditing(false);
        setTitle('');
        setIsAllDay(selectionInfo.allDay);
        
        const start = new Date(selectionInfo.startStr);
        setStartDate(start.toISOString().split('T')[0]);
        if (!selectionInfo.allDay && selectionInfo.startStr.includes('T')) {
            setStartTime(selectionInfo.startStr.substring(11, 16));
        } else {
            setStartTime('');
        }

        if (selectionInfo.endStr) {
            const end = new Date(selectionInfo.endStr);
            if (selectionInfo.allDay) {
                // For all-day selections, FullCalendar's end date is exclusive.
                // If different from start, make it inclusive for display.
                if (selectionInfo.startStr.split('T')[0] !== selectionInfo.endStr.split('T')[0]) { 
                    end.setDate(end.getDate() - 1); 
                    setEndDate(end.toISOString().split('T')[0]);
                } else { // Single day selection
                    setEndDate(''); 
                }
            } else { // Timed selection
                setEndDate(end.toISOString().split('T')[0]);
                 if (selectionInfo.endStr.includes('T')) {
                    setEndTime(selectionInfo.endStr.substring(11, 16));
                } else {
                    setEndTime('');
                }
            }
        } else { // No endStr from selection (e.g., click on a single day number in month view)
            setEndDate(selectionInfo.allDay ? '' : startDate); 
            setEndTime('');
        }
        setDescription('');
        setColor('#007bff');
    } else { // New event from "Create New Event" button (no pre-selection)
        setIsEditing(false);
        setTitle('');
        setStartDate(new Date().toISOString().split('T')[0]); // Default to today
        setStartTime('');
        setEndDate('');
        setEndTime('');
        setDescription('');
        setColor('#007bff');
        setIsAllDay(false); 
    }
  }, [initialEvent, selectionInfo]); // Rerun when these props change

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !startDate) {
      alert('Please enter a title and start date.');
      return;
    }

    let effectiveIsAllDay = isAllDay;
    if (startTime.trim()) { // If a start time is entered, it's not all-day
        effectiveIsAllDay = false;
    }

    let startStr = startDate;
    if (startTime.trim() && !effectiveIsAllDay) {
      startStr += `T${startTime.trim()}:00`;
    }

    let endStrToSave = null; // This will be passed to FullCalendar
    if (endDate.trim()) {
      endStrToSave = endDate.trim();
      if (endTime.trim() && !effectiveIsAllDay) {
        endStrToSave += `T${endTime.trim()}:00`;
      } else if (startTime.trim() && !effectiveIsAllDay && !endTime.trim()) { 
        // If start time given for a timed event, but no end time, use start time for end on that day.
        // FullCalendar will then typically apply defaultTimedEventDuration if the end is same as start.
        endStrToSave += `T${startTime.trim()}:00`; 
      }
    } else if (!effectiveIsAllDay && startTime.trim()) {
        // If it's a timed event (due to startTime) but no endDate is specified,
        // FullCalendar will use defaultTimedEventDuration from the start time.
        // So, endStrToSave can remain null.
    }


    // Validate that end date/time is not before start date/time
    if (endStrToSave && new Date(endStrToSave) < new Date(startStr)) {
        alert('End date/time cannot be before start date/time. Please correct.');
        return;
    }
    
    // Adjust 'end' for FullCalendar for all-day events
    let finalEndForFc = endStrToSave;
    if (effectiveIsAllDay) {
        if (endDate.trim() && startDate !== endDate.trim()) { // Multi-day all-day event
             const endCheck = new Date(endDate.trim());
             endCheck.setDate(endCheck.getDate() + 1); // Make it exclusive for FullCalendar
             finalEndForFc = endCheck.toISOString().split('T')[0];
        } else { // Single-day all-day event
            finalEndForFc = null; // FullCalendar handles null 'end' for single all-day correctly
        }
    }

    onSave({
      // id is handled by the parent CalendarPage component
      title: title.trim(),
      start: startStr,
      end: finalEndForFc,
      allDay: effectiveIsAllDay,
      backgroundColor: color,
      borderColor: color, // Keep border same as background for simple events
      extendedProps: { description: description.trim() },
      description: description.trim() // also keep at top level for easier direct access if needed
    });
  };

  return (
    <div className="event-form-container"> {/* Retain class for existing CSS */}
      <form onSubmit={handleSubmit}>
        <h2 id="eventFormTitle">{isEditing ? 'Edit Event' : 'Add New Event'}</h2>
        
        <label htmlFor="eventTitle">Title:</label>
        <input type="text" id="eventTitle" value={title} onChange={(e) => setTitle(e.target.value)} required />

        <div className="form-row">
          <div className="form-col">
            <label htmlFor="eventStartDate">Start Date:</label>
            <input type="date" id="eventStartDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
          </div>
          <div className="form-col">
            <label htmlFor="eventStartTime">Start Time:</label>
            <input type="time" id="eventStartTime" value={startTime} onChange={(e) => {setStartTime(e.target.value); if(e.target.value) setIsAllDay(false);}} disabled={isAllDay} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-col">
            <label htmlFor="eventEndDate">End Date:</label>
            <input type="date" id="eventEndDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
          <div className="form-col">
            <label htmlFor="eventEndTime">End Time:</label>
            <input type="time" id="eventEndTime" value={endTime} onChange={(e) => {setEndTime(e.target.value); if(e.target.value) setIsAllDay(false);}} disabled={isAllDay}/>
          </div>
        </div>
        
        <div style={{ margin: '10px 0', display: 'flex', alignItems: 'center' }}>
            <input 
              type="checkbox" 
              id="isAllDay" 
              checked={isAllDay} 
              onChange={(e) => {
                setIsAllDay(e.target.checked);
                if (e.target.checked) { // If all-day is checked, clear times
                  setStartTime('');
                  setEndTime('');
                }
              }} 
              style={{ marginRight: '8px', width: 'auto' }} /* Make checkbox smaller */
            />
            <label htmlFor="isAllDay" style={{ marginBottom: '0' }}>All-day event</label>
        </div>

        <label htmlFor="eventDescription">Description:</label>
        <textarea id="eventDescription" rows="3" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>

        <label htmlFor="eventColorPalette">Color:</label>
        <div id="eventColorPalette" className="color-palette-container">
          {paletteColors.map((paletteColor) => (
            <button
              type="button" // Important: type="button" to prevent form submission
              key={paletteColor.value}
              className={`color-palette-item ${color === paletteColor.value ? 'selected' : ''}`}
              style={{ backgroundColor: paletteColor.value }}
              onClick={() => setColor(paletteColor.value)}
              title={paletteColor.name} // Tooltip with color name
            >
              {/* Optionally, add a checkmark or other indicator for the selected color */}
              {color === paletteColor.value && <span className="color-selected-indicator">&#10003;</span>}
            </button>
          ))}
        </div>

        <div className="form-buttons">
          <button type="submit" id="saveEventButton">{isEditing ? 'Update Event' : 'Save Event'}</button>
          <button type="button" id="cancelEventFormButton" onClick={onClose}>Cancel</button>
          {isEditing && onDelete && (
            <button 
              type="button" 
              id="deleteEventButton" 
              onClick={() => onDelete(initialEvent.id)} 
              className="btn-danger"
            >
              Delete Event
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default EventForm;