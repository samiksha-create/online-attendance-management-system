// src/pages/admin/ManageTeachers.jsx
// Admin: Add / Update / Delete teachers, with search and pagination

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';

const emptyForm = { name: '', email: '', password: '', phone: '', department: '' };

const ManageTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/teachers?search=${search}&page=${page}&limit=8`);
      setTeachers(res.data.data);
      setPages(res.data.pages || 1);
    } catch (err) {
      toast.error('Failed to load teachers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchTeachers();
  };

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (teacher) => {
    setEditingId(teacher._id);
    setForm({
      name: teacher.name,
      email: teacher.email,
      password: '',
      phone: teacher.phone || '',
      department: teacher.department || '',
    });
    setShowModal(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/admin/teachers/${editingId}`, form);
        toast.success('Teacher updated successfully');
      } else {
        await api.post('/admin/teachers', form);
        toast.success('Teacher added successfully');
      }
      setShowModal(false);
      fetchTeachers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this teacher?')) return;
    try {
      await api.delete(`/admin/teachers/${id}`);
      toast.success('Teacher deleted');
      fetchTeachers();
    } catch (err) {
      toast.error('Failed to delete teacher');
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h3 className="fw-bold mb-0">
          <i className="bi bi-person-workspace me-2"></i>Manage Teachers
        </h3>
        <button className="btn btn-primary" onClick={openAddModal}>
          <i className="bi bi-plus-lg me-1"></i>Add Teacher
        </button>
      </div>

      <form className="d-flex mb-3" onSubmit={handleSearch}>
        <input
          type="text"
          className="form-control me-2"
          placeholder="Search by name, email or department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn btn-outline-secondary" type="submit">
          <i className="bi bi-search"></i>
        </button>
      </form>

      {loading ? (
        <Spinner text="Loading teachers..." />
      ) : (
        <div className="table-responsive-wrapper">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Department</th>
                <th>Subjects</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center text-muted py-3">
                    No teachers found.
                  </td>
                </tr>
              )}
              {teachers.map((t) => (
                <tr key={t._id}>
                  <td>{t.name}</td>
                  <td>{t.email}</td>
                  <td>{t.phone || '-'}</td>
                  <td>{t.department || '-'}</td>
                  <td>
                    {t.subjects?.length > 0
                      ? t.subjects.map((s) => (
                          <span key={s._id} className="badge bg-secondary me-1">
                            {s.code}
                          </span>
                        ))
                      : '-'}
                  </td>
                  <td>
                    <span className={`badge ${t.isActive ? 'bg-success' : 'bg-danger'}`}>
                      {t.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="text-end">
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => openEditModal(t)}>
                      <i className="bi bi-pencil-square"></i>
                    </button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(t._id)}>
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
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

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">{editingId ? 'Edit Teacher' : 'Add Teacher'}</h5>
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
                    <label className="form-label">Phone</label>
                    <input className="form-control" name="phone" value={form.phone} onChange={handleChange} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Department</label>
                    <input
                      className="form-control"
                      name="department"
                      value={form.department}
                      onChange={handleChange}
                    />
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

export default ManageTeachers;
