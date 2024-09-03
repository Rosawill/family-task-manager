# family-task-manager
A mobile-first web application for a shared family task tracker. Allows family members to create, view, and manage tasks together. Includes a frontend, simple backend API, and basic database schema.

# Family Task Manager

Family Task Manager is a web application designed to help families organize and manage their tasks collaboratively. It allows family members to create, view, and manage tasks together, making household management more efficient and transparent.

## Features

- User Authentication: Sign up, log in, and manage user accounts
- Family Creation/Joining: Create a new family or join an existing one with a family code
- Task Management: Add, view, and update tasks for your family
- Suggested Tasks: View and add pre-defined suggested tasks to your family's task list
- Responsive Design: Mobile-friendly interface for easy access on various devices

## Technologies Used

- Frontend: React.js
- Backend: Firebase (Authentication and Firestore)
- Styling: CSS3 with a mobile-first approach

## Setup and Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/family-task-manager.git
   cd family-task-manager
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up Firebase:
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication and Firestore in your Firebase project
   - Copy your Firebase configuration
   - Create a `.env` file in the root directory and add your Firebase config:
     ```
     REACT_APP_FIREBASE_API_KEY=your_api_key
     REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
     REACT_APP_FIREBASE_PROJECT_ID=your_project_id
     REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
     REACT_APP_FIREBASE_APP_ID=your_app_id
     ```

4. Start the development server:
   ```
   npm start
   ```

5. Open `http://localhost:3000` in your browser to view the app.

## Usage

1. Sign up for a new account or log in if you already have one.
2. Create a new family or join an existing one using a family code.
3. Once in the main dashboard, you can:
   - View your family's task list
   - Add new tasks
   - View and add suggested tasks
   - Update task statuses
