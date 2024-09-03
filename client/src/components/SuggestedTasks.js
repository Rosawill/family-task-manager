import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc, query, where, deleteDoc, doc } from 'firebase/firestore';
import Popup from './Popup';
import './SuggestedTasks.css';

function SuggestedTasks({ familyId, onTasksUpdated }) {
  const [suggestedTasks, setSuggestedTasks] = useState([]);
  const [familyTasks, setFamilyTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [popup, setPopup] = useState(null);
  const [sortOrder, setSortOrder] = useState('default');

  useEffect(() => {
    fetchSuggestedTasks();
    fetchFamilyTasks();
  }, [familyId]);

  useEffect(() => {
    let sorted = [...suggestedTasks];
    switch(sortOrder) {
      case 'name-asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Keep original order
        break;
    }
    setSuggestedTasks(sorted);
  }, [sortOrder]);

  const fetchSuggestedTasks = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'suggested_tasks'));
      const taskList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSuggestedTasks(taskList);
    } catch (err) {
      console.error('Error fetching suggested tasks:', err);
      setError('Failed to load suggested tasks. Please try again later.');
    }
  };

  const fetchFamilyTasks = async () => {
    try {
      const q = query(collection(db, 'tasks'), where('familyId', '==', familyId));
      const querySnapshot = await getDocs(q);
      const taskList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFamilyTasks(taskList);
    } catch (err) {
      console.error('Error fetching family tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const isTaskInFamily = (suggestedTaskId) => {
    return familyTasks.some(task => task.suggestedTaskId === suggestedTaskId);
  };

  const handleAddTask = async (task) => {
    try {
      const newTask = {
        name: task.name,
        description: task.description,
        status: 'Pending',
        familyId: familyId,
        suggestedTaskId: task.id
      };
      await addDoc(collection(db, 'tasks'), newTask);
      await fetchFamilyTasks();
      onTasksUpdated();
      setPopup({ message: 'Task added successfully!', isError: false });
    } catch (err) {
      console.error('Error adding task:', err);
      setPopup({ message: `Failed to add task. Error: ${err.message}`, isError: true });
    }
  };

  const handleRemoveTask = async (suggestedTaskId) => {
    try {
      const taskToRemove = familyTasks.find(task => task.suggestedTaskId === suggestedTaskId);
      if (taskToRemove) {
        await deleteDoc(doc(db, 'tasks', taskToRemove.id));
        await fetchFamilyTasks();
        onTasksUpdated();
        setPopup({ message: 'Task removed successfully!', isError: false });
      } else {
        throw new Error('Task not found in family tasks');
      }
    } catch (err) {
      console.error('Error removing task:', err);
      setPopup({ message: `Failed to remove task. Error: ${err.message}`, isError: true });
    }
  };

  if (loading) return <div>Loading suggested tasks...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="suggested-tasks">
      <h2>Suggested Tasks</h2>
      <div className="task-controls">
        <select 
          value={sortOrder} 
          onChange={(e) => setSortOrder(e.target.value)}
          className="task-sort"
        >
          <option value="default">Default Order</option>
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
        </select>
      </div>
      {suggestedTasks.length === 0 ? (
        <p>No suggested tasks available at the moment.</p>
      ) : (
        <ul>
          {suggestedTasks.map(task => (
            <li key={task.id} className="suggested-task-item">
              <h3>{task.name}</h3>
              <p>{task.description}</p>
              {isTaskInFamily(task.id) ? (
                <button onClick={() => handleRemoveTask(task.id)}>Remove from My Tasks</button>
              ) : (
                <button onClick={() => handleAddTask(task)}>Add to My Tasks</button>
              )}
            </li>
          ))}
        </ul>
      )}
      {popup && (
        <Popup
          message={popup.message}
          isError={popup.isError}
          onClose={() => setPopup(null)}
        />
      )}
    </div>
  );
}

export default SuggestedTasks;