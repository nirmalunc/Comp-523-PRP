import React, { useState, useEffect } from 'react';
import './EventEditModal.css';

const EventEditModal = ({ isOpen, onClose, event, onSave, onDelete }) => {
  const [editedEvent, setEditedEvent] = useState({
    title: '',
    start: '',
    end: '',
  });

  useEffect(() => {
    if (event) {
      // Convert dates to local timezone string
      const startDate = new Date(event.start);
      const endDate = new Date(event.end);
      
      // Format the date to local timezone
      const formatToLocalDateTime = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      };

      setEditedEvent({
        title: event.title,
        start: formatToLocalDateTime(startDate),
        end: formatToLocalDateTime(endDate)
      });
    }
  }, [event]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create new Date objects in local timezone
    const startDate = new Date(editedEvent.start);
    const endDate = new Date(editedEvent.end);

    onSave({
      ...event,
      title: editedEvent.title,
      start: startDate,
      end: endDate,
    });
    onClose();
  };

  const handleDelete = () => {
    onDelete(event);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="top-container">
          <h2>Edit Event</h2>
          <button onClick={handleDelete} className="delete-button">
            Delete Event
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title:</label>
            <input
              type="text"
              value={editedEvent.title}
              onChange={(e) => setEditedEvent({ ...editedEvent, title: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Start Date and Time:</label>
            <input
              type="datetime-local"
              value={editedEvent.start}
              onChange={(e) => setEditedEvent({ ...editedEvent, start: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>End Date and Time:</label>
            <input
              type="datetime-local"
              value={editedEvent.end}
              onChange={(e) => setEditedEvent({ ...editedEvent, end: e.target.value })}
              required
            />
          </div>
          <div className="button-group">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="save-button">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventEditModal;