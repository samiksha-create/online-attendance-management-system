// src/pages/Register.jsx
// Public registration page — creates an Admin, Teacher, or Student account
// Note: In a real production app you'd typically restrict Admin/Teacher creation
// to Admins only. This is left open here so you can create your first Admin
// account directly from the UI instead of using curl/Postman.

import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import PublicNavbar from '../components/PublicNavbar';

const dashboardByRole = {
  admin: '/admin/dashboard',
  teacher: '/teacher/dashboard',
  student: '/student/dashboard',
};

const emptyForm = {
  role: 'student',
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  rollNumber: '',
  department: '',
  phone: '',
  semester: 1,
};

const Register = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to={dashboardByRole[user.role]} replace />;
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (form.role === 'student' && !form.rollNumber) {
      toast.error('Roll number is required for students');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/register', {
        role: form.role,
        name: form.name,
        email: form.email,
        password: form.password,
        rollNumber: form.rollNumber,
        department: form.department,
        phone: form.phone,
        semester: form.semester,
      });

      toast.success('Account created! Logging you in...');

      // Auto-login right after successful registration
      const loggedInUser = await login(form.email, form.password, form.role);
      navigate(dashboardByRole[loggedInUser.role]);
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper py-4" style={{ paddingTop: '72px' }}>
      <PublicNavbar />
      {loading && <Spinner overlay text="Creating account..." />}

      <div className="card login-card p-4" style={{ maxWidth: '480px' }}>
        <div className="text-center mb-3">
          <i className="bi bi-person-plus-fill text-primary fs-1"></i>
          <h4 className="fw-bold mt-2">Create Account</h4>
          <p className="text-muted small">Attendance Management System</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Register as</label>
            <select className="form-select" name="role" value={form.role} onChange={handleChange}>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              className="form-control"
              name="name"
              placeholder="Your full name"
              value={form.name}
              onChange={handleChange}
              required
            />
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

          <div className="row">
            <div className="col-6 mb-3">
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
            <div className="col-6 mb-3">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                className="form-control"
                name="confirmPassword"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>
          </div>

          {form.role === 'student' && (
            <div className="mb-3">
              <label className="form-label">Roll Number</label>
              <input
                className="form-control"
                name="rollNumber"
                placeholder="e.g. CS2024001"
                value={form.rollNumber}
                onChange={handleChange}
                required
              />
            </div>
          )}

          {(form.role === 'student' || form.role === 'teacher') && (
            <div className="row">
              <div className="col-6 mb-3">
                <label className="form-label">Department</label>
                <input
                  className="form-control"
                  name="department"
                  placeholder="e.g. CSE"
                  value={form.department}
                  onChange={handleChange}
                />
              </div>
              <div className="col-6 mb-3">
                <label className="form-label">Phone</label>
                <input
                  className="form-control"
                  name="phone"
                  placeholder="Optional"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          {form.role === 'student' && (
            <div className="mb-3">
              <label className="form-label">Semester</label>
              <input
                type="number"
                min="1"
                max="12"
                className="form-control"
                name="semester"
                value={form.semester}
                onChange={handleChange}
              />
            </div>
          )}

          <button type="submit" className="btn btn-primary w-100 fw-semibold mt-2" disabled={loading}>
            <i className="bi bi-person-plus me-2"></i>
            Create Account
          </button>
        </form>

        <p className="text-center small text-muted mt-3 mb-0">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
