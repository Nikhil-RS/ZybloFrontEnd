import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Customers() {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    gender: '',
    date_of_birth: '',
  });
  const [customers, setCustomers] = useState([]);
  const [message, setMessage] = useState('');

  // 🔹 filter states
  const [search, setSearch] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Fetch customers on mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = (filters = {}) => {
    axios
      .get('http://127.0.0.1:8000/api/customers/', {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        },
        params: filters, // pass query params
      })
      .then((res) => {
        console.log('API response:', res.data); // debug
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.results || res.data.data || [];
        setCustomers(data);
      })
      .catch((err) => console.error('Error fetching customers:', err));
  };

  const handleFilter = () => {
    fetchCustomers({
      q: search,
      start_date: fromDate,
      end_date: toDate,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://127.0.0.1:8000/api/customers/', form, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('access_token'),
          'Content-Type': 'application/json',
        },
      });
      setMessage('Customer added successfully!');
      setForm({
        full_name: '',
        email: '',
        phone: '',
        gender: '',
        date_of_birth: '',
      });
      setShowModal(false);
      fetchCustomers();
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.detail || 'Failed to add customer.');
      } else {
        setMessage('Network error, please try again.');
      }
      console.error(error);
    }
  };

  const openModal = () => {
    setShowModal(true);
    setMessage('');
  };

  const closeModal = () => {
    setForm({
      full_name: '',
      email: '',
      phone: '',
      gender: '',
      date_of_birth: '',
    });
    setShowModal(false);
  };

  return (
    <div className="container mt-4">
      <h1>Customers</h1>

      <button className="btn btn-primary mb-3" onClick={openModal}>
        Add Customer
      </button>

      {/* 🔹 Filter Bar */}
      <div className="d-flex gap-2 mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="date"
          className="form-control"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />
        <input
          type="date"
          className="form-control"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
        <button className="btn btn-dark" onClick={handleFilter}>
          Apply
        </button>
      </div>

      {/* Modal for adding customer */}
      {showModal && (
        <div
          className="modal show"
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">Add Customer</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeModal}
                  ></button>
                </div>

                <div className="modal-body">
                  <input
                    name="full_name"
                    placeholder="Full Name"
                    value={form.full_name}
                    onChange={handleChange}
                    className="form-control mb-2"
                    required
                  />

                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    className="form-control mb-2"
                  />

                  <input
                    name="phone"
                    placeholder="Phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="form-control mb-2"
                  />

                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className="form-control mb-2"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>

                  <input
                    type="date"
                    name="date_of_birth"
                    value={form.date_of_birth}
                    onChange={handleChange}
                    className="form-control mb-2"
                  />

                  {message && <div className="alert alert-info">{message}</div>}
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Gender</th>
            <th>Date of Birth</th>
            <th>Added on</th>
          </tr>
        </thead>
        <tbody>
          {customers.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">
                No customers found
              </td>
            </tr>
          ) : (
            customers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.full_name}</td>
                <td>{customer.email || '-'}</td>
                <td>{customer.phone || '-'}</td>
                <td>{customer.gender}</td>
                <td>
                  {customer.date_of_birth
                    ? new Date(customer.date_of_birth).toLocaleDateString()
                    : '-'}
                </td>
                <td>
                  {customer.added_on
                    ? new Date(customer.added_on).toLocaleString()
                    : '-'}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
