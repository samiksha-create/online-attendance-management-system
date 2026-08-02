// src/pages/admin/ManageSubjects.jsx
// Admin: Create subjects and assign teachers to them

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';

const emptyForm = { name: '', code: '', department: '', semester: 1 };

const ManageSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const [assignModal, setAssignModal] = useState(null); // subject being assigned
  const [selectedTeacher, setSelectedTeacher] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [subjectsRes, teachersRes] = await Promise.all([
        api.get('/subjects'),
        api.get('/admin/teachers?limit=100'),
      ]);
      setSubjects(subjectsRes.data.data);
      setTeachers(teachersRes.data.data);
    } catch (err) {
      toast.error('Failed to load subjects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/subjects', form);
      toast.success('Subject created successfully');
      setShowModal(false);
      setForm(emptyForm);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create subject');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this subject?')) return;
    try {
      await api.delete(`/subjects/${id}`);
      toast.success('Subject deleted');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete subject');
    }
  };

  const openAssignModal = (subject) => {
    setAssignModal(subject);
    setSelectedTeacher(subject.teacher?._id || '');
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedTeacher) {
      toast.warn('Please select a teacher');
      return;
    }
    try {
      await api.put(`/subjects/${assignModal._id}/assign-teacher`, { teacherId: selectedTeacher });
      toast.success('Teacher assigned successfully');
      setAssignModal(null);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to assign teacher');
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h3 className="fw-bold mb-0">
          <i className="bi bi-journal-bookmark me-2"></i>Manage Subjects
        </h3>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <i className="bi bi-plus-lg me-1"></i>Create Subject
        </button>
      </div>

      {loading ? (
        <Spinner text="Loading subjects..." />
      ) : (
        <div className="table-responsive-wrapper">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Department</th>
                <th>Semester</th>
                <th>Assigned Teacher</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subjects.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-3">
                    No subjects found.
                  </td>
                </tr>
              )}
              {subjects.map((s) => (
                <tr key={s._id}>
                  <td>
                    <span className="badge bg-info text-dark">{s.code}</span>
                  </td>
                  <td>{s.name}</td>
                  <td>{s.department || '-'}</td>
                  <td>{s.semester}</td>
                  <td>{s.teacher ? s.teacher.name : <span className="text-muted">Unassigned</span>}</td>
                  <td className="text-end">
                    <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => openAssignModal(s)}>
                      <i className="bi bi-person-check me-1"></i>Assign
                    </button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(s._id)}>
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Subject Modal */}
      {showModal && (
        <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">Create Subject</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Subject Name</label>
                    <input className="form-control" name="name" value={form.name} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Subject Code</label>
                    <input className="form-control" name="code" value={form.code} onChange={handleChange} required />
                  </div>
                  <div className="row">
                    <div className="col-6 mb-3">
                      <label className="form-label">Department</label>
                      <input
                        className="form-control"
                        name="department"
                        value={form.department}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-6 mb-3">
                      <label className="form-label">Semester</label>
                      <input
                        type="number"
                        min="1"
                        max="12"
                        className="form-control"
                        name="semester"
                        value={form.semester}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Saving...' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Assign Teacher Modal */}
      {assignModal && (
        <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleAssign}>
                <div className="modal-header">
                  <h5 className="modal-title">Assign Teacher — {assignModal.name}</h5>
                  <button type="button" className="btn-close" onClick={() => setAssignModal(null)}></button>
                </div>
                <div className="modal-body">
                  <label className="form-label">Select Teacher</label>
                  <select
                    className="form-select"
                    value={selectedTeacher}
                    onChange={(e) => setSelectedTeacher(e.target.value)}
                    required
                  >
                    <option value="">-- Select --</option>
                    {teachers.map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.name} ({t.email})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setAssignModal(null)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Assign
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSubjects;
