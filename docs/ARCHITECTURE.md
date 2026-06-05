# Architecture & Technical Deep-Dive

## 📂 Folder Structure

### Backend (`/backend`)
- `controllers/`: Logic for handling API requests.
- `models/`: Mongoose schemas (User, Course, Order, etc.).
- `routes/`: API endpoint definitions.
- `middleware/`: Auth, Role, Upload, and Error handling.
- `utils/`: Helpers (Certificates, Tokens, Email).

### Frontend (`/frontend`)
- `components/`: Reusable UI elements (Navbar, Cards, Spinners).
- `pages/`: Full-page views for all roles.
- `redux/`: Auth and UI state management.
- `layouts/`: Master layouts for Admin, Faculty, and Student.
- `services/`: Axios instance and API calls.

## 🔐 Authentication Flow
1. User submits credentials to `/auth/login`.
2. Backend verifies via `bcrypt` and generates a JWT.
3. Token is returned to Frontend and stored in `localStorage` or `State`.
4. `ProtectedRoute` component verifies role before rendering restricted views.

## 💳 Payment Integration (Razorpay)
1. Student clicks "Enroll".
2. Frontend creates a "Pending Order" via `/orders/create`.
3. Razorpay Checkout modal opens.
4. On success, Razorpay returns `payment_id`.
5. Frontend verifies payment via `/payments/verify`.
6. Course is added to user's `enrolledCourses` array.
