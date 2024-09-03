import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

function AddTaskForm({ familyId, onTaskAdded }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'tasks'), {
        name,
        description,
        familyId,
        status: 'Pending'
      });
      setName('');
      setDescription('');
      onTaskAdded();
      alert('Task added successfully!');
    } catch (error) {
      console.error('Error adding task:', error);
      alert('Failed to add task. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-task-form">
      <h2>Add New Task</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Task Name"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Task Description"
        required
      />
      <button type="submit">Add Task</button>
    </form>
  );
}

export default AddTaskForm;