import React from 'react';

function TaskDetail({ task, onClose }) {
  return (
    <div className="task-detail">
      <h2>{task.name}</h2>
      <p>Description: {task.description}</p>
      <p>Status: {task.status}</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
}

export default TaskDetail;