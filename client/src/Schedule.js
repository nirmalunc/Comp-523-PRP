import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Schedule.css';
import ScheduleTable from './ScheduleTable';
import { BASE_URL } from './App';

function Schedule() {
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [schedulingData, setSchedulingData] = useState({
        date: '',
        time: '',
        advisor: '',
        committee: '',
    });
    const [generateTable, setGenerateTable] = useState(false);
    const [emailList, setEmailList] = useState('');
    const [isReadOnly, setIsReadOnly] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/users?waive=no`);
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const handleUserSelect = (event) => {
        const username = event.target.value;
        setSelectedUserId(username);
        // Find user and set scheduling data if exists
        const user = users.find(u => u.username === username);
        if (user && user.schedulingData) {
            setSchedulingData(user.schedulingData);
            setIsReadOnly(true);
        } else {
            setSchedulingData({ date: '', time: '', advisor: '', committee: '' });
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setSchedulingData(prev => ({ ...prev, [name]: value }));
    };

    const handleEdit = () => {
        setIsReadOnly(false); // Make fields editable
    };

    const handleInfoSubmit = async () => {
        try {
            await axios.post(`${BASE_URL}/saveSchedulingData`, { selectedUserId, schedulingData });
            setIsReadOnly(true);
            // Fetch updated data
            const updatedUsers = await axios.get(`${BASE_URL}/users?waive=no`);
            setUsers(updatedUsers.data);
            console.log('Scheduling data saved successfully');
        } catch (error) {
            console.error('Error saving scheduling data:', error);
        }
    };

    const generateSchedule = () => {
        setGenerateTable(true);
    };

    const retrieveEmails = async () => {
        try {
            setEmailList(users.map(user => user.email).join(', '));
        } catch (error) {
            console.error('Error retrieving emails:', error);
        }
    };

    const hasCompleteSchedulingDetails = user => 
        user.schedulingData && 
        user.schedulingData.date && 
        user.schedulingData.time && 
        user.schedulingData.committee;

     // Check if formData is filled out
     const hasFormDataFilled = user =>
        user.formData && 
        user.formData.name &&
        user.formData.id &&
        user.formData.titleOfPRPTopic &&
        user.formData.researchAdvisor &&
        user.formData.prpSubmitted;
    

    return (
        <div className="schedule-container">
            <div className="header-with-button">
                <h2>Schedule</h2>
                <button onClick={generateSchedule}>
                    Generate Schedule
                </button>
            </div>
            <div className="dropdown-container">
                <select onChange={handleUserSelect} defaultValue="">
                    <option value="" disabled>Select a user</option>
                    {users.map((user) => (
                        <option key={user.id} value={user.username} style={{ color: hasFormDataFilled(user) ? 'black' : 'gray' }}>
                        {user.username} {!hasCompleteSchedulingDetails(user) && '★'}
                    </option>
                    ))}
                </select>
            </div>
            {selectedUserId && (
                <div className="user-details">
                    <h3>Scheduling Details</h3>
                    <div className="form-group">
                        <label>Date:</label>
                        <input type="date" name="date" value={schedulingData.date} onChange={handleInputChange} required readOnly={isReadOnly} className={isReadOnly ? 'readonly' : ''}/>
                    </div>
                    <div className="form-group">
                        <label>Time:</label>
                        <input type="time" name="time" value={schedulingData.time} onChange={handleInputChange} required readOnly={isReadOnly} className={isReadOnly ? 'readonly' : ''}/>
                    </div>
                    <div className="form-group">
                        <label>Advisor:</label>
                        <input type="text" name="advisor" value={schedulingData.advisor} onChange={handleInputChange} required readOnly={isReadOnly} className={isReadOnly ? 'readonly' : ''}/>
                    </div>
                    <div className="form-group">
                        <label>Committee:</label>
                        <input type="text" name="committee" value={schedulingData.committee} onChange={handleInputChange} required readOnly={isReadOnly} className={isReadOnly ? 'readonly' : ''}/>
                    </div>
                    <button onClick={handleInfoSubmit}>Submit</button>
                    <button type="button" onClick={handleEdit} disabled={!isReadOnly}>Edit</button>
                </div>
            )}
            {generateTable && <ScheduleTable users={users.filter(hasCompleteSchedulingDetails)} />}
            <button onClick={retrieveEmails}>Retrieve Emails</button>
            {emailList && <p>{emailList}</p>}
        </div>
    );
}

export default Schedule;
