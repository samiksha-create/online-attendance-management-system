// src/pages/admin/ManageStudents.jsx
// Admin: Add / Update / Delete students, with search and pagination

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';

const emptyForm = { name: '', email: '', password: '', rollNumber: '', phone: '', department: '', semester: 1 };

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/students?search=${search}&page=${page}&limit=8`);
      setStudents(res.data.data);
      setPages(res.data.pages || 1);
    } catch (err) {
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchStudents();
  };

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (student) => {
    setEditingId(student._id);
    setForm({
      name: student.name,
      email: student.email,
      password: '',
      rollNumber: student.rollNumber,
      phone: student.phone || '',
      department: student.department || '',
      semester: student.semester || 1,
    });
    setShowModal(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/admin/students/${editingId}`, form);
        toast.success('Student updated successfully');
      } else {
        await api.post('/admin/students', form);
        toast.success('Student added successfully');
      }
      setShowModal(false);
      fetchStudents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    try {
      await api.delete(`/admin/students/${id}`);
      toast.success('Student deleted');
      fetchStudents();
    } catch (err) {
      toast.error('Failed to delete student');
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h3 className="fw-bold mb-0">
          <i className="bi bi-people me-2"></i>Manage Students
        </h3>
        <button className="btn btn-primary" onClick={openAddModal}>
          <i className="bi bi-plus-lg me-1"></i>Add Student
        </button>
      </div>

      <form className="d-flex mb-3" onSubmit={handleSearch}>
        <input
          type="text"
          className="form-control me-2"
          placeholder="Search by name, email or roll number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn btn-outline-secondary" type="submit">
          <i className="bi bi-search"></i>
        </button>
      </form>

      {loading ? (
        <Spinner text="Loading students..." />
      ) : (
        <div className="table-responsive-wrapper">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>Roll No.</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Semester</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center text-muted py-3">
                    No students found.
                  </td>
                </tr>
              )}
              {students.map((s) => (
                <tr key={s._id}>
                  <td>{s.rollNumber}</td>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.department || '-'}</td>
                  <td>{s.semester}</td>
                  <td>
                    <span className={`badge ${s.isActive ? 'bg-success' : 'bg-danger'}`}>
                      {s.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="text-end">
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => openEditModal(s)}>
                      <i className="bi bi-pencil-square"></i>
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

      {pages > 1 && (
        <nav className="mt-3">
          <ul className="pagination justify-content-center">
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <li key={p} className={`page-item ${p === page ? 'active' : ''}`}>
                <button className="page-link" onClick={() => setPage(p)}>
                  {p}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {showModal && (
        <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">{editingId ? 'Edit Student' : 'Add Student'}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input className="form-control" name="name" value={form.name} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  {!editingId && (
                    <div className="mb-3">
                      <label className="form-label">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        minLength={6}
                      />
                    </div>
                  )}
                  <div className="mb-3">
                    <label className="form-label">Roll Number</label>
                    <input
                      className="form-control"
                      name="rollNumber"
                      value={form.rollNumber}
                      onChange={handleChange}
                      required
                      disabled={!!editingId}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Phone</label>
                    <input className="form-control" name="phone" value={form.phone} onChange={handleChange} />
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
                    {saving ? 'Saving...' : 'Save'}
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

export default ManageStudents;
