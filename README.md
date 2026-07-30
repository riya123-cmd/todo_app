# 📝 MERN Stack Todo Application with JWT Authentication

A full-stack MERN (MongoDB, Express.js, React, Node.js) Todo application featuring secure JWT authentication, user-isolated data, priority levels, due dates, statistics dashboard, dark mode, and a responsive UI.

---

## 🚀 Features

- **User Authentication**: Secure Registration & Login powered by JWT (JSON Web Tokens) and bcrypt password hashing.
- **User-Isolated Todos**: Each user manages their own tasks; user data is strictly isolated.
- **Full Todo CRUD Operations**:
  - **Create**: Add tasks with title, description, priority level (High / Medium / Low), and due date.
  - **Read**: Fetch user-specific todos sorted by creation date.
  - **Update**: Edit title, description, priority, due date, or toggle completion status (Complete / Undo).
  - **Delete**: Remove completed or obsolete tasks.
- **Dashboard & Progress Tracking**: Real-time statistics showing Total, Completed, Pending tasks, and completion percentage with an interactive progress bar.
- **Search & Filtering**: Quick instant search by title/description and filter by status (`All`, `Completed`, `Pending`).
- **Dark Mode**: Aesthetic dark/light mode toggle with theme persistence.
- **Responsive UI**: Glassmorphism design system fully optimized for desktop, tablet, and mobile browsers.

---

## 🛠️ Tech Stack

### Frontend
- **React** (v19)
- **React Router DOM** (v7) for SPA routing
- **Axios** (v1.18) with central request/response interceptors
- **Vanilla CSS** with Google Poppins typography & glassmorphism styling

### Backend
- **Node.js** & **Express.js**
- **MongoDB** & **Mongoose** (v9)
- **JSON Web Token (jwt)** for stateless authentication
- **bcryptjs** for secure password hashing
- **cors** & **dotenv** for environment configuration

---

## 📁 Project Structure

```text
To-do-app/
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js            # MongoDB Mongoose connection
│   │   ├── controllers/
│   │   │   ├── authController.js # Register & Login logic
│   │   │   └── todoController.js # User-isolated Todo CRUD operations
│   │   ├── middleware/
│   │   │   └── auth.js           # JWT verification middleware
│   │   ├── models/
│   │   │   ├── Todo.js           # Todo schema with User reference
│   │   │   └── User.js           # User schema
│   │   ├── routes/
│   │   │   ├── authRoutes.js     # /api/auth routes
│   │   │   └── todoRoutes.js     # /api/todos routes
│   │   └── app.js                # Express app setup
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js          # Central authenticated Axios client
│   │   ├── pages/
│   │   │   ├── Login.js          # Login page
│   │   │   ├── Register.js       # User registration page
│   │   │   └── TodoPage.js       # Main Todo application page
│   │   ├── App.css               # Main styling & Dark mode
│   │   ├── App.js                # Router configuration
│   │   └── index.js
│   ├── .env                      # Frontend environment config (PORT=3001)
│   └── package.json
├── server.js                     # Root backend server entrypoint
├── package.json
├── .env.example                  # Environment variable reference
├── .gitignore
└── README.md
```

---

## 🔑 Environment Variables

Create a `.env` file in the root directory (or use `.env.example` as a template):

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/Usernotes
JWT_SECRET=your_secret_key_here
```

In the `frontend` folder, a `.env` file specifies the port:

```env
PORT=3001
```

---

## 🔒 Authentication Flow

1. **User Registration**: `POST /api/auth/register` saves the hashed password in MongoDB.
2. **User Login**: `POST /api/auth/login` verifies credentials and returns a JWT token.
3. **Token Storage**: Frontend stores `token` in `localStorage`.
4. **Authenticated Requests**: Frontend Axios interceptor automatically attaches `Authorization: Bearer <token>` to all `/api/todos` requests.
5. **Session Expiry / 401 Unauthorized**: If a `401` status occurs, the frontend clears `localStorage` and redirects the user to `/login`.

---

## 📡 API Endpoints

### Authentication Routes (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Register a new user | ❌ No |
| `POST` | `/api/auth/login` | Login user & return JWT token | ❌ No |

### Todo Routes (`/api/todos`)
| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| `GET` | `/api/todos` | Fetch all todos for logged-in user | ✅ Yes |
| `POST` | `/api/todos` | Create a new todo | ✅ Yes |
| `PATCH` | `/api/todos/:id` | Update title/description/dueDate/priority/completed | ✅ Yes |
| `DELETE` | `/api/todos/:id` | Delete a todo | ✅ Yes |

---

## 💻 How to Run Locally

### 1. Clone the repository
```bash
git clone https://github.com/riya123-cmd/todo_app.git
cd todo_app
```

### 2. Install dependencies
Install backend dependencies:
```bash
npm install
cd Backend && npm install && cd ..
```

Install frontend dependencies:
```bash
cd frontend && npm install && cd ..
```

### 3. Ensure MongoDB is running
Start your local MongoDB service:
```bash
mongod
```

### 4. Start the Application
Start the Backend Server (Port 3000):
```bash
node server.js
```

Start the Frontend Server (Port 3001):
```bash
cd frontend
npm start
```

Open [http://localhost:3001](http://localhost:3001) in your browser.