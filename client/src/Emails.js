import './Emails.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from './App';

function Emails() {
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState("All");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
		//getting all user data
        const fetchUsers = async () => {
            try {
                setLoading(true);
				const response = await axios.get(`${BASE_URL}/users`, {
                    params: {
                        waive: ["yes", "no"], 
                    }
                });                console.log('Fetched users:', response.data);
				setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
                setError('Error fetching users');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);
	

    // returns correct output based on filter selection
    const filteredUsers = Array.isArray(users) ? users.filter(user => {
		if (filter === "All") return true;
	
		if (filter === "Registered") return user.waive === "no";
		if (filter === "Waived") return user.waive === "yes";
		if (filter === "Uploaded document") return typeof user.pdfFileUrl === "string" && user.pdfFileUrl.length > 0;
		if (filter === "Did not upload document") return !user.pdfFileUrl || user.pdfFileUrl.length === 0;
	
		return false;
	}) : [];

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <div className="filter-container">
                <label htmlFor="filter">Select Status:</label>
                <select
                    id="filter"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="All">All</option>
                    <option value="Registered">Registered</option>
                    <option value="Waived">Waived</option>
                    <option value="Uploaded document">Uploaded document</option>
                    <option value="Did not upload document">Did not upload document</option>
                </select>
            </div>
            
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map((user, index) => (
                        <tr key={index}>
                            <td>{user.formData?.name || user.username}</td>
                            <td>{user.email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Emails;