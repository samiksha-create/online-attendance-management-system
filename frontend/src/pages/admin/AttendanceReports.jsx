// src/pages/admin/AttendanceReports.jsx
// Admin: View full attendance report with filters (subject, date range) + CSV download

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';

const AttendanceReports = () => {
  const [subjects, setSubjects] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ subjectId: '', from: '', to: '' });

  const fetchSubjects = async () => {
    try {
      const res = await api.get('/subjects');
      setSubjects(res.data.data);
    } catch (err) {
      toast.error('Failed to load subjects');
    }
  };

  const fetchReport = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.subjectId) params.append('subjectId', filters.subjectId);
      if (filters.from) params.append('from', filters.from);
      if (filters.to) params.append('to', filters.to);

      const res = await api.get(`/attendance/report?${params.toString()}`);
      setRecords(res.data.data);
    } catch (err) {
      toast.error('Failed to load attendance report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
    fetchReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleApply = (e) => {
    e.preventDefault();
    fetchReport();
  };

  // Simple CSV export of the currently loaded records
  const downloadCSV = () => {
    if (records.length === 0) {
      toast.warn('No records to export');
      return;
    }
    const header = ['Date', 'Student', 'Roll No.', 'Subject', 'Teacher', 'Status', 'Remarks'];
    const rows = records.map((r) => [
      new Date(r.date).toLocaleDateString(),
      r.student?.name,
      r.student?.rollNumber,
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
    link.download = 'attendance_report.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <h3 className="fw-bold mb-4">
        <i className="bi bi-bar-chart-line me-2"></i>Attendance Reports
      </h3>

      <form className="row g-2 align-items-end mb-4" onSubmit={handleApply}>
        <div className="col-md-4">
          <label className="form-label">Subject</label>
          <select className="form-select" name="subjectId" value={filters.subjectId} onChange={handleFilterChange}>
            <option value="">All Subjects</option>
            {subjects.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name} ({s.code})
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label">From</label>
          <input type="date" className="form-control" name="from" value={filters.from} onChange={handleFilterChange} />
        </div>
        <div className="col-md-3">
          <label className="form-label">To</label>
          <input type="date" className="form-control" name="to" value={filters.to} onChange={handleFilterChange} />
        </div>
        <div className="col-md-2 d-flex gap-2">
          <button type="submit" className="btn btn-primary w-100">
            Apply
          </button>
        </div>
      </form>

      <div className="d-flex justify-content-end mb-2">
        <button className="btn btn-outline-success btn-sm" onClick={downloadCSV}>
          <i className="bi bi-download me-1"></i>Download CSV
        </button>
      </div>

      {loading ? (
        <Spinner text="Loading report..." />
      ) : (
        <div className="table-responsive-wrapper">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>Date</th>
                <th>Student</th>
                <th>Roll No.</th>
                <th>Subject</th>
                <th>Teacher</th>
                <th>Status</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center text-muted py-3">
                    No attendance records found.
                  </td>
                </tr>
              )}
              {records.map((r) => (
                <tr key={r._id}>
                  <td>{new Date(r.date).toLocaleDateString()}</td>
                  <td>{r.student?.name}</td>
                  <td>{r.student?.rollNumber}</td>
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
      )}
    </div>
  );
};

export default AttendanceReports;
