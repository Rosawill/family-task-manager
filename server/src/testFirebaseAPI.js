const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Function to get the port from the server logs
function getPortFromLogs() {
  const logPath = path.join(__dirname, 'server.log');
  try {
    const logs = fs.readFileSync(logPath, 'utf8');
    const portMatch = logs.match(/Server is now running on port (\d+)/);
    if (portMatch && portMatch[1]) {
      return parseInt(portMatch[1], 10);
    }
  } catch (error) {
    console.error('Error reading server logs:', error);
  }
  return 5000; // Default to 5000 if we can't find the port
}

const PORT = getPortFromLogs();
const API_BASE_URL = `http://localhost:${PORT}/api`;
const TEST_FAMILY_ID = 'BTBFiHIeyEY98Kj0tRKj'; // Make sure this is a valid family ID in your database

async function testFirebaseAPI() {
  console.log(`Testing API at ${API_BASE_URL}`);
  try {
    // Test adding a task
    console.log('Testing: Add a new task');
    const addTaskResponse = await axios.post(`${API_BASE_URL}/tasks`, {
      family_id: TEST_FAMILY_ID,
      name: 'Test Task',
      description: 'This is a test task',
      status: 'Pending'
    });
    console.log('Add task response:', addTaskResponse.data);
    const newTaskId = addTaskResponse.data.id;

    // Test fetching family tasks
    console.log('\nTesting: Fetch family tasks');
    const tasksResponse = await axios.get(`${API_BASE_URL}/tasks/${TEST_FAMILY_ID}`);
    console.log('Family tasks:', tasksResponse.data);

    // Test updating a task
    console.log('\nTesting: Update task status');
    const updateResponse = await axios.put(`${API_BASE_URL}/tasks/${newTaskId}`, {
      status: 'Completed'
    });
    console.log('Update task response:', updateResponse.data);

    // Test fetching suggested tasks
    console.log('\nTesting: Fetch suggested tasks');
    const suggestedTasksResponse = await axios.get(`${API_BASE_URL}/suggested-tasks`);
    console.log('Suggested tasks:', suggestedTasksResponse.data);

    console.log('\nAll tests completed successfully!');
  } catch (error) {
    console.error('An error occurred during testing:');
    if (error.response) {
      console.error('Error data:', error.response.data);
      console.error('Error status:', error.response.status);
      console.error('Error headers:', error.response.headers);
    } else if (error.request) {
      console.error('Error request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    console.error('Error config:', error.config);
  }
}

testFirebaseAPI();