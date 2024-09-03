import React from 'react';
import './TaskList.css';

function TaskList({ tasks }) {
  if (tasks.length === 0) {
    return (
      <div className="task-list empty">
        <h2>Your Task List</h2>
        <p>You don't have any tasks yet. Add a new task or check out the suggested tasks!</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      <h2>Your Task List</h2>
      <ul>
        {tasks.map(task => (
          <li key={task.id} className="task-item">
            <h3>{task.name}</h3>
            <p>{task.description}</p>
            <span className="task-status">{task.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskList;