# Technical Reference Guide

This document provides a deep-dive into the core logic and security implementations of SkillMaster.

## 🔐 Authentication Flow
The system uses JWT (JSON Web Tokens) for secure, stateless authentication.
1.  **Client-Side**: User submits email/password.
2.  **Server-Side**: `authController.js` validates via `bcrypt.compare()`.
3.  **Token Generation**: `generateToken.js` signs a JWT containing the user ID.
4.  **Storage**: Frontend stores the token (via Redux/Local Storage) and attaches it to the `Authorization: Bearer <token>` header for all `api` service calls.

## 🛡️ Role-Based Middleware
Defined in `backend/middleware/roleMiddleware.js`.
```javascript
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Not authorized for this role' });
    }
    next();
  };
};
```
Used in routes to protect specific actions (e.g., `authorize('faculty', 'admin')`).

## 🧱 Protected Route Implementation (Frontend)
The `ProtectedRoute.jsx` component wraps restricted pages.
```javascript
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useSelector(state => state.auth);
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }
  return children;
};
```

## 💳 Razorpay Payment Security
1.  **Order Creation**: Razorpay order is created strictly on the server to prevent amount tampering.
2.  **Verification**: Final enrollment only occurs after verifying the `razorpay_signature` using your `KEY_SECRET`.
