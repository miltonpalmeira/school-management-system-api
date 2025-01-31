# Student Enrollment System
A Node.js application for enrolling students into schools and classrooms. The backend provides a RESTful API for managing students, schools, and classrooms.

# Table of Contents
## Technologies Used
## Prerequisites
Backend Setup
Running the Application
Testing
Project Structure
Technologies Used

# Backend:

Node.js (with Express)
MongoDB (with Mongoose for database interactions)
JSON Web Tokens (JWT) for authentication
Jest for unit and integration testing

# Prerequisites
Before you begin, ensure you have the following installed:

Node.js (v14 or later)
MongoDB (Locally or Cloud instance, e.g., MongoDB Atlas)
Git

# Backend Setup
Clone the repository:

bash
git clone https://github.com/your-username/student-enrollment-system.git
cd student-enrollment-system
Install dependencies:

bash
npm install
Set up environment variables:

Rename the file .env.example to .env

bash
npm start
This will start the server on http://localhost:30000.

# Running the Application
Navigate to http://localhost:30000/api-docs/ in your browser to view the swagger.
You can now create, update, and enroll students into schools and classrooms through the swagger UI.

# Testing
## Backend Tests
The project uses Jest for testing the backend. To run the tests, use the following command:

bash
npm test

bash
npm run test

# Running Tests for Specific Endpoints
To test the enrollment functionality or any other API routes, make sure the backend is running and use a tool like Postman or Swagger UI to send requests to the server.

# Project Structure
The project follows a modular structure, with the following layout:

student-enrollment-system/
├── __mocks__/                # Mocked modules or data for testing
├── cache/                    # Cache-related services or data management
├── config/                   
├── connect/                  # Database connection setup
├── controllers/              # API controllers (logic for handling requests)
├── libs/                     # Libraries or helper functions
├── loaders/                  # App initialization and dependency loading
├── managers/                 
├── models/                   # Mongoose models
├── mws/                      # Middlewares (e.g., auth, validation)
├── public/                   # Public assets (e.g., images, fonts)
├── routes/                   # API routes
├── static_arch/              
├── tests/                    # Backend tests
├── utils/                    # Utility functions or helpers
├── .env                      # Environment variables
├── package.json              # Backend dependencies and scripts
└── README.md                 # This file