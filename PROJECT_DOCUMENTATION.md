# 📘 Deep-Dive MERN Todo Application Documentation & Technical Reference

This document provides a comprehensive, ground-truth technical guide for the MERN Stack Todo application. It details every architectural layer, database schema, data flow, API endpoint, security protocol, error-handling strategy, and viva/interview guide based strictly on the current codebase.

---

## 📂 1. Project Folder & File Structure

```text
To-do-app/
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js             # Mongoose connection logic using async/await
│   │   ├── controllers/
│   │   │   ├── authController.js # Handlers for user registration & login
│   │   │   └── todoController.js # CRUD handlers with strict user isolation
│   │   ├── middleware/
│   │   │   └── auth.js           # JWT header extraction & verification middleware
│   │   ├── models/
│   │   │   ├── Todo.js           # Todo Mongoose Schema (referencing User._id)
│   │   │   └── User.js           # User Mongoose Schema (email unique, timestamps)
│   │   ├── routes/
│   │   │   ├── authRoutes.js     # Auth endpoint definitions (/register, /login)
│   │   │   └── todoRoutes.js     # Todo endpoint definitions (/todos)
│   │   └── app.js                # Express app configuration & middleware pipeline
│   ├── .env                      # Backend environment variables
│   ├── package.json              # Backend dependencies & start scripts
│   └── server.js                 # Local Backend entrypoint listener
├── frontend/
│   ├── public/                   # Static HTML template & favicon assets
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js          # Authenticated Axios client & interceptors
│   │   ├── pages/
│   │   │   ├── Login.js          # User Login page component
│   │   │   ├── Register.js       # User Registration page component
│   │   │   ├── Login.css         # Styling for authentication forms
│   │   │   └── TodoPage.js       # Main Todo application page & interactive UI
│   │   ├── App.css               # Design tokens, glassmorphism, responsive grid & dark mode
│   │   ├── App.js                # Client router & navigation guards
│   │   ├── index.css             # Global CSS reset rules
│   │   └── index.js              # React 18/19 DOM render entrypoint
│   ├── .env                      # Frontend port configuration (PORT=3001)
│   └── package.json              # Frontend dependencies & scripts
├── .env                          # Root environment configuration
├── .env.example                  # Template environment variables
├── package.json                  # Root dependencies & server launch script
├── server.js                     # Root Node.js entrypoint script
└── README.md                     # GitHub Repository overview
```

---

## 🏗️ 2. Architecture & Data Flow Overview

The application follows the decoupled 3-Tier Architecture:

```mermaid
graph TD
    A["Client Browser (React 19 SPA)"] -->|1. HTTP Requests (Axios Client)| B["Express.js Server (Port 3000)"]
    B -->|2. JWT Authentication Middleware| C["Route Controllers (Auth / Todo)"]
    C -->|3. Mongoose ORM Queries| D["MongoDB Instance (Usernotes DB)"]
    D -->|4. Document Data / Status| C
    C -->|5. JSON Responses| A
```

### Request Lifecycle Example (Fetching Todos):
1. **React Client (`TodoPage.js`)**: Executes `API.get('/todos')`.
2. **Axios Interceptor (`src/api/axios.js`)**: Reads token from `localStorage.getItem('token')` and appends header: `Authorization: Bearer <token>`.
3. **Express App (`Backend/src/app.js`)**: Receives request at path `/api/todos` and forwards it to `todoRoutes.js`.
4. **Auth Middleware (`Backend/src/middleware/auth.js`)**: Extracts token, calls `jwt.verify(token, jwtSecret)`, attaches decoded payload `{ id: user._id }` to `req.user`, and invokes `next()`.
5. **Todo Controller (`Backend/src/controllers/todoController.js`)**: Executes `getTodos()`, querying `Todo.find({ user: req.user.id }).sort({ createdAt: -1 })`.
6. **MongoDB Connection (`Backend/src/config/db.js`)**: Executes the indexed query and returns the matching document array.
7. **HTTP Response**: Express sends `res.json(todos)` back to React; state `setTodos(response.data)` updates the DOM.

---

## 🔐 3. JWT Authentication & Security Deep-Dive

### A. User Registration Flow (`authController.js -> registerUser`)
1. Client sends `POST /api/auth/register` with body `{ name, email, password }`.
2. Controller validates that all fields are populated.
3. Checks if email already exists via `User.findOne({ email })`.
4. Hashes the raw password securely using `await bcrypt.hash(password, 10)`.
5. Stores the user document in MongoDB (`User.create`).
6. Returns HTTP status `201 Created` with a success message.

### B. User Login Flow (`authController.js -> loginUser`)
1. Client sends `POST /api/auth/login` with body `{ email, password }`.
2. Controller queries user by email via `User.findOne({ email })`.
3. Compares plain password with hashed password via `await bcrypt.compare(password, user.password)`.
4. If match is verified, generates a JWT token using `jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '7d' })`.
5. Returns `200 OK` with JSON `{ message, token, user: { id, name, email } }`.

