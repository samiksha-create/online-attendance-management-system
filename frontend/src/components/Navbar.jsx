// src/components/Navbar.jsx
// Top navigation bar - shows app name and logged-in user with logout

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-dark bg-dark app-navbar fixed-top px-3">
      <div className="d-flex align-items-center">
        <i className="bi bi-calendar-check-fill text-info fs-4 me-2"></i>
        <span className="navbar-brand mb-0 fw-semibold">Attendance MS</span>
      </div>

      {user && (
        <div className="d-flex align-items-center gap-3">
          <span className="text-light small d-none d-sm-inline">
            <i className="bi bi-person-circle me-1"></i>
            {user.name} <span className="badge bg-info text-dark ms-1 text-capitalize">{user.role}</span>
          </span>
          <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right me-1"></i>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
