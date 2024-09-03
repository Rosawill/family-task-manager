import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import './TaskList.css';

function TaskList({ tasks, onTasksUpdated }) {
  const [sortedTasks, setSortedTasks] = useState([]);
  const [sortOrder, setSortOrder] = useState('default');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    let filtered = tasks.filter(task => 
      task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    switch(sortOrder) {
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'status':
        filtered.sort((a, b) => a.status.localeCompare(b.status));
        break;
      default:
        // Keep original order
        break;
    }

    setSortedTasks(filtered);
  }, [tasks, sortOrder, searchTerm]);

  const handleStatusChange = async (taskId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'Pending' ? 'Completed' : 'Pending';
      await updateDoc(doc(db, 'tasks', taskId), { status: newStatus });
      onTasksUpdated();
    } catch (error) {
      console.error('Error updating task status:', error);
      alert(`Failed to update task status. Error: ${error.message}`);
    }
  };

  return (
    <div className="task-list">
      <h2>Your Task List</h2>
      <div className="task-controls">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="task-search"
        />
        <select 
          value={sortOrder} 
          onChange={(e) => setSortOrder(e.target.value)}
          className="task-sort"
        >
          <option value="default">Default Order</option>
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="status">Status</option>
        </select>
      </div>
      {sortedTasks.length === 0 ? (
        <p className="no-tasks">No tasks found. Add a new task or adjust your search.</p>
      ) : (
        <ul>
          {sortedTasks.map(task => (
            <li key={task.id} className="task-item">
              <div className="task-info">
                <h3>{task.name}</h3>
                <p>{task.description}</p>
              </div>
              <button 
                onClick={() => handleStatusChange(task.id, task.status)}
                className={task.status.toLowerCase()}
              >
                {task.status === 'Pending' ? 'Mark Completed' : 'Mark Pending'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TaskList;