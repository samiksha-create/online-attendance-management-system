// src/components/Spinner.jsx
// Reusable loading spinner - `overlay` prop covers full screen while loading

import React from 'react';

const Spinner = ({ overlay = false, text = 'Loading...' }) => {
  const content = (
    <div className="text-center">
      <div className="spinner-border text-primary" role="status" style={{ width: '2.5rem', height: '2.5rem' }}>
        <span className="visually-hidden">{text}</span>
      </div>
      {text && <div className="mt-2 text-muted small">{text}</div>}
    </div>
  );

  if (overlay) {
    return <div className="spinner-overlay">{content}</div>;
  }

  return <div className="py-4">{content}</div>;
};

export default Spinner;