### C. Token Interception & Storage (`src/api/axios.js`)
- **Storage**: On login, `localStorage.setItem('token', res.data.token)`.
- **Request Interceptor**:
  ```javascript
  API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  ```
- **Response Interceptor (401 Handling)**:
  ```javascript
  API.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        if (window.location.pathname !== "/login" && window.location.pathname !== "/register") {
          window.location.href = "/login";
        }
      }
      return Promise.reject(error);
    }
  );
  ```

### D. Server JWT Verification Middleware (`middleware/auth.js`)
- Checks for `Authorization` header.
- Strips `"Bearer "` prefix if present.
- Verifies token using `jwt.verify(token, jwtSecret)`.
- Sets `req.user = verified` (containing `{ id: user._id }`).
- Rejects invalid or missing tokens with HTTP `401 Unauthorized`.

---

## 🗄️ 4. MongoDB / Mongoose Data Models

### A. User Model ([Backend/src/models/User.js](file:///c:/Users/Pramod/Desktop/To-do-app/Backend/src/models/User.js))
```javascript
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true }
  },
  { timestamps: true }
);
```

### B. Todo Model ([Backend/src/models/Todo.js](file:///c:/Users/Pramod/Desktop/To-do-app/Backend/src/models/Todo.js))
```javascript
const todoSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String },
  completed: { type: Boolean, default: false },
  priority: { type: String, default: "Medium" },
  dueDate: { type: Date },
  createdAt: { type: Date, default: Date.now }
});
```

---

## 📝 5. Complete Todo CRUD Operations & UI Features

### A. Create Todo (`POST /api/todos`)
- **UI Form**: Title input, Description textarea, Priority dropdown (`High`, `Medium`, `Low`), and Due Date picker.
- **Controller (`createTodo`)**: Validates title present, assigns `user: req.user.id`, and saves to database.

### B. Read Todos (`GET /api/todos`)
- **Controller (`getTodos`)**: Queries `Todo.find({ user: req.user.id }).sort({ createdAt: -1 })`.
- **UI Render**: Populates `todos` state and updates dashboard cards and progress bar.

### C. Update Todo (`PATCH /api/todos/:id` & `PUT /api/todos/:id`)
- **Edit Form Mode**: Clicking `✏ Edit` populates the form state with the todo data and toggles `isEditing = true`.
- **Toggle Complete**: Clicking `✅ Complete` or `↩ Undo` sends `PATCH /api/todos/:id` with `{ completed: !todo.completed }`.
- **Controller (`updateTodo`)**: Uses `Todo.findOneAndUpdate({ _id: req.params.id, user: req.user.id }, updateData, { new: true })`.

### D. Delete Todo (`DELETE /api/todos/:id`)
- **Controller (`deleteTodo`)**: Uses `Todo.findOneAndDelete({ _id: req.params.id, user: req.user.id })`.

### E. Dashboard & Statistics Calculation (`TodoPage.js`)
- `totalTodos = todos.length`
- `completedTodos = todos.filter(t => t.completed).length`
- `pendingTodos = totalTodos - completedTodos`
- `completionPercentage = totalTodos === 0 ? 0 : Math.round((completedTodos / totalTodos) * 100)`

### F. Dark Mode & Responsive Glassmorphism Styling
- State `darkMode` toggles class `.dark` on container wrapper.
- `.container` uses CSS backdrop filter: `backdrop-filter: blur(15px); background: rgba(255, 255, 255, 0.18);`.

---

## 📡 6. Complete API Specification

| Endpoint | Method | Header | Body Parameters | Success Status | Description |
| --- | --- | --- | --- | --- | --- |
| `/api/auth/register` | `POST` | None | `name`, `email`, `password` | `201 Created` | Registers user with hashed password |
| `/api/auth/login` | `POST` | None | `email`, `password` | `200 OK` | Authenticates user & returns JWT |
| `/api/todos` | `GET` | `Authorization: Bearer <token>` | None | `200 OK` | Gets user-specific todos sorted by date |
| `/api/todos` | `POST` | `Authorization: Bearer <token>` | `title`, `description`, `priority`, `dueDate` | `201 Created` | Creates a new todo for authenticated user |
| `/api/todos/:id` | `PATCH` | `Authorization: Bearer <token>` | `title`, `description`, `completed`, `priority`, `dueDate` | `200 OK` | Partial update for a specific todo |
| `/api/todos/:id` | `PUT` | `Authorization: Bearer <token>` | `title`, `description`, `completed`, `priority`, `dueDate` | `200 OK` | Full update for a specific todo |
| `/api/todos/:id` | `DELETE` | `Authorization: Bearer <token>` | None | `200 OK` | Deletes a specific todo |

