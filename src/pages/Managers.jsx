import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function Managers() {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    department_id: '',   // ✅ must match Django serializer
    team: '',
  });
  const [departments, setDepartments] = useState([]);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [managers, setManagers] = useState([]);

  // Fetch departments once for dropdown
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/departments/', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
      },
    })
      .then(res => {
        console.log("Departments API response:", res.data);
        setDepartments(res.data);
      })
      .catch(err => console.error('Error fetching departments:', err));
  }, []);

  // Fetch managers list to display in table
  const fetchManagers = () => {
    axios.get('http://127.0.0.1:8000/api/managers/', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
      },
    })
      .then(res => setManagers(res.data.data || res.data))
      .catch(err => console.error('Error fetching managers:', err));
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  // Validation function
  const validateForm = () => {
    const newErrors = {};
    if (!form.full_name.trim()) newErrors.full_name = 'Full name is required';
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!form.phone.trim()) newErrors.phone = 'Phone is required';
    if (!form.department_id) newErrors.department_id = 'Please select a department';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' }); // clear error on change
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await axios.post(
        'http://127.0.0.1:8000/api/managers/',
        form,
        {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
            'Content-Type': 'application/json',
          },
        }
      );
      setMessage('Manager added successfully!');
      setForm({ full_name: '', email: '', phone: '', department_id: '', team: '' }); // ✅ reset properly
      setShowModal(false);
      setErrors({});
      fetchManagers(); // Refresh list
    } catch (error) {
      console.error(error);
      setMessage('Error adding manager.');
    }
  };

  const openModal = () => {
    setShowModal(true);
    setMessage('');
    setErrors({});
  };

  const closeModal = () => setShowModal(false);
  console.log("Departments State:", departments);

  return (
    <div className="container mt-4">

      <button className="btn btn-primary mb-3" onClick={openModal}>
        Add Manager
      </button>

      {showModal && (
        <div className="modal show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleSubmit} noValidate>
                <div className="modal-header">
                  <h5 className="modal-title">Add Manager</h5>
                  <button type="button" className="btn-close" onClick={closeModal}></button>
                </div>

                <div className="modal-body">
                  <input
                    name="full_name"
                    value={form.full_name}
                    onChange={handleChange}
                    className={`form-control mb-2 ${errors.full_name ? 'is-invalid' : ''}`}
                    placeholder="Full Name"
                    required
                  />
                  {errors.full_name && <div className="invalid-feedback">{errors.full_name}</div>}

                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className={`form-control mb-2 ${errors.email ? 'is-invalid' : ''}`}
                    placeholder="Email"
                    required
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}

                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className={`form-control mb-2 ${errors.phone ? 'is-invalid' : ''}`}
                    placeholder="Phone"
                    required
                  />
                  {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}

                  <select
                    name="department_id"
                    value={form.department_id}   
                    onChange={handleChange}
                    className={`form-control mb-2 ${errors.department_id ? 'is-invalid' : ''}`}
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                  {errors.department_id && <div className="invalid-feedback">{errors.department_id}</div>}

                  <input
                    name="team"
                    value={form.team}
                    onChange={handleChange}
                    className="form-control mb-2"
                    placeholder="Team Name"
                  />

                  {message && <div className="alert alert-info mt-2">{message}</div>}
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <h2>Managers List</h2>
      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Department</th>
            <th>Team</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {managers.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">No managers found</td>
            </tr>
          ) : (
            managers.map((manager, idx) => (
              <tr key={idx}>
                <td>{manager.full_name}</td>
                <td>{manager.phone}</td>
                <td>{manager.department?.name || '-'}</td>
                <td>{manager.team || '-'}</td>
                <td>{manager.email}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Managers;
