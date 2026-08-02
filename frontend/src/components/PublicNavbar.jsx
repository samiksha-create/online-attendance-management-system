// src/components/PublicNavbar.jsx
// Top navbar shown on public pages (Home, Login, Register) — before the user logs in.
// Once logged in, the role-based <Navbar /> component (with Logout) takes over instead.

import React from 'react';
import { Link } from 'react-router-dom';

const PublicNavbar = () => {
  return (
    <nav className="navbar navbar-dark bg-dark app-navbar fixed-top px-3">
      <Link to="/" className="d-flex align-items-center text-decoration-none">
        <i className="bi bi-calendar-check-fill text-info fs-4 me-2"></i>
        <span className="navbar-brand mb-0 fw-semibold">Attendance MS</span>
      </Link>

      <div className="d-flex align-items-center gap-2">
        <Link to="/login" className="btn btn-outline-light btn-sm">
          <i className="bi bi-box-arrow-in-right me-1"></i>
          Login
        </Link>
        <Link to="/register" className="btn btn-info btn-sm fw-semibold">
          <i className="bi bi-person-plus me-1"></i>
          Register
        </Link>
      </div>
    </nav>
  );
};

export default PublicNavbar;
