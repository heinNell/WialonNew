'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// Import Leaflet dynamically to avoid SSR issues
const Map = dynamic(() => import('@/components/LogisticsMap'), { ssr: false });

interface TaskDetail {
  id: number;
  name: string;
  description: string;
  status: string;
  assignedVehicle: any;
  checkpoints: Checkpoint[];
  createdAt: string;
  updatedAt: string;
  dueDate: string;
}

interface Checkpoint {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  order: number;
  status: 'pending' | 'completed';
  arrivalTime?: string;
}

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [task, setTask] = useState<TaskDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTask();
  }, [params.id]);

  async function loadTask() {
    try {
      const response = await fetch(`/api/logistics/tasks/${params.id}`);
      const data = await response.json();
      setTask(data);
    } catch (error) {
      console.error('Failed to load task:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateTaskStatus(newStatus: string) {
    try {
      await fetch(`/api/logistics/tasks/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      loadTask();
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  }

  if (loading) {
    return <div className="loading">Loading task details...</div>;
  }

  if (!task) {
    return <div className="error">Task not found</div>;
  }

  return (
    <div className="task-detail-page">
      <div className="header">
        <button onClick={() => router.back()} className="btn-back">
          ← Back
        </button>
        <h1>{task.name}</h1>
        <div className="actions">
          {task.status === 'pending' && (
            <button
              onClick={() => updateTaskStatus('in_progress')}
              className="btn-primary"
            >
              Start Task
            </button>
          )}
          {task.status === 'in_progress' && (
            <button
              onClick={() => updateTaskStatus('completed')}
              className="btn-success"
            >
              Complete Task
            </button>
          )}
        </div>
      </div>

      <div className="content-grid">
        {/* Left Column: Task Info */}
        <div className="info-panel">
          <div className="info-section">
            <h2>Task Information</h2>
            <div className="info-row">
              <span className="label">Status:</span>
              <span className={`status-badge status-${task.status}`}>
                {task.status.replace('_', ' ')}
              </span>
            </div>
            <div className="info-row">
              <span className="label">Assigned Vehicle:</span>
              <span>{task.assignedVehicle?.name || 'Unassigned'}</span>
            </div>
            <div className="info-row">
              <span className="label">Due Date:</span>
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
            <div className="info-row">
              <span className="label">Created:</span>
              <span>{new Date(task.createdAt).toLocaleString()}</span>
            </div>
          </div>

          <div className="info-section">
            <h2>Description</h2>
            <p>{task.description}</p>
          </div>

          <div className="info-section">
            <h2>Checkpoints ({task.checkpoints.length})</h2>
            <div className="checkpoints-list">
              {task.checkpoints.map((checkpoint, index) => (
                <div
                  key={checkpoint.id}
                  className={`checkpoint-item ${checkpoint.status}`}
                >
                  <div className="checkpoint-number">{index + 1}</div>
                  <div className="checkpoint-info">
                    <div className="checkpoint-name">{checkpoint.name}</div>
                    <div className="checkpoint-address">{checkpoint.address}</div>
                    {checkpoint.arrivalTime && (
                      <div className="checkpoint-time">
                        Arrived: {new Date(checkpoint.arrivalTime).toLocaleString()}
                      </div>
                    )}
                  </div>
                  <div className="checkpoint-status">
                    {checkpoint.status === 'completed' ? '✅' : '⏳'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Map */}
        <div className="map-panel">
          <h2>Route Map</h2>
          <Map
            checkpoints={task.checkpoints}
            vehicle={task.assignedVehicle}
          />
        </div>
      </div>

      <style jsx>{`
        .task-detail-page {
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .header h1 {
          flex: 1;
          font-size: 1.875rem;
          font-weight: 700;
        }

        .btn-back {
          padding: 0.5rem 1rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          cursor: pointer;
          font-weight: 500;
        }

        .btn-primary {
          background: #3b82f6;
          color: white;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          font-weight: 600;
        }

        .btn-success {
          background: #10b981;
          color: white;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          font-weight: 600;
        }

        .content-grid {
          display: grid;
          grid-template-columns: 400px 1fr;
          gap: 2rem;
        }

        .info-panel {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .info-section {
          background: white;
          padding: 1.5rem;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .info-section h2 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem 0;
          border-bottom: 1px solid #f3f4f6;
        }

        .info-row:last-child {
          border-bottom: none;
        }

        .label {
          font-weight: 500;
          color: #6b7280;
        }

        .checkpoints-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .checkpoint-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: #f9fafb;
          border-radius: 0.5rem;
        }

        .checkpoint-item.completed {
          background: #d1fae5;
        }

        .checkpoint-number {
          width: 2rem;
          height: 2rem;
          background: #3b82f6;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }

        .checkpoint-info {
          flex: 1;
        }

        .checkpoint-name {
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .checkpoint-address {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .checkpoint-time {
          font-size: 0.75rem;
          color: #059669;
          margin-top: 0.25rem;
        }

        .checkpoint-status {
          font-size: 1.5rem;
        }

        .map-panel {
          background: white;
          padding: 1.5rem;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .map-panel h2 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1rem;
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

        @media (max-width: 768px) {
          .content-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}