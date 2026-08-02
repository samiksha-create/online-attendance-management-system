// src/pages/teacher/MarkAttendance.jsx
// Teacher: select subject + date, mark Present/Absent/Late for each student, submit in bulk

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';

const todayISO = () => new Date().toISOString().split('T')[0];

const MarkAttendance = () => {
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjectId, setSubjectId] = useState('');
  const [date, setDate] = useState(todayISO());
  const [statusMap, setStatusMap] = useState({}); // studentId -> status
  const [remarksMap, setRemarksMap] = useState({}); // studentId -> remarks
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [existing, setExisting] = useState([]);

  useEffect(() => {
    const fetchInit = async () => {
      try {
        const [subjectsRes, studentsRes] = await Promise.all([
          api.get('/teacher/subjects'),
          api.get('/teacher/students'),
        ]);
        setSubjects(subjectsRes.data.data);
        setStudents(studentsRes.data.data);
        if (subjectsRes.data.data.length > 0) {
          setSubjectId(subjectsRes.data.data[0]._id);
        }
      } catch (err) {
        toast.error('Failed to load subjects/students');
      } finally {
        setLoading(false);
      }
    };
    fetchInit();
  }, []);

  // When subject or date changes, pre-load any existing attendance for that day
  useEffect(() => {
    const fetchExisting = async () => {
      if (!subjectId || !date) return;
      try {
        const res = await api.get(`/attendance/subject/${subjectId}?date=${date}`);
        setExisting(res.data.data);
        const newStatusMap = {};
        const newRemarksMap = {};
        res.data.data.forEach((r) => {
          newStatusMap[r.student._id] = r.status;
          newRemarksMap[r.student._id] = r.remarks;
        });
        setStatusMap(newStatusMap);
        setRemarksMap(newRemarksMap);
      } catch (err) {
        // no existing records is fine
      }
    };
    fetchExisting();
  }, [subjectId, date]);

  const setStatus = (studentId, status) => {
    setStatusMap((prev) => ({ ...prev, [studentId]: status }));
  };

  const setRemarks = (studentId, remarks) => {
    setRemarksMap((prev) => ({ ...prev, [studentId]: remarks }));
  };

  const markAllPresent = () => {
    const map = {};
    students.forEach((s) => (map[s._id] = 'Present'));
    setStatusMap(map);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subjectId || !date) {
      toast.warn('Please select a subject and date');
      return;
    }

    const records = students
      .filter((s) => statusMap[s._id])
      .map((s) => ({ studentId: s._id, status: statusMap[s._id], remarks: remarksMap[s._id] || '' }));

    if (records.length === 0) {
      toast.warn('Please mark attendance for at least one student');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/attendance', { subjectId, date, records });
      toast.success('Attendance marked successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to mark attendance');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner text="Loading..." />;

  return (
    <div>
      <h3 className="fw-bold mb-4">
        <i className="bi bi-check2-square me-2"></i>Mark Attendance
      </h3>

      {subjects.length === 0 ? (
        <p className="text-muted">You have no assigned subjects yet.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="row g-2 align-items-end mb-3">
            <div className="col-md-5">
              <label className="form-label">Subject</label>
              <select className="form-select" value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
                {subjects.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name} ({s.code})
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-control"
                value={date}
                max={todayISO()}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="col-md-4 d-flex gap-2">
              <button type="button" className="btn btn-outline-success w-100" onClick={markAllPresent}>
                <i className="bi bi-check-all me-1"></i>Mark All Present
              </button>
            </div>
          </div>

          <div className="table-responsive-wrapper mb-3">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>Roll No.</th>
                  <th>Name</th>
                  <th style={{ width: '30%' }}>Status</th>
                  <th style={{ width: '25%' }}>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s._id}>
                    <td>{s.rollNumber}</td>
                    <td>{s.name}</td>
                    <td>
                      <div className="btn-group btn-group-sm" role="group">
                        {['Present', 'Absent', 'Late'].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            className={`btn ${
                              statusMap[s._id] === opt
                                ? opt === 'Present'
                                  ? 'btn-success'
                                  : opt === 'Absent'
                                  ? 'btn-danger'
                                  : 'btn-warning'
                                : 'btn-outline-secondary'
                            }`}
                            onClick={() => setStatus(s._id, opt)}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Optional remarks"
                        value={remarksMap[s._id] || ''}
                        onChange={(e) => setRemarks(s._id, e.target.value)}
                      />
                    </td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center text-muted py-3">
                      No students found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Attendance'}
          </button>
        </form>
      )}
    </div>
  );
};

export default MarkAttendance;
