# Family Task Manager

Family Task Manager is a full-stack web application designed to help families organize and manage their tasks collaboratively. It allows family members to create, view, and manage tasks together, making household management more efficient and transparent.

## Features

- User Authentication: Sign up, log in, and manage user accounts
- Family Creation: Create a new family when signing up
- Task Management: Add, view, update, and delete tasks for your family
- Suggested Tasks: View and add pre-defined suggested tasks to your family's task list
- Task Sorting and Filtering: Sort tasks by name or status, and filter tasks by keyword
- Responsive Design: Mobile-friendly interface for easy access on various devices

## Technologies Used

- Frontend: React.js
- Backend: Node.js with Express.js
- Database: Firebase Firestore
- Authentication: Firebase Authentication
- Styling: CSS3 with a mobile-first approach

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- Firebase account and project

## Setup and Installation

### Backend Setup

1. Clone the repository:
   ```
   git clone https://github.com/your-username/family-task-manager.git
   cd family-task-manager/server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up your Firebase configuration:
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Generate a new private key for your service account (Project settings > Service accounts > Generate new private key)
   - Save the JSON file as `serviceAccountKey.json` in the `server/config` directory

4. Create a `.env` file in the `server` directory with the following content:
   ```
   PORT=5000
   ```

5. Start the server:
   ```
   npm start
   ```

   Note the port number that the server is running on, as you'll need it for the frontend configuration.

### Frontend Setup

1. Navigate to the client directory:
   ```
   cd ../client
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up your Firebase configuration:
   - In the Firebase Console, go to Project settings > General > Your apps > Web app
   - Copy the Firebase configuration object

4. Create a `.env` file in the `client` directory with the following content:
   ```
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   ```

5. Update the `src/config.js` file with the correct backend port:
   ```javascript
   const config = {
     API_BASE_URL: 'http://localhost:5000/api'  // Update 5000 with the actual port if different
   };

   export default config;
   ```

6. Start the development server:
   ```
   npm start
   ```

7. Open `http://localhost:3000` in your browser to view the app.

## Usage

1. Sign up for a new account or log in if you already have one.
2. Create a new family during the sign-up process.
3. Once in the main dashboard, you can:
   - View your family's task list
   - Add new tasks
   - View and add suggested tasks
   - Update task statuses
   - Sort tasks by name or status
   - Filter tasks by keyword

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- Thanks to all contributors who have helped shape this project.
- Special thanks to the React and Firebase communities for their excellent documentation and support.