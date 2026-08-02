// src/components/Footer.jsx

import React from 'react';

const Footer = () => {
  return (
    <footer className="app-footer">
      &copy; {new Date().getFullYear()} Online Attendance Management System. All rights reserved.
    </footer>
  );
};

export default Footer;
