import React, { useState, useEffect,  } from 'react';
import axios from 'axios';
import './Home.css'; // Ensure your CSS file is imported
import { useNavigate } from 'react-router-dom'; 

const Home = () => {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get('http://localhost:5000/announcements');
      setAnnouncements(response.data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      // Handle error
    }
  };

  const GoToFormButton = () => {
    const navigate = useNavigate();

  const navigateToForm = () => {
    navigate('/form');  // Navigates to /form page
  };
  
    return (
      <button className="go-to-form-button" onClick={navigateToForm}>
        Register or Waive Exam
      </button>
    );
  };


  return (
    <div className="home-container">
      <div className="left-container">
        <div className="notifications-container">
          <h2 style={{ textAlign: 'center' }}>Home Page</h2>
          <p style={{ textAlign: 'center' }}> You have not signed up to register or waive the exam.  </p>
          <ul>
            {announcements.map((announcement) => (
              <li key={announcement._id}>{announcement.message}</li>
            ))}
          </ul>
          <GoToFormButton/> 
          <p style={{ textAlign: 'center' }}> Complete by [].  </p> 
        </div>
      </div>

      <div className="right-container">
      <h3>To Do: </h3>
      <ul>
        <li>
          <input type="checkbox" id="task1" />
          <label htmlFor="task1"> Register or waive exam</label>
        </li>
        <li>
          <input type="checkbox" id="task2" />
          <label htmlFor="task2"> Upload document</label>
        </li>
        <li>
          <input type="checkbox" id="task3" />
          <label htmlFor="task3"> Present</label>
        </li>

      </ul>
    </div>

    </div>
  );
};


export default Home;