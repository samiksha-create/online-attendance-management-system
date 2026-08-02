// src/pages/teacher/TeacherDashboard.jsx
// Teacher overview - assigned subjects and quick stats

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';

const TeacherDashboard = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await api.get('/teacher/subjects');
        setSubjects(res.data.data);
      } catch (err) {
        toast.error('Failed to load assigned subjects');
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  if (loading) return <Spinner text="Loading dashboard..." />;

  return (
    <div>
      <h3 className="fw-bold mb-4">
        <i className="bi bi-speedometer2 me-2"></i>Teacher Dashboard
      </h3>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card stat-card p-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="text-muted small">Assigned Subjects</div>
                <div className="stat-value text-primary">{subjects.length}</div>
              </div>
              <i className="bi bi-journal-bookmark fs-1 text-primary opacity-50"></i>
            </div>
          </div>
        </div>
      </div>

      <h6 className="fw-semibold mb-3">My Subjects</h6>
      <div className="row g-3">
        {subjects.length === 0 && <p className="text-muted">No subjects assigned yet. Contact your admin.</p>}
        {subjects.map((s) => (
          <div className="col-md-4" key={s._id}>
            <div className="card p-3 h-100">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="fw-bold mb-1">{s.name}</h6>
                  <span className="badge bg-info text-dark">{s.code}</span>
                </div>
                <i className="bi bi-book fs-3 text-secondary opacity-50"></i>
              </div>
              <p className="text-muted small mt-2 mb-2">
                Semester {s.semester} {s.department && `· ${s.department}`}
              </p>
              <Link to="/teacher/attendance" className="btn btn-sm btn-outline-primary mt-auto">
                Mark Attendance
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherDashboard;
