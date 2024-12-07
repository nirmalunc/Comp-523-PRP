import React from 'react';

const EventViewModal = ({ isOpen, onClose, event }) => {
  if (!isOpen) return null;

  // Add an overlay div that covers the entire screen
  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}
      onClick={onClose}
    >
      {/* Modal content */}
      <div 
        style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          width: '90%',
          maxWidth: '500px',
          maxHeight: '90vh',
          overflow: 'auto',
          position: 'relative'
        }}
        onClick={e => e.stopPropagation()}
      >
        <h2 style={{ marginTop: 0, marginBottom: '20px', fontSize: '1.5rem', fontWeight: 'bold' }}>
          Event Details
        </h2>
        
        {event && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
                Title:
              </label>
              <div style={{ padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                {event.title}
              </div>
            </div>
            
            <div>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
                Start Time:
              </label>
              <div style={{ padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                {new Date(event.start).toLocaleString()}
              </div>
            </div>
            
            <div>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
                End Time:
              </label>
              <div style={{ padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                {new Date(event.end).toLocaleString()}
              </div>
            </div>
          </div>
        )}

        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              backgroundColor: '#4a5568',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventViewModal;