'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Task {
  id: number;
  name: string;
  status: 'pending' | 'in_progress' | 'completed';
  assignedVehicle: string | null;
  checkpoints: number;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
}

export default function LogisticsPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    try {
      setLoading(true);
      const response = await fetch('/api/logistics/tasks');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

  return (
    <div className="logistics-page">
      <div className="header">
        <h1>📦 Logistics Management</h1>
        <Link href="/logistics/new" className="btn-primary">
          + New Task
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <StatCard
          title="Total Tasks"
          value={stats.total}
          icon="📋"
          color="blue"
        />
        <StatCard
          title="Pending"
          value={stats.pending}
          icon="⏳"
          color="yellow"
        />
        <StatCard
          title="In Progress"
          value={stats.inProgress}
          icon="🚚"
          color="orange"
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          icon="✅"
          color="green"
        />
      </div>

      {/* Filters */}
      <div className="filters">
        <button
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={filter === 'pending' ? 'active' : ''}
          onClick={() => setFilter('pending')}
        >
          Pending
        </button>
        <button
          className={filter === 'in_progress' ? 'active' : ''}
          onClick={() => setFilter('in_progress')}
        >
          In Progress
        </button>
        <button
          className={filter === 'completed' ? 'active' : ''}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>

      {/* Tasks Table */}
      <div className="tasks-container">
        {loading ? (
          <div className="loading">Loading tasks...</div>
        ) : (
          <table className="tasks-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Task Name</th>
                <th>Status</th>
                <th>Assigned Vehicle</th>
                <th>Checkpoints</th>
                <th>Priority</th>
                <th>Due Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map(task => (
                <tr key={task.id}>
                  <td>{task.id}</td>
                  <td>{task.name}</td>
                  <td>
                    <span className={`status-badge status-${task.status}`}>
                      {task.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>{task.assignedVehicle || 'Unassigned'}</td>
                  <td>{task.checkpoints}</td>
                  <td>
                    <span className={`priority-badge priority-${task.priority}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td>{new Date(task.dueDate).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <Link href={`/logistics/${task.id}`}>
                        <button className="btn-icon" title="View">
                          👁️
                        </button>
                      </Link>
                      <Link href={`/logistics/${task.id}/edit`}>
                        <button className="btn-icon" title="Edit">
                          ✏️
                        </button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <style jsx>{`
        .logistics-page {
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .header h1 {
          font-size: 2rem;
          font-weight: 700;
        }

        .btn-primary {
          background: #3b82f6;
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          text-decoration: none;
          font-weight: 600;
          transition: background 0.2s;
        }

        .btn-primary:hover {
          background: #2563eb;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .filters {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .filters button {
          padding: 0.5rem 1.5rem;
          border: 2px solid #e5e7eb;
          background: white;
          border-radius: 0.5rem;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }

        .filters button.active {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }

        .tasks-container {
          background: white;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .tasks-table {
          width: 100%;
          border-collapse: collapse;
        }

        .tasks-table th {
          background: #f9fafb;
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          border-bottom: 2px solid #e5e7eb;
        }

        .tasks-table td {
          padding: 1rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .tasks-table tbody tr:hover {
          background: #f9fafb;
        }

        .status-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .status-pending {
          background: #fef3c7;
          color: #92400e;
        }

        .status-in_progress {
          background: #fed7aa;
          color: #9a3412;
        }

        .status-completed {
          background: #d1fae5;
          color: #065f46;
        }

        .priority-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 0.25rem;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .priority-low {
          background: #dbeafe;
          color: #1e40af;
        }

        .priority-medium {
          background: #fef3c7;
          color: #92400e;
        }

        .priority-high {
          background: #fee2e2;
          color: #991b1b;
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .btn-icon {
          padding: 0.5rem;
          border: none;
          background: transparent;
          cursor: pointer;
          font-size: 1.25rem;
          border-radius: 0.25rem;
          transition: background 0.2s;
        }

        .btn-icon:hover {
          background: #f3f4f6;
        }

        .loading {
          text-align: center;
          padding: 4rem;
          color: #6b7280;
        }
      `}</style>
    </div>
  );
}

function StatCard({ title, value, icon, color }: any) {
  const colors = {
    blue: { bg: '#dbeafe', text: '#1e40af' },
    yellow: { bg: '#fef3c7', text: '#92400e' },
    orange: { bg: '#fed7aa', text: '#9a3412' },
    green: { bg: '#d1fae5', text: '#065f46' },
  };

  const colorScheme = colors[color as keyof typeof colors];

  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: colorScheme.bg }}>
        {icon}
      </div>
      <div className="stat-content">
        <div className="stat-title">{title}</div>
        <div className="stat-value" style={{ color: colorScheme.text }}>
          {value}
        </div>
      </div>

      <style jsx>{`
        .stat-card {
          background: white;
          padding: 1.5rem;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .stat-icon {
          width: 3rem;
          height: 3rem;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }

        .stat-content {
          flex: 1;
        }

        .stat-title {
          font-size: 0.875rem;
          color: #6b7280;
          margin-bottom: 0.25rem;
        }

        .stat-value {
          font-size: 1.875rem;
          font-weight: 700;
        }
      `}</style>
    </div>
  );
}