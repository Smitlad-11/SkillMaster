# SkillMaster - Premium E-Learning Management System

SkillMaster is a full-stack Learning Management System (LMS) built to provide a modern, role-based online learning experience for students, faculty, and administrators.

The platform includes course management, lectures, assignments, progress tracking, certificates, payments, feedback, live sessions, and responsive dashboards.

## 🚀 Live Demo

👉 **[Open SkillMaster Live](https://skillmaster-frontend.onrender.com)**

> You can explore the live project directly from the deployed application.

---

## ✨ Project Overview

SkillMaster is designed around three major user roles:

- **Student** – Browse courses, enroll, learn through video lectures, submit assignments, track progress, earn certificates, and manage profile.
- **Faculty** – Create and manage courses, upload lectures and study materials, manage assignments, track students, answer queries, and manage live sessions.
- **Admin** – Manage users, courses, platform analytics, revenue, feedback, and administrative settings.

---

## 🔷 Key Features

### 👨‍💼 Admin Features

- **Intelligence Dashboard** with platform statistics and revenue analytics
- **Course Management** with complete CRUD operations
- Publish / Unpublish courses
- **User Management** for students and faculty
- Block / Unblock users
- Revenue and order monitoring
- CSV platform report download
- Feedback management
- Administrative settings

### 👨‍🎓 Student Features

- Modern course browser
- Course details and enrollment
- Razorpay-based course checkout
- Video lecture learning
- PDF study materials
- Learning progress tracking
- Course completion certificates
- Assignment viewing and submission
- Faculty Q&A support
- Live sessions
- Payment history
- Profile and password management
- Responsive student dashboard

### 👨‍🏫 Faculty Features

- Faculty dashboard
- Create, edit, publish and manage courses
- Upload course thumbnails
- Upload lecture videos and study materials
- Course curriculum management
- Assignment creation and editing
- Student progress tracking
- Student profile viewing
- Student query management
- Live session management
- Faculty profile and settings

---

## 🧩 Technology Stack

### Frontend

- React.js
- Vite
- Tailwind CSS
- Redux Toolkit
- React Router
- Recharts
- React Player
- React Hot Toast

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Bcrypt
- Helmet
- Multer

### Cloud & Services

- **Cloudinary** – Image and file storage
- **Razorpay** – Course payments
- **Resend** – Password-reset email service
- **Render** – Production deployment

---

## 🏗️ Project Architecture

```text
SkillMaster
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── layouts
│   │   ├── pages
│   │   ├── redux
│   │   ├── services
│   │   └── utils
│   │
│   └── ...
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── utils
│   └── server.js
│
└── docs
