# API Documentation

The SkillMaster Backend is a RESTful API following MVC architecture. Base URL: `http://localhost:5000/api`

## 🔐 Authentication
| Method | Endpoint | Description | Role |
| :--- | :--- | :--- | :--- |
| POST | `/auth/register` | Register new student | Public |
| POST | `/auth/login` | Authenticate user & get JWT | Public |
| GET | `/auth/me` | Get current user profile | Auth |
| PUT | `/auth/update` | Update profile (with Avatar) | Auth |

## 📚 Courses
| Method | Endpoint | Description | Role |
| :--- | :--- | :--- | :--- |
| GET | `/courses` | Get published courses (Paginated) | Public |
| GET | `/courses/:id` | Get course details | Public |
| POST | `/courses` | Create new course | Admin/Faculty |
| PUT | `/courses/:id` | Update course details | Admin/Faculty |
| DELETE| `/courses/:id` | Delete course | Admin/Faculty |

## 🎓 Student Actions
| Method | Endpoint | Description | Role |
| :--- | :--- | :--- | :--- |
| GET | `/progress/:courseId` | Get course progress | Student |
| PUT | `/progress/update` | Mark lecture complete | Student |
| POST | `/assignments/:id/submit`| Submit assignment | Student |
| POST | `/queries` | Post student query | Student |

## 📊 Administrative
| Method | Endpoint | Description | Role |
| :--- | :--- | :--- | :--- |
| GET | `/users/stats` | Get dashboard analytics | Admin |
| GET | `/users` | Get all users (Search/Filter) | Admin |
| PUT | `/users/:id/block` | Block/Unblock user | Admin |
| GET | `/orders` | View all platform orders | Admin |
