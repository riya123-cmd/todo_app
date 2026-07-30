# 📝 MERN Stack Todo Application with JWT Authentication

A modern, full-stack MERN (MongoDB, Express.js, React, Node.js) Todo application featuring secure JWT authentication, user-isolated task management, priority levels, due dates, interactive statistics dashboard, progress tracking, dark mode, and a responsive glassmorphism UI.

---

## 🚀 Features

- **🔐 Secure Authentication**: User Registration and Login powered by JSON Web Tokens (JWT) and `bcryptjs` password hashing.
- **👤 User-Isolated Data**: Each user strictly accesses and manages only their own todos.
- **📝 Full Todo CRUD Operations**:
  - **Create**: Add tasks with title, description, priority (`High`, `Medium`, `Low`), and due date.
  - **Read**: Fetch user-specific todos sorted by creation date (newest first).
  - **Update**: Edit task title, description, priority, due date, or toggle completion status (`Complete` / `Undo`).
  - **Delete**: Permanently remove tasks.
- **📊 Real-Time Statistics & Progress**: Dashboard showing Total, Completed, and Pending task counts alongside a dynamic percentage progress bar.
- **🔍 Search & Filtering**: Instant search across titles and descriptions with category filtering (`All`, `Completed`, `Pending`).
- **🌙 Dark Mode**: Aesthetic dark/light theme toggle with immediate UI styling transitions.
- **📱 Responsive UI**: Glassmorphism styling optimized for mobile, tablet, and desktop viewports.

---

## 🛠️ Tech Stack

### Frontend
- **React (v19)**: Component-based UI library
- **React Router DOM (v7)**: Client-side SPA routing (`BrowserRouter`, `Routes`, `Route`, `Navigate`)
- **Axios (v1.18)**: HTTP client with request and response interceptors for automatic JWT token attachment and 401 session handling
- **Vanilla CSS**: Custom styling with Google Poppins font, CSS Grid/Flexbox, glassmorphism, and dark mode classes

### Backend
- **Node.js & Express.js**: REST API server implementation
- **MongoDB & Mongoose (v8)**: Document database and Object Data Modeling (ODM)
- **jsonwebtoken (JWT)**: Stateless authentication tokens with 7-day expiration
- **bcryptjs**: Salt-hashed password storage
- **cors**: Cross-Origin Resource Sharing middleware
- **dotenv**: Environment variable management

---

## 📁 Project Structure

```text
To-do-app/
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js             # Mongoose MongoDB connection
│   │   ├── controllers/
│   │   │   ├── authController.js # User registration & login controller
│   │   │   └── todoController.js # User-isolated Todo CRUD controller
│   │   ├── middleware/
│   │   │   └── auth.js           # JWT verification middleware
│   │   ├── models/
│   │   │   ├── Todo.js           # Todo Mongoose schema (User ref)
│   │   │   └── User.js           # User Mongoose schema
│   │   ├── routes/
│   │   │   ├── authRoutes.js     # /api/auth endpoints
│   │   │   └── todoRoutes.js     # /api/todos endpoints
│   │   └── app.js                # Express application configuration
│   ├── .env                      # Backend environment variables
│   ├── package.json              # Backend package manifest & scripts
│   └── server.js                 # Backend entrypoint (runs app on port 3000)
├── frontend/
│   ├── public/                   # HTML template & public assets
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js          # Authenticated Axios instance & interceptors
│   │   ├── pages/
│   │   │   ├── Login.js          # User Login page component
│   │   │   ├── Register.js       # User Registration page component
│   │   │   ├── Login.css         # Auth pages styling
│   │   │   └── TodoPage.js       # Main Todo application dashboard
│   │   ├── App.css               # Main design system & dark mode CSS
│   │   ├── App.js                # Router configuration & guard setup
│   │   ├── index.css             # Base reset CSS
│   │   └── index.js              # React DOM render root
│   ├── .env                      # Frontend environment variable (PORT=3001)
│   └── package.json              # Frontend package manifest & scripts
├── .env                          # Root environment variable configuration
├── .env.example                  # Reference environment configuration
├── package.json                  # Root package manifest & start script
├── server.js                     # Root backend entrypoint
└── README.md                     # Project documentation
```

---

## 🔑 Environment Configuration

Create a `.env` file in the project root or use `.env.example` as a template:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/Usernotes
JWT_SECRET=your_jwt_secret_key_here
```

Inside `frontend/.env`:
```env
PORT=3001
```

---

## ⚙️ How to Run Locally

### 1. Prerequisites
- **Node.js**: v18+ installed on your machine
- **MongoDB**: Local MongoDB instance running on `mongodb://127.0.0.1:27017` (or a MongoDB Atlas URI)

### 2. Install Dependencies
Run the following commands to install dependencies:

```bash
# Install root backend dependencies
npm install

# Install Backend folder dependencies
cd Backend && npm install && cd ..

# Install Frontend dependencies
cd frontend && npm install && cd ..
```

### 3. Start Backend Server (Port 3000)
You can start the backend from the root directory or inside the `Backend` directory:

```bash
# From Root
npm start
# OR
node server.js

# OR From Backend directory
cd Backend
npm start
```
*Expected log:* `Server is running on port 3000` & `Database Connected Successfully`.

### 4. Start Frontend Application (Port 3001)
In a separate terminal window:

```bash
cd frontend
npm start
```
Open [http://localhost:3001](http://localhost:3001) in your browser.

---

## 📡 API Specification

### Authentication Endpoints (`/api/auth`)
| Method | Endpoint | Description | Auth Required | Request Body |
| --- | --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Register a new user | ❌ No | `{ "name": "...", "email": "...", "password": "..." }` |
| `POST` | `/api/auth/login` | Authenticate user & return JWT token | ❌ No | `{ "email": "...", "password": "..." }` |

### Todo Endpoints (`/api/todos`)
| Method | Endpoint | Description | Auth Required | Request Body |
| --- | --- | --- | --- | --- |
| `GET` | `/api/todos` | Fetch all todos for logged-in user | ✅ Yes | None |
| `POST` | `/api/todos` | Create a new todo | ✅ Yes | `{ "title": "...", "description": "...", "priority": "...", "dueDate": "..." }` |
| `PATCH` | `/api/todos/:id` | Update title, description, priority, dueDate, or completion | ✅ Yes | `{ "title": "...", "completed": true, ... }` |
| `PUT` | `/api/todos/:id` | Full update todo | ✅ Yes | `{ "title": "...", "completed": false, ... }` |
| `DELETE` | `/api/todos/:id` | Delete todo by ID | ✅ Yes | None |

---

## 🔒 Authentication & Data Flow

1. **User Registration**: `POST /api/auth/register` validates input, hashes password using `bcryptjs`, and stores the record in MongoDB.
2. **User Login**: `POST /api/auth/login` verifies user existence and password hash. On success, returns a signed JWT token containing `{ id: user._id }`.
3. **Token Storage**: Frontend stores the JWT token in `localStorage.getItem("token")`.
4. **Axios Interceptor**: `frontend/src/api/axios.js` automatically attaches `Authorization: Bearer <token>` to all outgoing API requests.
5. **JWT Verification Middleware**: `Backend/src/middleware/auth.js` verifies the token and attaches `req.user = verified` to the request object.
6. **User Isolation**: `todoController.js` performs queries filtered strictly by `{ user: req.user.id }`.
7. **Session Expiry**: If a request returns `401 Unauthorized`, Axios response interceptor automatically removes the token from `localStorage` and redirects the user to `/login`.