import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import Popup from './Popup';

function AddTaskForm({ familyId, onTaskAdded }) {
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [popup, setPopup] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newTask = {
        name: taskName,
        description: taskDescription,
        status: 'Pending',
        familyId: familyId
      };
      const docRef = await addDoc(collection(db, 'tasks'), newTask);
      onTaskAdded();  // Call the function without parameters
      setTaskName('');
      setTaskDescription('');
      setPopup({ message: 'Task added successfully!', isError: false });
    } catch (error) {
      console.error('Error adding task:', error);
      setPopup({ message: `Failed to add task. Error: ${error.message}`, isError: true });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-task-form">
      <h2>Add New Task</h2>
      <input
        type="text"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        placeholder="Task Name"
        required
      />
      <textarea
        value={taskDescription}
        onChange={(e) => setTaskDescription(e.target.value)}
        placeholder="Task Description"
        required
      />
      <button type="submit">Add Task</button>
      {popup && (
        <Popup
          message={popup.message}
          isError={popup.isError}
          onClose={() => setPopup(null)}
        />
      )}
    </form>
  );
}

export default AddTaskForm;