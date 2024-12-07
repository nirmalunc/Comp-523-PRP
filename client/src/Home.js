import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';
import { BASE_URL } from './App';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import EventViewModal from './EventViewModal';
import 'react-big-calendar/lib/css/react-big-calendar.css'; // Make sure this is imported

const Home = () => {
  const [announcements, setAnnouncements] = useState([]);
  const localizer = momentLocalizer(moment);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [myEvents, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAnnouncements();
    fetchEvents();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/announcements`);
      setAnnouncements(response.data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/events`);
      const events = response.data.map(event => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
      }));
      console.log('Fetched events:', events); // Debug log
      setEvents(events);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleEventSelect = (event) => {
    console.log('Event selected:', event); // Debug log
    setSelectedEvent(event);
    setIsViewModalOpen(true);
    console.log('Modal should be open:', !isViewModalOpen); // Debug log
  };

  return (
    <div className="home-container">
      <h1 style={{ textAlign: 'center' }}>
        PRP Exam Home Page
      </h1>
      <div className="subhome">
        <div className="left-container">
          <h3>PRP Exam To Do List: </h3>
          <ul>
            <li className="task-item">
              <input type="checkbox" id="task1" />
              <label htmlFor="task1">Register or waive exam</label>
            </li>
            <li className="task-item">
              <input type="checkbox" id="task2" />
              <label htmlFor="task2">Upload document</label>
            </li>
            <li className="task-item">
              <input type="checkbox" id="task3" />
              <label htmlFor="task3">Present</label>
            </li>
          </ul>
        </div>

        <div className="right-container">
          <Calendar
            localizer={localizer}
            events={myEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500, width: 800 }}
            onSelectEvent={handleEventSelect}
            views={['month', 'week', 'day']}
            defaultView="month"
          />
        </div>
      </div>

      {/* Simplified modal render condition */}
      <EventViewModal
        isOpen={isViewModalOpen}
        onClose={() => {
          console.log('Closing modal'); // Debug log
          setIsViewModalOpen(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
      />
    </div>
  );
};

export default Home;