# Hospital Management System - Frontend

A modern and responsive frontend application for the Hospital Management System (HMS), developed using React and Tailwind CSS. The application provides an intuitive interface for patients, doctors, and administrators.

## Features

* User Authentication
* Role-Based Navigation
* Patient Dashboard
* Appointment Booking
* Appointment History
* Profile Management
* Protected Routes
* Responsive Design
* Error Handling Pages

## Tech Stack

* React
* TypeScript
* Vite
* Tailwind CSS
* React Router
* Axios
* Context API

## Project Structure

```
src/
├── components/
├── pages/
├── layouts/
├── routes/
├── services/
├── hooks/
├── context/
├── types/
└── utils/
```

## Prerequisites

* Node.js (v18 or above)
* npm

## Installation

1. Clone the repository.

```bash
git clone https://github.com/Manideep4005/hms-react-frontend.git
```

2. Navigate to the project directory.

```bash
cd hms-frontend
```

3. Install dependencies.

```bash
npm install
```

4. Configure environment variables.

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:8081
```

5. Start the development server.

```bash
npm run dev
```

The application will run on:

```
http://localhost:5173
```

## Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Create production build
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

## User Modules

### Patient

* Dashboard
* Book Appointments
* View Appointment History
* Manage Profile

### Doctor

* View Scheduled Appointments
* Manage Availability
* Patient Information Access

### Administrator

* Manage Users
* Manage Doctors
* Monitor Appointments
* System Administration

## Deployment

Frontend is deployed using **Vercel**.

## Future Enhancements

* Real-Time Notifications
* Online Consultation Support
* Dark Mode
* Progressive Web App (PWA) Support

## Author

**Manideep Nakka**

Software Developer specializing in Java, Spring Boot, Node.js, TypeScript, React, and PostgreSQL.
