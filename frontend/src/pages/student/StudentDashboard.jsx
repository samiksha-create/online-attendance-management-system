// src/pages/student/StudentDashboard.jsx
// Student overview - attendance percentage summary + doughnut chart

import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { toast } from 'react-toastify';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';

ChartJS.register(ArcElement, Tooltip, Legend);

const StudentDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await api.get('/attendance/student');
        setSummary(res.data.summary);
      } catch (err) {
        toast.error('Failed to load attendance summary');
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  if (loading) return <Spinner text="Loading dashboard..." />;

  const chartData = {
    labels: ['Present', 'Absent', 'Late'],
    datasets: [
      {
        data: [summary?.present || 0, summary?.absent || 0, summary?.late || 0],
        backgroundColor: ['#198754', '#dc3545', '#ffc107'],
        borderWidth: 1,
      },
    ],
  };

  const percentage = parseFloat(summary?.percentage || 0);
  const percentColor = percentage >= 75 ? 'text-success' : percentage >= 50 ? 'text-warning' : 'text-danger';

  return (
    <div>
      <h3 className="fw-bold mb-4">
        <i className="bi bi-speedometer2 me-2"></i>Student Dashboard
      </h3>

      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card stat-card p-3 text-center">
            <div className="text-muted small">Total Classes</div>
            <div className="stat-value text-primary">{summary?.total || 0}</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card stat-card p-3 text-center">
            <div className="text-muted small">Present</div>
            <div className="stat-value text-success">{summary?.present || 0}</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card stat-card p-3 text-center">
            <div className="text-muted small">Absent</div>
            <div className="stat-value text-danger">{summary?.absent || 0}</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card stat-card p-3 text-center">
            <div className="text-muted small">Attendance %</div>
            <div className={`stat-value ${percentColor}`}>{summary?.percentage || '0.00'}%</div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-5">
          <div className="card p-4">
            <h6 className="fw-semibold mb-3">Attendance Breakdown</h6>
            {summary && summary.total > 0 ? (
              <Doughnut data={chartData} />
            ) : (
              <p className="text-muted small mb-0">No attendance records yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
