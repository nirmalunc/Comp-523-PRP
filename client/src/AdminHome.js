import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminHome.css';
import { useAuth } from './AuthContext';

const AdminHome = () => {
  const [announcementText, setAnnouncementText] = useState('');
  const { isAdmin } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get('http://localhost:3000/announcements');
      setAnnouncements(response.data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      // Handle error
    }
  };

  const handleSendEmail = async () => {
    if (!emailSubject.trim() || !emailMessage.trim()) {
      alert('Both subject and message are required.');
      return;
    }
  
    if (window.confirm('Are you sure you want to send this email to all students?')) {
      try {
        await axios.post('http://localhost:3000/admin/sendEmail', {
          subject: emailSubject,
          message: emailMessage,
        });
        alert('Emails sent successfully');
        setEmailSubject('');
        setEmailMessage('');
      } catch (error) {
        console.error('Error sending emails:', error.response?.data || error.message);
        alert(`Failed to send emails: ${error.response?.data || 'Unknown error'}`);
      }
    }
  };
  
  

  const handleReset = async () => {
    if (window.confirm('Are you sure you want to reset the semester? This action cannot be undone.')) {
      try {
        await axios.post('http://localhost:3000/admin/reset');
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
        <div className="email-section">
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
          </div>
        </div>

      

      <div className="calendar-container">
        <iframe 
          src="https://calendar.google.com/calendar/embed?src=shadowkaan08%40gmail.com&ctz=America%2FNew_York" 
          style={{ border: 0 }} 
          width="800" 
          height="600" 
          frameBorder="0" 
          scrolling="no"
          title="Google Calendar">
        </iframe>
      </div>
      </div>

      {/* Reset Section */}
      {isAdmin && (
        <div className="reset-section">
          <h2>Reset Semester</h2>
          <button className="reset-button" onClick={handleReset}>
            Reset
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminHome;
