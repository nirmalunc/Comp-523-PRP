import React, { useState } from 'react';
import { useAuth } from './AuthContext'; // Adjust the path as necessary
import './Profile.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL } from './App';

const Profile = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const { user } = useAuth(); // Use the user data from AuthContext

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = () => {
    if (!selectedFile) return;
  
    const formData = new FormData();
    formData.append('pdfFile', selectedFile);
    formData.append('userId', user.id); // Adjust according to where user id is stored
  
    axios.post(`${BASE_URL}/uploadPdf`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(response => {
      console.log('File uploaded successfully:', response.data);
      toast.success('File uploaded successfully!');
    })
    .catch(error => {
      if (error.response) {
        // Server responded with a status other than 200 range
        console.error('Upload error:', error.response.data);
        toast.error(`Upload error: ${error.response.data.message || 'Unknown error'}`);
      } else if (error.request) {
        // No response was received from the server
        console.error('No response received:', error.request);
        toast.error('Upload error: No response received from the server');
      } else {
        // Error setting up the request
        console.error('Error setting up upload request:', error.message);
        toast.error('Upload error: ' + error.message);
      }
    });
  };
  
  // const handleFileUpload = () => {
  //   if (!selectedFile) return;

  //   const formData = new FormData();
  //   formData.append('pdfFile', selectedFile);
  //   formData.append('userId', user.id); // Adjust according to where user id is stored

  //   axios.post(`${BASE_URL}/uploadPdf`, formData, {
  //     headers: {
  //       'Content-Type': 'multipart/form-data'
  //     }
  //   })
  //   .then(response => {
  //     console.log('File uploaded successfully:', response.data);
  //     toast.success('File uploaded successfully!');
  //   })
  //   .catch(error => {
  //     console.error('Upload error:', error);
  //     toast.error('Upload error: ' + error.response.data);
  //   });
  // };

  if (!user) {
    return <div>Please log in to view this page.</div>;
  }

  return (
    <div className="profile-container">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <div className="profile-header">
        <h1>Profile Page</h1>
      </div>
      <div className="user-info">
        <h2>User Information</h2>
        <p>Name: {user.username}</p>
        <p>Email: {user.email}</p>
        {/* Additional user details */}
      </div>

      <div className="file-upload-container">
        <h2>Upload PDF</h2>
        <input type="file" accept=".pdf" onChange={handleFileChange} />
        <button onClick={handleFileUpload}>Upload</button>
      </div>
    </div>
  );
};

export default Profile;
