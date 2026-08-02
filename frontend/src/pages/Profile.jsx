// src/pages/Profile.jsx
// Displays logged-in user's profile details, fetched from GET /api/auth/me

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axios';
import Spinner from '../components/Spinner';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/auth/me');
        setProfile(res.data.data);
      } catch (err) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <Spinner text="Loading profile..." />;
  if (!profile) return <p className="text-muted">Profile not available.</p>;

  return (
    <div>
      <h3 className="fw-bold mb-4">
        <i className="bi bi-person-circle me-2"></i>My Profile
      </h3>

      <div className="row">
        <div className="col-md-6">
          <div className="table-responsive-wrapper">
            <table className="table table-borderless mb-0">
              <tbody>
                <tr>
                  <th style={{ width: '40%' }}>Name</th>
                  <td>{profile.name}</td>
                </tr>
                <tr>
                  <th>Email</th>
                  <td>{profile.email}</td>
                </tr>
                <tr>
                  <th>Role</th>
                  <td className="text-capitalize">
                    <span className="badge bg-primary">{user?.role}</span>
                  </td>
                </tr>
                {profile.rollNumber && (
                  <tr>
                    <th>Roll Number</th>
                    <td>{profile.rollNumber}</td>
                  </tr>
                )}
                {profile.department && (
                  <tr>
                    <th>Department</th>
                    <td>{profile.department}</td>
                  </tr>
                )}
                {profile.semester && (
                  <tr>
                    <th>Semester</th>
                    <td>{profile.semester}</td>
                  </tr>
                )}
                {profile.phone && (
                  <tr>
                    <th>Phone</th>
                    <td>{profile.phone}</td>
                  </tr>
                )}
                {profile.subjects && profile.subjects.length > 0 && (
                  <tr>
                    <th>Subjects</th>
                    <td>
                      {profile.subjects.map((s) => (
                        <span key={s._id} className="badge bg-secondary me-1">
                          {s.name} ({s.code})
                        </span>
                      ))}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
