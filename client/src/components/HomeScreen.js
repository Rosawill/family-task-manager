import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import TaskList from './TaskList';
import SuggestedTasks from './SuggestedTasks';
import AddTaskForm from './AddTaskForm';
import './HomeScreen.css';

function HomeScreen({ onSignOut }) {
  const [firstName, setFirstName] = useState('');
  const [familyId, setFamilyId] = useState('');
  const [tasks, setTasks] = useState([]);
  const [view, setView] = useState('tasks');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFirstName(userData.firstName);
          setFamilyId(userData.familyId);
          await fetchTasks(userData.familyId);
        }
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async (familyId) => {
    try {
      const q = query(collection(db, 'tasks'), where('familyId', '==', familyId));
      const querySnapshot = await getDocs(q);
      const taskList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTasks(taskList);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      onSignOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleTasksUpdated = () => {
    fetchTasks(familyId);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="home-screen">
      <header>
        <h1>Hello, {firstName || auth.currentUser?.email || 'User'}!</h1>
        <button onClick={handleSignOut} className="sign-out-btn">Sign Out</button>
      </header>
      <nav className="main-nav">
        <button onClick={() => setView('tasks')} className={view === 'tasks' ? 'active' : ''}>Task List</button>
        <button onClick={() => setView('suggested')} className={view === 'suggested' ? 'active' : ''}>Suggested Tasks</button>
        <button onClick={() => setView('add')} className={view === 'add' ? 'active' : ''}>Add Task</button>
      </nav>
      <main>
        {view === 'tasks' && <TaskList tasks={tasks} onTasksUpdated={handleTasksUpdated} />}
        {view === 'suggested' && <SuggestedTasks familyId={familyId} onTasksUpdated={handleTasksUpdated} />}
        {view === 'add' && <AddTaskForm familyId={familyId} onTaskAdded={handleTasksUpdated} />}
      </main>
    </div>
  );
}

export default HomeScreen;