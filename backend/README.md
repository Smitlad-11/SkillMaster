# SkillMaster — E-Learning Management System
### MCA Internship Project | Brainybeam Info-Tech Pvt Ltd | MERN Stack

---

## 📌 Project Overview

SkillMaster is a full-stack E-Learning Management System with **3 modules**:
- 🔴 **Admin** — Manage users, courses, and view revenue analytics
- 🟣 **Faculty** — Create courses, upload lectures, grade assignments
- 🟢 **Student** — Browse/enroll in courses, watch videos, track progress

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js (Vite) + Tailwind CSS |
| State | Redux Toolkit |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Payments | Razorpay |
| File Upload | Multer |
| Certificates | PDFKit |

---

## 🚀 Quick Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Razorpay Test account (optional)

### 1. Clone & Setup Backend
```bash
cd skillmaster-backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, Razorpay keys
npm run seed      # Seed database with demo data
npm run dev       # Start on http://localhost:5000
```

### 2. Setup Frontend
```bash
cd skillmaster-frontend
npm install
cp .env.example .env
npm run dev       # Start on http://localhost:5173
```

---

## 🔑 Test Credentials (after seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@skillmaster.com | Admin@123 |
| Faculty | priya@skillmaster.com | Faculty@123 |
| Student | rohan@student.com | Student@123 |

---

## 📂 Project Structure

```
skillmaster-backend/
├── config/          # DB & Razorpay config
├── controllers/     # Business logic
├── middleware/      # Auth, Role, Error, Upload
├── models/          # MongoDB schemas
├── routes/          # API routes
├── utils/           # JWT, Email, Certificate
└── server.js        # Entry point

skillmaster-frontend/
├── src/
│   ├── components/  # Reusable UI components
│   ├── layouts/     # Admin, Faculty, Student layouts
│   ├── pages/       # Page components
│   ├── redux/       # State management
│   ├── services/    # API & Payment services
│   └── App.jsx      # Route configuration
```

---

## 🔗 API Endpoints

### Authentication
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| GET | /api/auth/me | Private |
| PUT | /api/auth/update | Private |

### Courses
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | /api/courses | Public |
| POST | /api/courses | Faculty/Admin |
| PUT | /api/courses/:id | Faculty/Admin |
| DELETE | /api/courses/:id | Admin |
| PUT | /api/courses/:id/publish | Faculty/Admin |

### Users (Admin)
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | /api/users | Admin |
| PUT | /api/users/:id/block | Admin |
| DELETE | /api/users/:id | Admin |
| GET | /api/users/stats | Admin |

### Payments
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/orders/create | Student |
| POST | /api/payments/verify | Student |

---

## 🌟 Features

- ✅ JWT Authentication with role-based access control
- ✅ Admin dashboard with charts and revenue analytics  
- ✅ Faculty course & lecture management
- ✅ Video player with progress tracking
- ✅ Razorpay payment integration
- ✅ PDF certificate generation on course completion
- ✅ Assignment submission and grading
- ✅ Dark mode toggle
- ✅ Responsive design (mobile + desktop)
- ✅ Course ratings & reviews

---

## ☁️ Deployment

**Backend → Render.com**
1. Push to GitHub
2. New Web Service → Connect repo
3. Build: `npm install` | Start: `node server.js`
4. Add env variables

**Frontend → Vercel**
1. Import GitHub repo
2. Framework: Vite
3. Add `VITE_API_URL=https://your-backend.onrender.com/api`

**Database → MongoDB Atlas**
1. Create free M0 cluster
2. Add connection string to `MONGO_URI`

---

*Built with ❤️ | SkillMaster E-Learning Platform | Brainybeam Info-Tech Pvt Ltd*
