import React from 'react';
import { NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Sidebar() {
  const navItems = [
    { name: 'Dashboard', icon: 'bi-grid', route: '/' },
    { name: 'Managers', icon: 'bi-people', route: '/Manager' },
    { name: 'Staff Management', icon: 'bi-grid', route: '/StaffManagers' },
    { name: 'Customers', icon: 'bi-bag', route: '/Customers' },
    { name: 'Departments', icon: 'bi-bag', route: '/Departments' },
  ];

  const sidebarBg = '#101c53';
  const textColor = '#aef9fc';
  const activeBgColor = '#fff';
  const activeTextColor = '#101c53';

  return (
    <div style={{ backgroundColor: sidebarBg, minHeight: '100vh', width: 260, color: textColor }} className="d-flex flex-column">
      

      <nav className="nav flex-column mt-4">
        {navItems.map(item => (
          <NavLink
            key={item.name}
            to={item.route}
            end
            className={({ isActive }) =>
              `nav-link d-flex align-items-center py-3 ps-4 ${
                isActive ? 'fw-bold' : ''
              }`
            }
            style={({ isActive }) => ({
              fontSize: '1.1rem',
              color: isActive ? activeTextColor : textColor,
              backgroundColor: isActive ? activeBgColor : 'transparent',
              borderLeft: isActive ? '6px solid #9ab8fa' : '6px solid transparent',
              textDecoration: 'none',
            })}
          >
            <i className={`${item.icon} me-3`} style={{ fontSize: '1.4rem', color: 'inherit' }} />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
