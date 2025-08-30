import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [newDepartment, setNewDepartment] = useState('');
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('access_token'); // Get JWT token

  // Fetch departments
  const fetchDepartments = () => {
    axios.get('http://127.0.0.1:8000/api/departments/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        setDepartments(response.data);
      })
      .catch(error => {
        console.error('Error fetching departments:', error);
      });
  };

  useEffect(() => {
    fetchDepartments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle add department
  const handleAddDepartment = (e) => {
    e.preventDefault();

    if (!newDepartment.trim()) {
      setMessage('⚠️ Department name cannot be empty');
      return;
    }

    axios.post('http://127.0.0.1:8000/api/departments/',
      { name: newDepartment },
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then(response => {
        setMessage(response.data.message || '✅ Department added successfully');
        setNewDepartment('');
        fetchDepartments(); // Refresh list
      })
      .catch(error => {
        console.error('Error adding department:', error);
        setMessage('❌ Error adding department');
      });
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center"> Departments</h2>

      {/* Add Department Form */}
      <div className="card shadow-sm p-4 mb-4">
        <form onSubmit={handleAddDepartment} className="d-flex">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Enter department name"
            value={newDepartment}
            onChange={(e) => setNewDepartment(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            ➕ Add
          </button>
        </form>
        {message && <p className="mt-3 text-center fw-bold">{message}</p>}
      </div>

      {/* Department List */}
      <div className="card shadow-sm p-4">
        <h5 className="mb-3">Department List</h5>
        {departments.length > 0 ? (
          <ul className="list-group">
            {departments.map(dept => (
              <li key={dept.id} className="list-group-item d-flex justify-content-between align-items-center">
                {dept.name}
                <span className="badge bg-secondary">ID: {dept.id}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted text-center">No departments available</p>
        )}
      </div>
    </div>
  );
}
