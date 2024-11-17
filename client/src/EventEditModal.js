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
      setEditedEvent({
        title: event.title,
        start: new Date(event.start).toISOString().slice(0, 16),
        end: new Date(event.end).toISOString().slice(0, 16)
      });
    }
  }, [event]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...event,
      ...editedEvent,
      start: new Date(editedEvent.start),
      end: new Date(editedEvent.end),
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