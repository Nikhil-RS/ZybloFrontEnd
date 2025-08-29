import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from './components/SideBar';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from './pages/Home';
import Managers from './pages/Managers';
import StaffManagers from './pages/StaffManagement';
import Customers from './pages/Customers';
import Departments from './pages/Department';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
   

  // 👤 user info from backend
  const [userInfo, setUserInfo] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/token/', {
        username,
        password,
      });

      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);

      setIsLoggedIn(true);
      setMessage('Login success');
    } catch (error) {
      setMessage('Login failed: Invalid credentials');
    }
  };

  // Fetch user info once logged in
  useEffect(() => {
    if (isLoggedIn) {
      axios.get('http://127.0.0.1:8000/api/user/', {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        },
      })
      .then(res => {
        setUserInfo(res.data);
      })
      .catch(err => {
        console.error("Error fetching user info:", err);
      });
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div className="container d-flex vh-100 justify-content-center align-items-center bg-light">
        <div className="card p-4 shadow" style={{ maxWidth: '400px', width: '100%' }}>
          <h2 className="text-center mb-4">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="form-control"
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Login
            </button>
          </form>
          {message && (
            <div
              className={`mt-3 text-center ${
                message === 'Login success' ? 'text-success' : 'text-danger'
              }`}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        
        {/* Header */}
        <header className="d-flex justify-content-between align-items-center p-3 shadow-sm bg-white">
          <div className="d-flex align-items-center">
            <button className="btn btn-light me-3">☰</button>
            <div className="py-4 ps-4">
              <h1>welcome {username}</h1>
            </div>
          </div>
          <div className="d-flex align-items-center">
            <i className="bi bi-search me-3" style={{ fontSize: '1.2rem' }}></i>
            <img
              src="https://i.pravatar.cc/40"
              alt="avatar"
              className="rounded-circle me-2"
              style={{ width: "35px", height: "35px" }}
            />
            <div>
              <div className="fw-bold">{username}</div>
              <small className="text-muted">{userInfo?.role || "admin"}</small>
            </div>
          </div>
        </header>

        {/* Body */}
        <div style={{ display: 'flex', flexGrow: 1 }}>
          <Sidebar />
          <main style={{ marginLeft: 20, padding: 20, flexGrow: 1 }}>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/Manager' element={<Managers />} />
              <Route path='/StaffManagers' element={<StaffManagers />} />
              <Route path='/Customers' element={<Customers />} />
              <Route path='/Departments' element={<Departments />} />
              <Route path='*' element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
