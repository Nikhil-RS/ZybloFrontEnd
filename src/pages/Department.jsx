import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Departments() {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('access_token'); // Get JWT token from localStorage

    axios.get('http://127.0.0.1:8000/api/departments/', {
      headers: {
        Authorization: `Bearer ${token}`, // Send token in header
      },
    })
      .then(response => {
        setDepartments(response.data);
      })
      .catch(error => {
        console.error('Error fetching departments:', error);
      });
  }, []);

  return (
    <>
      <h1>Departments</h1>
      <ul>
        {departments.map(dept => (
          <li key={dept.id}>{dept.name}</li>
        ))}
      </ul>
    </>
  );
}
