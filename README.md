# Task Management System

Task Management System is a web application that allows users to create, track, and manage their daily tasks efficiently.

## Features

- User authentication and registration
- Add, edit, and delete tasks
- Filter tasks by status (All, Scheduled, In Progress, Completed)
- User-friendly interface with responsive design

## Technologies Used

### Frontend
- React.js
- Ant Design
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- JSON Web Token (JWT) for authentication

## Prerequisites

- Node.js (version 14 or later)
- MongoDB

## Installation and Setup

1. Clone the repository:
   ```
   git clone https://github.com/your-username/task-management-system.git
   cd task-management-system
   ```

2. Install backend dependencies:
   ```
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```
   cd ../frontend
   npm install
   ```

4. Set up environment variables:
   Create a `.env` file in the `backend` folder and add the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

5. Run the backend server:
   ```
   cd backend
   npm start
   ```

6. Run the frontend:
   ```
   cd frontend
   npm start
   ```

7. Open your browser and navigate to `http://localhost:3000` to access the application.

## Usage

1. Create a new account or log in if you already have one.
2. Use the "Add Task" form to create new tasks.
3. Use the sidebar menu to filter tasks by their status.
4. Click on tasks to edit or delete them.

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Open an issue to discuss the change you wish to make.
2. Fork the repository and create a new branch.
3. Make your changes and test them thoroughly.
4. Submit a pull request with a detailed description of your changes.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.
