// src/App.jsx
// Defines all application routes, including protected role-based routes

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';

import AdminDashboard from './pages/admin/AdminDashboard';
import ManageTeachers from './pages/admin/ManageTeachers';
import ManageStudents from './pages/admin/ManageStudents';
import ManageSubjects from './pages/admin/ManageSubjects';
import AttendanceReports from './pages/admin/AttendanceReports';

import TeacherDashboard from './pages/teacher/TeacherDashboard';
import MarkAttendance from './pages/teacher/MarkAttendance';
import StudentList from './pages/teacher/StudentList';

import StudentDashboard from './pages/student/StudentDashboard';
import ViewAttendance from './pages/student/ViewAttendance';

function App() {
  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Shared protected route */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={['admin', 'teacher', 'student']}>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/teachers"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ManageTeachers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/students"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ManageStudents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/subjects"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ManageSubjects />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AttendanceReports />
            </ProtectedRoute>
          }
        />

        {/* Teacher routes */}
        <Route
          path="/teacher/dashboard"
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/attendance"
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <MarkAttendance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/students"
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <StudentList />
            </ProtectedRoute>
          }
        />

        {/* Student routes */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/attendance"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <ViewAttendance />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Home />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop />
    </>
  );
}

export default App;
