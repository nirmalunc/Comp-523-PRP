import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminHome.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useAuth } from './AuthContext';
import { BASE_URL } from './App';
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment';
import EventEditModal from './EventEditModal';

const AdminHome = () => {
  const [announcementText, setAnnouncementText] = useState('');
  const { isAdmin } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const localizer = momentLocalizer(moment)
  const [title, setTitle] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  useEffect(() => {
    fetchEvents();
  }, []);

  const [myEvents, setEvents] = useState([]);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/events`);
      const events = response.data.map(event => ({
        ...event,
        start: new Date(event.start), // ensure Date object
        end: new Date(event.end), // ensure Date object
      }));
      setEvents(events);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const MyCalendar = () => (
    <div>
      <Calendar
        localizer={localizer}
        events={myEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, width: 800 }}
        popup
        onSelectEvent={(event) => {
          setSelectedEvent(event);
          setIsEditModalOpen(true);
        }}
      />
    </div>
  );

  // const EventWithDelete = ({ event, onDelete }) => (
  //   <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
  //   <button
  //       style={{
  //         marginLeft: '8px',
  //         backgroundColor: '#dc3545',
  //         color: 'white',
  //         border: 'none',
  //         borderRadius: '4px',
  //         padding: '2px 5px',
  //         cursor: 'pointer',
  //       }}
  //       onClick={(e) => {
  //         e.stopPropagation(); // Prevents the calendar from opening the event's details
  //         onDelete(event);
  //       }}
  //     >
  //       <svg
  //       xmlns="http://www.w3.org/2000/svg"
  //       width="16"
  //       height="16"
  //       viewBox="0 0 24 24"
  //     >
  //       <path d="M3 6h18v2H3V6zm2 3h14l-1.5 14h-11L5 9zm5.5 2v10h-1V11h1zm4 0v10h-1V11h1zm2.5-8h-10v1h10V3z"/>
  //     </svg>
  //     </button>
  //     <div>{event.title}</div>
  //   </div>
  // );

  const handleDeleteEvent = async (event) => {
    if (window.confirm(`Are you sure you want to delete the event: "${event.title}"?`)) {
      try {
        const token = localStorage.getItem("jwtToken");
  
        // Include the Authorization header in the DELETE request
        const response = await axios.delete(`${BASE_URL}/events/${event._id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          },
        });
  
        if (response.status === 200) {
          alert('Event deleted successfully');
          // Refresh the events list
          fetchEvents();
        }
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };  

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("jwtToken");
  
      const eventStruct = {
        title: title,
        start: new Date(start),
        end: new Date(end),
      };
  
      // Make POST request with the event data and Authorization header
      await axios.post(
        `${BASE_URL}/events`,
        eventStruct,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          },
        }
      );
  
      // Refresh events list and clear form inputs
      fetchEvents();
      setTitle('');
      setStart('');
      setEnd('');
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };  

  const handleEventUpdate = async (updatedEvent) => {
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await axios.put(
        `${BASE_URL}/events/${updatedEvent._id}`,
        updatedEvent,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data)
      fetchEvents();
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const deleteEvents = async () => {
    if (window.confirm(`Are you sure you want to delete ALL events?`)) {
      try {
        const token = localStorage.getItem("jwtToken");
  
        // Include the Authorization header in the DELETE request
        await axios.delete(`${BASE_URL}/events`, {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          },
        });
  
        setEvents([]); // Clear events state
        fetchEvents();  // Refresh the events list
      } catch (error) {
        console.error('Error deleting events:', error);
        // Handle error
      }
    }
  };  

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/announcements`);
      setAnnouncements(response.data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      // Handle error
    }
  };

const handleAnnouncementSubmit = async () => {
    try {
      // Retrieve the token from localStorage
      const token = localStorage.getItem("jwtToken");
  
      // Set up the request with Authorization header
      await axios.post(
        `${BASE_URL}/announcement`,
        { message: announcementText },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          },
        }
      );
  
      // Clear the announcement text and refresh announcements
      setAnnouncementText('');
      fetchAnnouncements();
    } catch (error) {
      console.error('Error making announcement:', error);
    }
  };  

  const handleDeleteAnnouncement = async (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      try {
        const token = localStorage.getItem("jwtToken");
  
        // Include the Authorization header in the DELETE request
        const response = await axios.delete(`${BASE_URL}/announcement/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          },
        });
  
        if (response.status === 200) {
          alert('Announcement deleted successfully');
          // Refresh the announcements list
          fetchAnnouncements();
        }
      } catch (error) {
        console.error('Error deleting announcement:', error.response?.data || error.message);
        alert(`Failed to delete announcement: ${error.response?.data || 'Unknown error'}`);
      }
    }
  };  
        
  const handleSendEmail = async () => {
    if (!emailSubject.trim() || !emailMessage.trim()) {
      alert('Both subject and message are required.');
      return;
    }
  
    if (window.confirm('Are you sure you want to send this email to all students?')) {
      try {
        const token = localStorage.getItem("jwtToken");
  
        await axios.post(
          `${BASE_URL}/admin/sendEmail`,
          {
            subject: emailSubject,
            message: emailMessage,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
            },
          }
        );
  
        alert('Emails sent successfully');
        setEmailSubject('');
        setEmailMessage('');
      } catch (error) {
        console.error('Error sending emails:', error.response?.data || error.message);
        alert(`Failed to send emails: ${error.response?.data || 'Unknown error'}`);
      }
    }
  };  

  const handleAnnouncementChange = (event) => {
    setAnnouncementText(event.target.value);
  };

  const handleReset = async () => {
    if (window.confirm('Are you sure you want to reset the semester? This action cannot be undone.')) {
      try {
        const token = localStorage.getItem("jwtToken");
  
        // Include the Authorization header in the POST request
        await axios.post(
          `${BASE_URL}/admin/reset`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
            },
          }
        );
  
        alert('Reset successful');
        fetchAnnouncements();
      } catch (error) {
        console.error('Error during reset:', error);
        alert('Reset failed');
      }
    }
  };  

  return (
    <div className="home-container">
      <div className="top-section"> 
      <div className="notifications-container">
      <h2>Email Announcement</h2>
          <div className="email-form">
            <input
              type="text"
              placeholder="Subject"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              className="email-input"
            />
            <textarea
              placeholder="Message"
              value={emailMessage}
              onChange={(e) => setEmailMessage(e.target.value)}
              className="email-textarea"
            />
            <button className="email-button" onClick={handleSendEmail}>
              Send Email
            </button>
        <h2>Calendar Events</h2>
        <form onSubmit={handleEventSubmit}>
      <div>
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Start Date and Time:</label>
        <input
          type="datetime-local"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          required
        />
      </div>
      <div>
        <label>End Date and Time:</label>
        <input
          type="datetime-local"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          required
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <button span type="submit" style={{ marginTop: 15, backgroundColor: 'green'}} >Add Event to Calendar</button>
      </div>
    </form>
      </div>
        </div>
      

      {/* <div className="calendar-container">
        <iframe 
          src="https://calendar.google.com/calendar/embed?src=shadowkaan08%40gmail.com&ctz=America%2FNew_York" 
          style={{ border: 0 }} 
          width="800" 
          height="600" 
          title="Google Calendar">
        </iframe>
      </div> */}
      <MyCalendar />
      </div>

      {/* Reset Section */}
        <div className="reset-section">
            <button className="reset-button" onClick={handleReset}>
              Reset Semester
            </button>
          <button onClick={deleteEvents} className="reset-button" >Reset Calendar</button>
        </div>

    <EventEditModal
      isOpen={isEditModalOpen}
      onClose={() => {
        setIsEditModalOpen(false);
        setSelectedEvent(null);
      }}
      event={selectedEvent}
      onSave={handleEventUpdate}
      onDelete={handleDeleteEvent}
    />
    </div>
  );
};

export default AdminHome;
