# Deployment Guide

This guide covers the professional deployment of SkillMaster using Render (Backend) and Vercel (Frontend).

## 🚀 Backend Deployment (Render)

1.  **Create a New Web Service**: Link your GitHub repository.
2.  **Runtime**: Node.
3.  **Build Command**: `cd backend && npm install`
4.  **Start Command**: `cd backend && node server.js`
5.  **Environment Variables**:
    *   `MONGO_URI`: Your MongoDB Atlas connection string.
    *   `JWT_SECRET`: A long, random string.
    *   `RAZORPAY_KEY_ID`: Your Razorpay Key ID.
    *   `RAZORPAY_KEY_SECRET`: Your Razorpay Secret.
    *   `NODE_ENV`: `production`

## 🚀 Frontend Deployment (Vercel)

1.  **Import Project**: Select your repository.
2.  **Framework Preset**: Vite.
3.  **Root Directory**: `frontend`
4.  **Build Command**: `npm run build`
5.  **Output Directory**: `dist`
6.  **Environment Variables**:
    *   `VITE_API_URL`: The URL of your Render backend (e.g., `https://skillmaster-api.onrender.com/api`).
    *   `VITE_RAZORPAY_KEY_ID`: Your Razorpay Key ID.

## 🗄️ Database (MongoDB Atlas)

1.  **Network Access**: Ensure `0.0.0.0/0` (or specific IPs) are whitelisted.
2.  **Database User**: Create a user with `readWriteAnyDatabase` privileges.
3.  **Connection String**: Copy the SRV string and replace `<password>` with your user's password.
