const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const serviceAccount = require(path.join(__dirname, '../config/serviceAccountKey.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

console.log('Attempting to connect to Firebase...');

db.collection('tasks').limit(1).get()
  .then(() => {
    console.log('Successfully connected to Firebase');
  })
  .catch((error) => {
    console.error('Failed to connect to Firebase:', error);
  });

  const app = express();
  app.use(cors());
  app.use(bodyParser.json());

// Fetch family tasks
app.get('/api/tasks/:familyId', async (req, res) => {
  try {
    const familyId = req.params.familyId;
    const tasksSnapshot = await db.collection('tasks').where('family_id', '==', familyId).get();
    const tasks = [];
    tasksSnapshot.forEach(doc => {
      tasks.push({ id: doc.id, ...doc.data() });
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Add a new task
app.post('/api/tasks', async (req, res) => {
  try {
    const { family_id, name, description, status } = req.body;
    const newTask = await db.collection('tasks').add({
      family_id,
      name,
      description,
      status
    });
    res.status(201).json({ id: newTask.id });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Update a task's status
app.put('/api/tasks/:taskId', async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const { status } = req.body;
    await db.collection('tasks').doc(taskId).update({ status });
    res.status(200).send('Task updated successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Fetch suggested tasks
app.get('/api/suggested-tasks', async (req, res) => {
  try {
    const suggestedTasksSnapshot = await db.collection('suggested_tasks').get();
    const suggestedTasks = [];
    suggestedTasksSnapshot.forEach(doc => {
      suggestedTasks.push({ id: doc.id, ...doc.data() });
    });
    res.json(suggestedTasks);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  const address = server.address();
  const actualPort = address.port;
  console.log(`Server is now running on port ${actualPort}`);
  
  // Write the port to a log file
  fs.writeFileSync(path.join(__dirname, 'server.log'), `Server is now running on port ${actualPort}\n`);
})
.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  switch (error.code) {
    case 'EACCES':
      console.error(`Port ${PORT} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`Port ${PORT} is already in use`);
      console.log('Trying alternative port...');
      server.listen(0);
      break;
    default:
      throw error;
  }
});

server.on('listening', () => {
  const address = server.address();
  console.log(`Server is now running on port ${address.port}`);
  
  // Write the port to a log file
  fs.writeFileSync(path.join(__dirname, 'server.log'), `Server is now running on port ${address.port}\n`);
});