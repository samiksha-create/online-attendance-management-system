// src/pages/admin/AdminDashboard.jsx
// Admin overview dashboard - stat cards + attendance status pie chart

import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { toast } from 'react-toastify';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';

ChartJS.register(ArcElement, Tooltip, Legend);

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ teachers: 0, students: 0, subjects: 0 });
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [teachersRes, studentsRes, subjectsRes, reportRes] = await Promise.all([
          api.get('/admin/teachers?limit=1'),
          api.get('/admin/students?limit=1'),
          api.get('/subjects'),
          api.get('/attendance/report'),
        ]);

        setStats({
          teachers: teachersRes.data.total ?? 0,
          students: studentsRes.data.total ?? 0,
          subjects: subjectsRes.data.count ?? 0,
        });

        const records = reportRes.data.data || [];
        const present = records.filter((r) => r.status === 'Present').length;
        const absent = records.filter((r) => r.status === 'Absent').length;
        const late = records.filter((r) => r.status === 'Late').length;

        setChartData({
          labels: ['Present', 'Absent', 'Late'],
          datasets: [
            {
              data: [present, absent, late],
              backgroundColor: ['#198754', '#dc3545', '#ffc107'],
              borderWidth: 1,
            },
          ],
        });
      } catch (err) {
        toast.error('Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <Spinner text="Loading dashboard..." />;

  return (
    <div>
      <h3 className="fw-bold mb-4">
        <i className="bi bi-speedometer2 me-2"></i>Admin Dashboard
      </h3>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card stat-card p-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="text-muted small">Total Teachers</div>
                <div className="stat-value text-primary">{stats.teachers}</div>
              </div>
              <i className="bi bi-person-workspace fs-1 text-primary opacity-50"></i>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card stat-card p-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="text-muted small">Total Students</div>
                <div className="stat-value text-success">{stats.students}</div>
              </div>
              <i className="bi bi-people fs-1 text-success opacity-50"></i>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card stat-card p-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="text-muted small">Total Subjects</div>
                <div className="stat-value text-warning">{stats.subjects}</div>
              </div>
              <i className="bi bi-journal-bookmark fs-1 text-warning opacity-50"></i>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="card p-4">
            <h6 className="fw-semibold mb-3">Overall Attendance Distribution</h6>
            {chartData && chartData.datasets[0].data.some((v) => v > 0) ? (
              <Pie data={chartData} />
            ) : (
              <p className="text-muted small mb-0">No attendance records yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
