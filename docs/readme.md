# Notion-Like App Backend Setup Guide

## Project Structure
```
project-root/
├── backend/                     # Backend directory
│   ├── config/                  # Configuration files
│   │   └── db.js                # MongoDB connection setup
│   ├── controllers/             # Controllers for handling logic
│   │   └── authController.js    # User authentication logic
│   │   └── pageController.js    # Logic for managing pages and content
│   ├── middleware/              # Middleware for API security and validation
│   │   └── authMiddleware.js    # JWT authentication middleware
│   │   └── errorMiddleware.js   # Global error handling
│   ├── models/                  # MongoDB schemas
│   │   └── User.js              # User schema
│   │   └── Page.js              # Schema for pages and subpages
│   │   └── Content.js           # Schema for content blocks within pages
│   ├── routes/                  # Routes for different API modules
│   │   └── authRoutes.js        # Routes for user authentication
│   │   └── pageRoutes.js        # Routes for managing pages
│   ├── utils/                   # Utility functions
│   │   └── generateToken.js     # Function to create JWT tokens
│   ├── app.js                   # Express application setup
│   ├── server.js                # Server entry point
│   └── .env                     # Environment variables (e.g., MongoDB URI, JWT secret)
├── src/                         # Frontend directory (remains unchanged)
│   ├── components/
│   ├── screens/
│   ├── theme/
│   └── App.js
├── assets/                      # Static assets (unchanged)
├── index.js                     # Root entry point for the backend
├── .gitignore
├── package.json                 # Node.js dependencies and scripts
├── README.md
```

---

## Backend File Details

### 1. **`backend/config/db.js`**
This file contains the logic to connect the application to the MongoDB database. It ensures a secure and reliable connection using the database URL stored in environment variables.

---

### 2. **`backend/models/`**
This folder contains MongoDB schemas, which define the structure and rules for storing and retrieving data from the database. For example:
- `User.js` handles user information like usernames, emails, and passwords.
- `Page.js` manages the structure of pages and subpages within the app.
- `Content.js` deals with individual content blocks on pages.

---

### 3. **`backend/routes/`**
This folder defines the API endpoints that the frontend will use to interact with the backend. For instance:
- `authRoutes.js` handles user authentication-related routes like login, registration, and token verification.
- `pageRoutes.js` provides routes for managing pages, such as creating, updating, and deleting them.

---

### 4. **`backend/controllers/`**
Controllers handle the core logic for each route. They process requests, interact with the database via models, and send appropriate responses back to the client. Examples include:
- `authController.js` for managing authentication logic like user registration and token generation.
- `pageController.js` for handling operations related to pages and their content.

---

### 5. **`backend/middleware/`**
Middleware functions enhance security and manage requests:
- `authMiddleware.js` ensures that only authenticated users can access certain routes by validating JWT tokens.
- `errorMiddleware.js` provides a centralized way to handle errors and send clear responses to the client.

---

### 6. **`backend/app.js`**
This is the main setup file for the backend application. It integrates all middleware, routes, and configurations into the Express app instance.

---

### 7. **`backend/server.js`**
The entry point for the backend server. It starts the application, listens on a specified port, and handles high-level configurations.

---

### 8. **Root `index.js`**
The central entry point for the entire backend. It loads environment variables, initializes the server, and ensures everything runs as expected.

---

### Environment Variables (`.env`)
This file securely stores sensitive information like:
- `MONGO_URI`: The MongoDB connection string.
- `PORT`: The port on which the backend server runs.

---

### Scripts in `package.json`
Defines scripts for running and managing the backend:
- `start:backend`: Runs the backend server using `nodemon` for live reloading during development.

---

## Steps to Run

1. **Install Dependencies**:
   Install the required Node.js libraries to set up the backend environment.

2. **Run the Backend**:
   Use the `start:backend` script to start the server and ensure it is running correctly.

---

This guide outlines the backend setup for your Notion-like application. It provides a clean and modular structure to ensure scalability and maintainability.