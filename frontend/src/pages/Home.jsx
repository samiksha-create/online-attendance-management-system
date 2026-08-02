// src/pages/Home.jsx
// Public landing page — redirects logged-in users to their dashboard

import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PublicNavbar from '../components/PublicNavbar';

const dashboardByRole = {
  admin: '/admin/dashboard',
  teacher: '/teacher/dashboard',
  student: '/student/dashboard',
};

const Home = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to={dashboardByRole[user.role]} replace />;
  }

  return (
    <div className="login-wrapper" style={{ paddingTop: '56px' }}>
      <PublicNavbar />
      <div className="text-center text-white px-3">
        <i className="bi bi-calendar-check-fill display-1 text-info"></i>
        <h1 className="fw-bold mt-3">Online Attendance Management System</h1>
        <p className="lead text-light-emphasis mb-4">
          A simple, role-based platform for Admins, Teachers, and Students to manage attendance efficiently.
        </p>
        <Link to="/login" className="btn btn-info btn-lg px-4 fw-semibold">
          <i className="bi bi-box-arrow-in-right me-2"></i>
          Get Started — Login
        </Link>

        <div className="row mt-5 g-4">
          <div className="col-md-4">
            <div className="card bg-dark text-light border-secondary h-100">
              <div className="card-body">
                <i className="bi bi-person-badge fs-2 text-info"></i>
                <h5 className="mt-2">Admin</h5>
                <p className="small text-light-emphasis">Manage teachers, students, subjects and reports.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-dark text-light border-secondary h-100">
              <div className="card-body">
                <i className="bi bi-person-workspace fs-2 text-info"></i>
                <h5 className="mt-2">Teacher</h5>
                <p className="small text-light-emphasis">Mark and manage attendance for assigned subjects.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-dark text-light border-secondary h-100">
              <div className="card-body">
                <i className="bi bi-mortarboard fs-2 text-info"></i>
                <h5 className="mt-2">Student</h5>
                <p className="small text-light-emphasis">View attendance records and download reports.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
