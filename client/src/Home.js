import React, { useState, useEffect,  } from 'react';
import axios from 'axios';
import './Home.css'; // Ensure your CSS file is imported
import { BASE_URL } from './App';
import { useNavigate } from 'react-router-dom'; 

const Home = () => {
  const [announcements, setAnnouncements] = useState([]);
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
  const [pdf, setPdf] = useState('');

  useEffect(() => {
    fetchUserData();
    fetchAnnouncements();
    fetchPdf();

  }, []);

  useEffect(() => {
    const isFormDataValid = validateFormData();
    setIsTask1Checked(isFormDataValid);
    console.log("Check if data is stored: ", user);
    console.log("Form data validation result: ", isFormDataValid);
  }, [user]);

  // fetches formData 
  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/userData`, {params: { userId: '6721364f620f8af45d329967' }});
      setUser(response.data.formData);
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Handle error
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

  const fetchPdf = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/userData`, {params: { userId: '6721364f620f8af45d329967' }});
      setPdf(response.data.pdfFileUrl);
    } catch (error) {
      console.error('Error fetching pdf:', error);
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

 // validating if formData is null
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


  return (
    <div className="home-container">
      <div className="left-container">
        <div className="notifications-container">
          <h2 style={{ textAlign: 'center' }}>Home Page</h2>
          <p style={{ textAlign: 'center' }}> You have not signed up to register or waive the exam. </p>
          <ul>
            {announcements.map((announcement) => (
              <li key={announcement._id}>{announcement.message}</li>
            ))}
          </ul>
          <GoToFormButton />
          <p style={{ textAlign: 'center' }}> Complete by []. </p>
        </div>
      </div>

      <div className="right-container">
        <h3>To Do: </h3>
        <ul>
          <li style={{ textDecoration: isTask1Checked ? 'line-through' : 'none' }}>
            <input 
              type="checkbox" 
              id="task1" 
              checked={isTask1Checked} 
              onChange={handleCheckbox1Click} 
            />
            <label htmlFor="task1"> Register or waive exam</label>
          </li>
          <li style={{ textDecoration: isTask2Checked ? 'line-through' : 'none' }}>
          <input 
              type="checkbox" 
              id="task2" 
              checked={isTask2Checked} 
              onChange={handleCheckbox2Click} 
            />
            <label htmlFor="task2"> Upload document</label>
          </li>
          <li>
            <input type="checkbox" id="task3" />
            <label htmlFor="task3"> Present on </label>
          </li>
        </ul>
      </div>
    </div>
  );
  
};

export default Home;