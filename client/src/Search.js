import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation
import axios from 'axios';
import './Search.css';
import { BASE_URL } from './App';

function Search() {
  const location = useLocation(); // Access the location object
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    if (location.state && location.state.userId) {
      handleUserClick(location.state.userId);
    }
  }, [location.state]);

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
    setSelectedUser(null);
  };

  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.get(`${BASE_URL}/search?name=${searchQuery}`);
      setSearchResults(response.data.sort((a, b) => a.username.localeCompare(b.username)));
      setSelectedUser(null);
    } catch (error) {
      console.error('Error occurred during search:', error);
    }
  };

  const handleUserClick = async (userId) => {
    try {
      const response = await axios.get(`${BASE_URL}/userData?userId=${userId}`);
      setSelectedUser(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleBackToResults = () => {
    setSelectedUser(null);
  };

  

  const handlePasswordReset = async (event) => {
    event.preventDefault();
    try {
      await axios.post(`${BASE_URL}/resetPassword`, {
        selectedUserId: selectedUser.username,
        password: newPassword
      });
      alert('Password reset successfully!');
      setNewPassword('');
    } catch (error) {
      console.error('Error resetting password:', error);
      alert('Failed to reset password.');
    }
  };

  const fieldNames = {
    name: "Name",
    id: "ID",
    titleOfPRPTopic: "Title of PRP Topic",
    researchAdvisor: "Research Advisor",
    prpSubmitted: "PRP Submitted",
    nameOfJournal: "Name of Conference/Journal",
    paperAccepted: "Paper Accepted",
    reviewsAvailable: "Reviews Available",
    listenWaiver: "Who Listened to Waiver Talk (If Applicable)"
  };

  return (
    <div className="search-container">
  <h2>Student Search</h2>
  <form onSubmit={handleSearchSubmit} className="search-form">
    <input
      type="text"
      placeholder="Search by name..."
      value={searchQuery}
      onChange={handleSearchInputChange}
      className="search-input"
    />
    <button type="submit" className="search-button">Search</button>
  </form>
  {(searchResults.length > 0 && !selectedUser) && (
    <div className="search-results">
      <h3>Search Results</h3>
      <ul>
        {searchResults.map((user) => (
          <li key={user._id} onClick={() => handleUserClick(user._id)}>
            {user.username}
          </li>
        ))}
      </ul>
    </div>
  )}
  {selectedUser && (
    <div className="user-modal">
      <div className="modal-content">
        <button className="back-button" onClick={handleBackToResults}>
          &#8592; Back to Results
        </button>
        <div className="user-details">
          <h3>User Details</h3>
          <p><strong>Username:</strong> {selectedUser.username}</p>
          <p><strong>Email:</strong> {selectedUser.email}</p>
          <p><strong>Semester:</strong> {selectedUser.semester}</p>
          <p><strong>Waiver:</strong> {selectedUser.waive}</p>
          <p><strong>PRP Paper:</strong> {selectedUser.pdfFileUrl && (
  <a href={`${BASE_URL}${selectedUser.pdfFileUrl}`} target="_blank" rel="noopener noreferrer">Open PDF</a>
)}
</p>
        </div>
        {selectedUser.formData && (
          <div className="form-data">
            <h3>Form Data</h3>
            {Object.entries(selectedUser.formData).map(([key, value]) => (
              <p key={key}><strong>{fieldNames[key] || key}:</strong> {value}</p>
            ))}
          </div>
        )}
        <div className="password-reset">
          <h2>Reset Password</h2>
          <form onSubmit={handlePasswordReset}>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button type="submit">Reset Password</button>
          </form>
        </div>
      </div>
    </div>
  )}
</div>

  );
}

export default Search;
