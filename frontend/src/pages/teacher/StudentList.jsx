// src/pages/teacher/StudentList.jsx
// Teacher: view list of students, with search by name/department/semester

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get('/teacher/students');
        setStudents(res.data.data);
      } catch (err) {
        toast.error('Failed to load students');
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(search.toLowerCase()) ||
      (s.department || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Spinner text="Loading students..." />;

  return (
    <div>
      <h3 className="fw-bold mb-4">
        <i className="bi bi-people me-2"></i>Student List
      </h3>

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search by name, roll number or department..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="table-responsive-wrapper">
        <table className="table table-hover align-middle mb-0">
          <thead>
            <tr>
              <th>Roll No.</th>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Semester</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center text-muted py-3">
                  No students found.
                </td>
              </tr>
            )}
            {filtered.map((s) => (
              <tr key={s._id}>
                <td>{s.rollNumber}</td>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>{s.department || '-'}</td>
                <td>{s.semester}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentList;
