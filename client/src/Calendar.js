import React, { useState, useEffect,  } from 'react';
import axios from 'axios';
import './Calendar.css'; // Ensure your CSS file is imported
import { BASE_URL } from './App';
import { useNavigate } from 'react-router-dom'; 

const Calendar = () => {

    const navigate = useNavigate();
    
  
  return (
    <p>Calendar</p>
  );
};


export default Calendar;