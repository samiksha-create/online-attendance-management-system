// src/pages/student/ViewAttendance.jsx
// Student: view own attendance records, filter by subject, download report

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';

const ViewAttendance = () => {
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [subjectId, setSubjectId] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchAttendance = async (selectedSubject = '') => {
    setLoading(true);
    try {
      const query = selectedSubject ? `?subjectId=${selectedSubject}` : '';
      const res = await api.get(`/attendance/student${query}`);
      setRecords(res.data.data);
      setSummary(res.data.summary);
    } catch (err) {
      toast.error('Failed to load attendance');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const res = await api.get('/subjects');
        setSubjects(res.data.data);
      } catch (err) {
        // ignore — subject filter is optional
      }
      fetchAttendance();
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (e) => {
    const val = e.target.value;
    setSubjectId(val);
    fetchAttendance(val);
  };

  const downloadReport = () => {
    if (records.length === 0) {
      toast.warn('No records to download');
      return;
    }
    const header = ['Date', 'Subject', 'Teacher', 'Status', 'Remarks'];
    const rows = records.map((r) => [
      new Date(r.date).toLocaleDateString(),
      `${r.subject?.name} (${r.subject?.code})`,
      r.teacher?.name,
      r.status,
      r.remarks,
    ]);
    const csvContent = [header, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'my_attendance_report.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <Spinner text="Loading attendance..." />;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h3 className="fw-bold mb-0">
          <i className="bi bi-calendar2-check me-2"></i>My Attendance
        </h3>
        <button className="btn btn-outline-success btn-sm" onClick={downloadReport}>
          <i className="bi bi-download me-1"></i>Download Report
        </button>
      </div>

      <div className="row mb-3">
        <div className="col-md-4">
          <select className="form-select" value={subjectId} onChange={handleFilterChange}>
            <option value="">All Subjects</option>
            {subjects.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name} ({s.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {summary && (
        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <div className="card stat-card p-3 text-center">
              <div className="text-muted small">Total</div>
              <div className="stat-value text-primary">{summary.total}</div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card stat-card p-3 text-center">
              <div className="text-muted small">Present</div>
              <div className="stat-value text-success">{summary.present}</div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card stat-card p-3 text-center">
              <div className="text-muted small">Absent</div>
              <div className="stat-value text-danger">{summary.absent}</div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card stat-card p-3 text-center">
              <div className="text-muted small">Percentage</div>
              <div className="stat-value">{summary.percentage}%</div>
            </div>
          </div>
        </div>
      )}

      <div className="table-responsive-wrapper">
        <table className="table table-hover align-middle mb-0">
          <thead>
            <tr>
              <th>Date</th>
              <th>Subject</th>
              <th>Teacher</th>
              <th>Status</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center text-muted py-3">
                  No attendance records found.
                </td>
              </tr>
            )}
            {records.map((r) => (
              <tr key={r._id}>
                <td>{new Date(r.date).toLocaleDateString()}</td>
                <td>
                  {r.subject?.name} ({r.subject?.code})
                </td>
                <td>{r.teacher?.name}</td>
                <td>
                  <span
                    className={`badge ${
                      r.status === 'Present' ? 'bg-success' : r.status === 'Absent' ? 'bg-danger' : 'bg-warning text-dark'
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
                <td>{r.remarks || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewAttendance;