---

## 🐛 7. Common Errors & Troubleshooting Guide

| Error Code / Symptom | Root Cause | Solution |
| --- | --- | --- |
| `MODULE_NOT_FOUND` | Missing dependency in local `node_modules` or running script from wrong folder | Run `npm install` in both root and `Backend` folders. Ensure `server.js` exists in both root and `Backend/`. |
| `EADDRINUSE: address already in use :::3000` | Port 3000 is already occupied by a running Node process | Terminate existing Node server processes via Task Manager or `kill` command. |
| `401 Unauthorized / Invalid Token` | JWT token expired, missing, or secret key mismatch | Re-authenticate at `/login` to generate a fresh token; verify `JWT_SECRET` in `.env`. |
| `CORS Error` | Express app missing CORS headers for frontend origin | Ensure `app.use(cors())` is registered before routes in `Backend/src/app.js`. |
| `Database Connection Failed` | MongoDB service not running locally | Ensure local MongoDB service (`mongod`) is running on port `27017`. |

---

## 💡 8. Key Concepts for Viva & Technical Interviews

1. **What is MERN?**: MongoDB (NoSQL Database), Express.js (Backend Framework), React (Frontend SPA Library), Node.js (JavaScript Runtime Environment).
2. **Stateless Authentication**: Server does not store session states in memory. Each request contains a cryptographically signed JWT token verified using a secret key.
3. **Data Isolation Strategy**: User isolation is enforced at database query level by always appending `{ user: req.user.id }` to queries.
4. **Password Hashing**: Storing plain text passwords is a huge vulnerability. `bcryptjs` uses a salt factor of 10 to produce irreversible cryptographic hashes.
5. **Axios Interceptors**: Middleware for client HTTP requests. Used to inject authorization headers globally and handle global HTTP error status codes like 401.

---

## ❓ 9. Project-Specific Interview Questions & Answers

#### Q1: How does your application protect private routes on the frontend?
**A**: `TodoPage.js` implements an authorization guard inside `useEffect`. It checks `localStorage.getItem("token")`. If missing, it immediately redirects the user to `/login` using `useNavigate()`.

#### Q2: How do you prevent users from accessing or modifying another user's todos?
**A**: Authentication middleware verifies the JWT token and attaches `req.user = verified`. All database queries in `todoController.js` include `{ user: req.user.id }` in `findOne`, `find`, `findOneAndUpdate`, and `findOneAndDelete` calls.

#### Q3: Why do you use both `PATCH` and `PUT` routes for updating todos in `todoRoutes.js`?
**A**: `PATCH` is designed for partial updates (e.g., toggling completion status), while `PUT` allows full document replacement. Both map to `updateTodo` for API flexibility.

#### Q4: How is password security implemented during registration?
**A**: Raw passwords are never saved. We use `await bcrypt.hash(password, 10)` in `authController.js` to store a 60-character bcrypt hash in MongoDB.

#### Q5: What happens when a user's JWT token expires?
**A**: The backend returns HTTP `401 Unauthorized`. The Axios response interceptor intercepts the `401` error, removes the expired token from `localStorage`, and redirects the browser to `/login`.

---

## 📌 10. One-Page Revision Cheat Sheet

```text
================================================================================
                    MERN TODO APP - VIVA / REVISION CHEAT SHEET
================================================================================

1. TECH STACK:
   - Frontend: React 19, React Router DOM 7, Axios, Glassmorphism Vanilla CSS
   - Backend: Node.js, Express.js 4, Mongoose 8, JWT, bcryptjs, CORS
   - Database: MongoDB (Collection: Usernotes)

2. SERVERS & PORTS:
   - Backend Server: http://localhost:3000
   - Frontend React App: http://localhost:3001

3. AUTHENTICATION FLOW:
   - Register: POST /api/auth/register -> bcrypt.hash(password, 10) -> User.create()
   - Login: POST /api/auth/login -> bcrypt.compare() -> jwt.sign({ id }) -> token
   - Storage: localStorage.setItem("token", token)
   - Request Interceptor: Authorization: Bearer <token>
   - Server Middleware: jwt.verify(token, JWT_SECRET) -> req.user = verified
   - User Isolation: Todo.find({ user: req.user.id })

4. KEY API ENDPOINTS:
   - POST /api/auth/register   (Public)
   - POST /api/auth/login      (Public)
   - GET /api/todos            (Protected - Fetch User Todos)
   - POST /api/todos           (Protected - Create Todo)
   - PATCH /api/todos/:id      (Protected - Update Todo)
   - DELETE /api/todos/:id     (Protected - Delete Todo)

5. START COMMANDS:
   - Backend:  node server.js   (Port 3000)
   - Frontend: cd frontend && npm start (Port 3001)
================================================================================
```
