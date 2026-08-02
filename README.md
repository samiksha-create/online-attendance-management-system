# Online Attendance Management System

A full-stack **MERN** (MongoDB, Express, React, Node.js) application for managing college attendance across three roles — **Admin**, **Teacher**, and **Student** — with a complete **CI/CD pipeline** using **Jenkins Declarative Pipeline** and **Docker**.

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Features](#features)
5. [Installation & Setup](#installation--setup)
6. [Run Locally](#run-locally)
7. [Environment Variables](#environment-variables)
8. [Docker Commands](#docker-commands)
9. [Jenkins Pipeline](#jenkins-pipeline)
10. [REST API Reference](#rest-api-reference)
11. [Postman Collection](#postman-collection)
12. [Screenshots](#screenshots)

---

## Project Overview

A college needs to automate attendance tracking for its students across subjects and teachers. This system provides:

- **Admin** — manages teachers, students, subjects, and views attendance reports.
- **Teacher** — views assigned subjects, marks/updates attendance, views student lists.
- **Student** — views personal attendance, profile, and downloads attendance reports.

The project also demonstrates a complete **CI/CD workflow**: Jenkins pulls the code, installs dependencies, builds both frontend and backend, runs automated tests, builds Docker images, and deploys containers via Docker Compose.

---

## Tech Stack

| Layer     | Technology                                              |
|-----------|-----------------------------------------------------------|
| Frontend  | React.js (Vite), Bootstrap 5, React Router DOM, Axios, Chart.js |
| Backend   | Node.js, Express.js, JWT, bcryptjs, dotenv                |
| Database  | MongoDB, Mongoose                                          |
| DevOps    | Git, GitHub, Docker, Docker Compose, Jenkins Declarative Pipeline |
| Testing   | Jest, Supertest, mongodb-memory-server                     |

---

## Project Structure

```
attendance-management/
│
├── backend/
│   ├── config/db.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── tests/
│   ├── .env.example
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── api/axios.js
│   │   ├── components/
│   │   ├── context/AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   ├── teacher/
│   │   │   └── student/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── postman/
│   └── Attendance-Management.postman_collection.json
│
├── Jenkinsfile
├── docker-compose.yml
└── README.md
```

---

## Features

- JWT Authentication with role-based login (Admin / Teacher / Student)
- Protected routes on both frontend and backend
- Full CRUD for Teachers, Students, and Subjects
- Bulk attendance marking with per-student status (Present / Absent / Late) and remarks
- Attendance reports with subject and date-range filters, CSV export
- Search and pagination on management tables
- Responsive Bootstrap dashboard with sidebar, navbar, cards, tables, modals, and Chart.js visualizations
- Form validation, centralized error handling, toast notifications, and loading spinners
- Dockerized frontend (Nginx) and backend (Node), orchestrated via Docker Compose
- Declarative Jenkins Pipeline automating build, test, containerization, and deployment

---

## Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local install or Docker container)
- Docker & Docker Compose (for containerized run)
- Jenkins with Docker + NodeJS plugin (for CI/CD)

### Clone the repository
```bash
git clone <your-repo-url>
cd attendance-management
```

---

## Run Locally

### 1. Backend
```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm install
npm run dev
```
Backend runs on **http://localhost:5000**

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on **http://localhost:5173**

### 3. Seed an initial Admin (first-time setup)
Since registration is open at `/api/auth/register`, create your first admin via Postman or curl:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"role":"admin","name":"Super Admin","email":"admin@college.com","password":"admin123"}'
```

Then log in through the frontend UI using the Admin role, and use the Admin Dashboard to add teachers and students.

> In production, you'd typically lock down `/register` or restrict it to admin-only creation of teacher/student accounts.

---

## Environment Variables

`backend/.env` (see `.env.example`):

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/attendance_db
JWT_SECRET=replace_this_with_a_long_random_secret_key
JWT_EXPIRES_IN=1d
CLIENT_URL=http://localhost:5173
```

When running via Docker Compose, `MONGO_URI` is automatically set to `mongodb://mongo:27017/attendance_db` (the Mongo service name).

---

## Docker Commands

### Build and run everything with Docker Compose
```bash
docker-compose up -d --build
```
- Frontend: **http://localhost:8080**
- Backend API: **http://localhost:5000/api/health**
- MongoDB: **localhost:27017**

### Stop containers
```bash
docker-compose down
```

### Stop and remove volumes (fresh DB)
```bash
docker-compose down -v
```

### View logs
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Build images individually
```bash
docker build -t attendance-backend ./backend
docker build -t attendance-frontend ./frontend
```

---

## Jenkins Pipeline

The `Jenkinsfile` defines a **Declarative Pipeline** with the following stages:

1. **Git Clone** — checks out the repository
2. **Install Dependencies** — installs backend and frontend npm packages (in parallel)
3. **Backend Build** — syntax/build check for the backend
4. **Frontend Build** — builds the production React bundle (`vite build`)
5. **Run Tests** — runs the Jest + Supertest suite (`npm test` in `backend/`)
6. **Build Docker Images** — builds backend and frontend Docker images
7. **Run Containers** — deploys via `docker-compose up -d --build`
8. **Deployment Successful** — prints deployment summary
9. **Post Build Actions** — cleans up dangling images; reports success/failure

### Jenkins Setup Requirements
- Install the **NodeJS Plugin** and configure a NodeJS installation named `Node20` (Manage Jenkins → Tools).
- Install **Docker** on the Jenkins agent, and ensure the `jenkins` user has permission to run Docker commands.
- Add a Jenkins credential (Secret Text) with ID `attendance-jwt-secret` containing your JWT secret — referenced in the `Jenkinsfile` via `credentials('attendance-jwt-secret')`.
- Create a new Pipeline job in Jenkins, point it at this repository, and set the pipeline definition to **"Pipeline script from SCM"** using the included `Jenkinsfile`.

---

## REST API Reference

Base URL: `http://localhost:5000/api`

### Authentication
| Method | Endpoint          | Access | Description                  |
|--------|-------------------|--------|-------------------------------|
| POST   | `/auth/register`  | Public | Register admin/teacher/student |
| POST   | `/auth/login`     | Public | Login and receive JWT          |
| GET    | `/auth/me`        | Private | Get current user profile      |

### Admin
| Method | Endpoint                    | Description         |
|--------|------------------------------|----------------------|
| POST   | `/admin/teachers`            | Add teacher          |
| GET    | `/admin/teachers`             | List teachers (search/pagination) |
| PUT    | `/admin/teachers/:id`         | Update teacher        |
| DELETE | `/admin/teachers/:id`         | Delete teacher        |
| POST   | `/admin/students`             | Add student           |
| GET    | `/admin/students`              | List students (search/pagination) |
| PUT    | `/admin/students/:id`         | Update student        |
| DELETE | `/admin/students/:id`         | Delete student        |

### Subjects
| Method | Endpoint                            | Description             |
|--------|---------------------------------------|--------------------------|
| POST   | `/subjects`                          | Create subject (Admin)   |
| GET    | `/subjects`                          | List subjects (all roles)|
| PUT    | `/subjects/:id`                      | Update subject (Admin)   |
| DELETE | `/subjects/:id`                      | Delete subject (Admin)   |
| PUT    | `/subjects/:id/assign-teacher`       | Assign teacher (Admin)   |

### Teacher
| Method | Endpoint                | Description               |
|--------|--------------------------|----------------------------|
| GET    | `/teacher/subjects`      | Get assigned subjects      |
| GET    | `/teacher/students`      | Get student list           |

### Student
| Method | Endpoint                | Description               |
|--------|--------------------------|----------------------------|
| GET    | `/student/profile`       | Get own profile            |
| PUT    | `/student/profile`       | Update own profile         |

### Attendance
| Method | Endpoint                          | Access         | Description                   |
|--------|--------------------------------------|----------------|--------------------------------|
| POST   | `/attendance`                       | Teacher        | Mark attendance (bulk)         |
| PUT    | `/attendance/:id`                   | Teacher        | Update a single record         |
| GET    | `/attendance/subject/:subjectId`    | Teacher/Admin  | Get attendance for a subject   |
| GET    | `/attendance/student`               | Student        | Get own attendance + summary   |
| GET    | `/attendance/report`                | Admin/Teacher  | Full attendance report (filters) |

---

## Postman Collection

Import `postman/Attendance-Management.postman_collection.json` into Postman. It includes requests for every endpoint above, grouped by role, with collection variables (`baseUrl`, `adminToken`, `teacherToken`, `studentToken`, etc.) to chain requests easily.

---

## Screenshots

> _Add your application screenshots here after running the project locally or via Docker._

- `[ Screenshot: Login Page ]`
- `[ Screenshot: Admin Dashboard ]`
- `[ Screenshot: Manage Teachers ]`
- `[ Screenshot: Mark Attendance ]`
- `[ Screenshot: Student Attendance View ]`
- `[ Screenshot: Jenkins Pipeline — Successful Run ]`

---

## License
MIT
