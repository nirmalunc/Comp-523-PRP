import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';
import { BASE_URL } from './App';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import EventViewModal from './EventViewModal';
import 'react-big-calendar/lib/css/react-big-calendar.css'; // Make sure this is imported
import { user } from './AuthContext';

const Home = () => {
  const [announcements, setAnnouncements] = useState([]);
  const localizer = momentLocalizer(moment);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [myEvents, setEvents] = useState([]);
  const [pdf, setPdf] = useState('');
  const navigate = useNavigate();
  const [user, setUser] =  useState({
    name: '',
    id: '',
    titleOfPRPTopic: '',
    researchAdvisor: '',
    prpSubmitted: '',
    nameOfJournal: '',
    paperAccepted: '',
    reviewsAvailable: '',
    listenWaiver: ''
  });

  useEffect(() => {
    fetchAnnouncements();
    fetchEvents()
    fetchUserData();
    fetchPdf();
  }, []);

  useEffect(() => {
    const isFormDataValid = validateFormData();
    setIsTask1Checked(isFormDataValid);
    console.log("Check if data is stored: ", user);
    console.log("Form data validation result: ", isFormDataValid);
  }, [user]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/userData`, {params: { userId: localStorage.getItem("id") }});
      setUser(response.data.formData);
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Handle error
    }
  };

  const fetchPdf = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/userData`, {params: { userId: localStorage.getItem("id") }});
      setPdf(response.data.pdfFileUrl);
    } catch (error) {
      console.error('Error fetching pdf:', error);
      // Handle error
    }
  };

  const validateFormData = () => {
    return (
      user.name && user.id && user.titleOfPRPTopic && user.researchAdvisor && 
      user.prpSubmitted &&  
      user.paperAccepted && user.reviewsAvailable
    );
};
  const validatePdfUrl = () => {
  return pdf.length > 0;
}
  const isPdfValid = validatePdfUrl();
  const isFormDataValid = validateFormData();

  console.log("check if pdf stored: " + isPdfValid);
  console.log("check if data stored: " + isFormDataValid);
  const [isTask1Checked, setIsTask1Checked] = useState(isFormDataValid);
  const [isTask2Checked, setIsTask2Checked] = useState(isPdfValid);
  useEffect(() => {
    setIsTask1Checked(isFormDataValid);
    setIsTask2Checked(isPdfValid);
  }, [isFormDataValid, isPdfValid]);
  // Toggle checkbox manually if user interacts
  const handleCheckbox1Click = () => {
    setIsTask1Checked((prev) => !prev);
  };
  const handleCheckbox2Click = () => {
    setIsTask2Checked((prev) => !prev);
  };


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
            <li className="task-item" style={{ textDecoration: isTask1Checked ? 'line-through' : 'none' }}>
            <input 
              type="checkbox" 
              id="task1" 
              checked={isTask1Checked} 
              onChange={handleCheckbox1Click} 
            />
              <label htmlFor="task1">Register or waive exam</label>
            </li>
            <li className="task-item" style={{ textDecoration: isTask2Checked ? 'line-through' : 'none' }}>>
              <input 
              type="checkbox" 
              id="task2" 
              checked={isTask2Checked} 
              onChange={handleCheckbox2Click} 
            />
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