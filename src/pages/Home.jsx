import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from 'axios';

export default function Home() {
  const [customers, setCustomers] = useState([]);
  
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
  }, []);
   useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = () => {
    axios.get('http://127.0.0.1:8000/api/customers/', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
      },
    })
      .then(res => {
        console.log("API response:", res.data); // debug
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.results || res.data.data || [];
        setCustomers(data);
      })
      .catch(err => console.error('Error fetching customers:', err));
  };

  return (
    <div style={{ background: '#f6f7fa', minHeight: '100vh', padding: '0 24px' }}>
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
      
      <div className="d-flex gap-3 mt-4 flex-wrap">
        <Card title="Total Managers" count={counts.managers} icon="bi-person" iconColor="green" />
        <Card title="Total Staffs" count={counts.staffs} icon="bi-people" iconColor="red" />
        <Card title="Total Customers" count={counts.customers} icon="bi-briefcase" iconColor="#2992f0" />
        <Card title="Total Departments" count={counts.departments} icon="bi-archive" iconColor="#ff9500" />
      </div>
      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Gender</th>
            <th>Date of Birth</th>
          </tr>
        </thead>
        <tbody>
          {customers.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">No customers found</td>
            </tr>
          ) : (
            customers.map(customer => (
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
              </tr>
            ))
          )}
        </tbody>
      </table>
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
