PROJECT-HD

PROJECT-HD is a full-stack web application built with React (frontend) and Node.js/Express (backend) using MongoDB as the database. It provides OTP-based authentication (no passwords) using JWT tokens, and allows users to manage their notes (create, edit, delete, and update). The application is mobile-friendly and deployed on Render with separate backend and frontend environments.

Features

Sign up and sign in using OTP only, no password required.

JWT-based authentication for secure API access.

Home page displaying user information and notes.

CRUD operations on notes (Create, Read, Update, Delete).

Mobile-responsive design.

Separate environments for frontend and backend.

Deployed on Render (frontend and backend).

Tech Stack

Frontend: React, Tailwind CSS, Axios, React Router

Backend: Node.js, Express, MongoDB, Mongoose, JWT

Authentication: OTP-based, JWT tokens

Deployment: Render

Other: Date-fns, React Icons, React Datepicker

Project Structure
project-hd/
├─ backend/
│  ├─ models/
│  ├─ routes/
│  ├─ controllers/
│  ├─ app.js
│  └─ .env
├─ frontend/
│  ├─ src/
│  │  ├─ api/
│  │  ├─ components/
│  │  ├─ pages/
│  │  └─ App.jsx
│  └─ .env
└─ README.md

Getting Started
Prerequisites

Node.js (v18+ recommended)

npm or yarn

MongoDB database

Backend Setup

Navigate to the backend folder:

cd backend


Install dependencies:

npm install


Create a .env file in the backend root with the following variables:

PORT=3000
MONGODB_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/PROJECT-HD?retryWrites=true&w=majority
FRONTEND_URL=https://project-hd-1.onrender.com
JWT_SECRET=PROJECT-HD
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
NODE_ENV=development


Start the backend server:

npm run dev


The backend will run at http://localhost:3000.

Frontend Setup

Navigate to the frontend folder:

cd frontend


Install dependencies:

npm install


Create a .env file in the frontend root with the following variable:

VITE_API_URL=https://project-hd.onrender.com


Start the frontend:

npm run dev


The frontend will run at http://localhost:5173.

Deployment

Backend: Deploy the backend folder on Render, set environment variables from .env.

Frontend: Deploy the frontend folder on Render, set VITE_API_URL to your backend Render URL.

Ensure the backend CORS allows the frontend URL:

app.use(cors({
  origin: ["https://project-hd-1.onrender.com"], 
  credentials: true
}));

Usage

Open the frontend URL in a browser.

Sign up with your name, date of birth, and email.

Enter the OTP sent to your email.

Access your dashboard with user info and notes.

Create, edit, or delete notes as needed.

Axios Configuration (Frontend)
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const setAuthToken = (token) => {
  if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete api.defaults.headers.common["Authorization"];
};

export default api;

Notes

OTP is valid for a limited time (configurable in backend).

JWT tokens are stored in localStorage for session persistence.

Make sure email credentials in .env are correct for OTP sending.

The app is responsive and works on mobile devices.

Author

Brijesh Kumar