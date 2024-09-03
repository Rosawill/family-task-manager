import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import './SuggestedTasks.css';

function SuggestedTasks({ familyId, onAddTask }) {
  const [suggestedTasks, setSuggestedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSuggestedTasks();
  }, []);

  const fetchSuggestedTasks = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'suggestedTasks'));
      const taskList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSuggestedTasks(taskList);
    } catch (err) {
      console.error('Error fetching suggested tasks:', err);
      setError('Failed to load suggested tasks. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (task) => {
    try {
      const newTask = {
        name: task.name,
        description: task.description,
        status: 'Pending',
        familyId: familyId
      };
      const docRef = await addDoc(collection(db, 'tasks'), newTask);
      onAddTask({ id: docRef.id, ...newTask });
      alert('Task added successfully!');
    } catch (err) {
      console.error('Error adding task:', err);
      alert('Failed to add task. Please try again.');
    }
  };

  if (loading) return <div>Loading suggested tasks...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="suggested-tasks">
      <h2>Suggested Tasks</h2>
      {suggestedTasks.length === 0 ? (
        <p>No suggested tasks available at the moment.</p>
      ) : (
        <ul>
          {suggestedTasks.map(task => (
            <li key={task.id} className="suggested-task-item">
              <h3>{task.name}</h3>
              <p>{task.description}</p>
              <button onClick={() => handleAddTask(task)}>Add to My Tasks</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SuggestedTasks;