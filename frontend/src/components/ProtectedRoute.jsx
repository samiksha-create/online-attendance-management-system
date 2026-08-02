// src/components/ProtectedRoute.jsx
// Wraps routes that require authentication (and optionally a specific role).
// Renders Navbar + Sidebar + Footer layout around the protected page content.

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Logged in, but wrong role for this page
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-wrapper">
      <Navbar />
      <Sidebar />
      <main className="main-content" style={{ marginTop: '56px' }}>
        {children}
        <Footer />
      </main>
    </div>
  );
};

export default ProtectedRoute;
