# Setup & Installation Guide

Follow these steps to get SkillMaster running locally on your machine.

## 📋 Prerequisites
- Node.js (v16+)
- MongoDB (Local or Atlas)
- Razorpay Account (for testing keys)

## 🛠️ Step 1: Clone & Install Dependencies

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

## 🔐 Step 2: Environment Configuration

### Backend (`backend/.env`)
Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_super_secret_key
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
NODE_ENV=development
```

### Frontend (`frontend/.env`)
Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=rzp_test_...
```

## 📊 Step 3: Database Seeding (Optional)
To populate the database with professional dummy data:
```bash
cd backend
npm run seed
```

## 🚀 Step 4: Running the Application

### Start Backend
```bash
cd backend
npm run dev
```

### Start Frontend
```bash
cd frontend
npm run dev
```
The application will be available at `http://localhost:5173`.
