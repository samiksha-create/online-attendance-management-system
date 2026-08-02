// src/components/Sidebar.jsx
// Left sidebar navigation — links change based on logged-in user's role

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const adminLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
  { to: '/admin/teachers', label: 'Manage Teachers', icon: 'bi-person-workspace' },
  { to: '/admin/students', label: 'Manage Students', icon: 'bi-people' },
  { to: '/admin/subjects', label: 'Manage Subjects', icon: 'bi-journal-bookmark' },
  { to: '/admin/reports', label: 'Attendance Reports', icon: 'bi-bar-chart-line' },
  { to: '/profile', label: 'Profile', icon: 'bi-person-circle' },
];

const teacherLinks = [
  { to: '/teacher/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
  { to: '/teacher/attendance', label: 'Mark Attendance', icon: 'bi-check2-square' },
  { to: '/teacher/students', label: 'Student List', icon: 'bi-people' },
  { to: '/profile', label: 'Profile', icon: 'bi-person-circle' },
];

const studentLinks = [
  { to: '/student/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
  { to: '/student/attendance', label: 'My Attendance', icon: 'bi-calendar2-check' },
  { to: '/profile', label: 'Profile', icon: 'bi-person-circle' },
];

const Sidebar = () => {
  const { user } = useAuth();

  if (!user) return null;

  const links = user.role === 'admin' ? adminLinks : user.role === 'teacher' ? teacherLinks : studentLinks;

  return (
    <aside className="sidebar">
      <nav className="nav flex-column">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <i className={`bi ${link.icon} me-2`}></i>
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
