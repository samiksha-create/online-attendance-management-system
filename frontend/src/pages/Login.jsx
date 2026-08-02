// src/pages/Login.jsx
// Unified login page — user selects role, then enters email/password

import React, { useState } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import PublicNavbar from '../components/PublicNavbar';

const dashboardByRole = {
  admin: '/admin/dashboard',
  teacher: '/teacher/dashboard',
  student: '/student/dashboard',
};

const Login = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ role: 'student', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to={dashboardByRole[user.role]} replace />;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const loggedInUser = await login(form.email, form.password, form.role);
      toast.success(`Welcome back, ${loggedInUser.name}!`);
      navigate(dashboardByRole[loggedInUser.role]);
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper" style={{ paddingTop: '56px' }}>
      <PublicNavbar />
      {loading && <Spinner overlay text="Signing in..." />}

      <div className="card login-card p-4">
        <div className="text-center mb-3">
          <i className="bi bi-calendar-check-fill text-primary fs-1"></i>
          <h4 className="fw-bold mt-2">Sign In</h4>
          <p className="text-muted small">Attendance Management System</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Login as</label>
            <select className="form-select" name="role" value={form.role} onChange={handleChange}>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 fw-semibold" disabled={loading}>
            <i className="bi bi-box-arrow-in-right me-2"></i>
            Login
          </button>
        </form>

        <p className="text-center small text-muted mt-3 mb-0">
          Don&apos;t have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
