import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from 'axios';

export default function Home() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [gender, setGender] = useState('');
  
  const [counts, setCounts] = useState({
    customers: 0,
    staffs: 0,
    managers: 0,
    departments: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [custRes, staffRes, mgrRes, deptRes] = await Promise.all([
          axios.get('http://127.0.0.1:8000/api/customers/count/', {
            headers: { Authorization: 'Bearer ' + localStorage.getItem('access_token') }
          }),
          axios.get('http://127.0.0.1:8000/api/staff/count/', {
            headers: { Authorization: 'Bearer ' + localStorage.getItem('access_token') }
          }),
          axios.get('http://127.0.0.1:8000/api/managers/count/', {
            headers: { Authorization: 'Bearer ' + localStorage.getItem('access_token') }
          }),
          axios.get('http://127.0.0.1:8000/api/departments/count/', {
            headers: { Authorization: 'Bearer ' + localStorage.getItem('access_token') }
          }),
        ]);

        setCounts({
          customers: custRes.data.count,
          staffs: staffRes.data.count,
          managers: mgrRes.data.count,
          departments: deptRes.data.count,
        });
      } catch (error) {
        console.error('Error fetching counts:', error);
      }
    };

    fetchCounts();
    fetchCustomers();
  }, []);

  const fetchCustomers = () => {
    axios.get('http://127.0.0.1:8000/api/customers/', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
      },
    })
      .then(res => {
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.results || res.data.data || [];
        setCustomers(data);
      })
      .catch(err => console.error('Error fetching customers:', err));
  };

  const filteredCustomers = customers.filter(customer => {
    return (
      (search === '' || customer.full_name?.toLowerCase().includes(search.toLowerCase())) &&
      (gender === '' || customer.gender === gender)
    );
  });

  return (
    <div style={{ background: '#f6f7fa', minHeight: '100vh', padding: '0 24px' }}>
      {/* Navbar */}
      <nav className="d-flex align-items-center justify-content-between py-3">
        <div className="d-flex align-items-center">
          <i className="bi bi-list" style={{ fontSize: 28, marginRight: 16 }}></i>
        </div>
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-search" style={{ fontSize: 20, marginRight: 24 }}></i>
          <div className="d-flex align-items-center" style={{ gap: 10 }}>
            <i className="bi bi-caret-down-fill ms-2"></i>
          </div>
        </div>
      </nav>
      
      {/* Summary Cards */}
      <div className="d-flex gap-3 mt-4 flex-wrap">
        <Card title="Total Managers" count={counts.managers} icon="bi-person" iconColor="green" />
        <Card title="Total Staffs" count={counts.staffs} icon="bi-people" iconColor="red" />
        <Card title="Total Customers" count={counts.customers} icon="bi-briefcase" iconColor="#2992f0" />
        <Card title="Total Departments" count={counts.departments} icon="bi-archive" iconColor="#ff9500" />
      </div>

      {/* Filters */}
      <div className="row align-items-center mt-4">
        <div className="col-md-6 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-3 mb-2">
          <select
            className="form-select"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
      </div>

      {/* Customers Table */}
      <div className="table-responsive mt-3">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-light">
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
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center text-muted">No customers found</td>
              </tr>
            ) : (
              filteredCustomers.map(customer => (
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
                  <td>{customer.added_on}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Card({ title, count, icon, iconColor }) {
  return (
    <div className="p-3 rounded shadow-sm bg-white flex-grow-1 d-flex align-items-center flex-column" style={{ minWidth: 160 }}>
      <i className={`bi ${icon}`} style={{ color: iconColor, fontSize: 28 }}></i>
      <span style={{ color: '#555', marginTop: 8 }}>{title}</span>
      <span style={{ fontSize: 28, fontWeight: 600 }}>{count}</span>
    </div>
  );
}
