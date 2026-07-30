import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import "../App.css";

function TodoPage() {
  const navigate = useNavigate();

  // ==========================
  // STATES
  // ==========================
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");

  const [todos, setTodos] = useState([]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [darkMode, setDarkMode] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // ==========================
  // AUTH GUARD & INITIAL LOAD
  // ==========================
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    getTodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  // ==========================
  // GET TODOS
  // ==========================
  const getTodos = async () => {
    try {
      const response = await API.get("/todos");
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
      if (error.response && error.response.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  // ==========================
  // ADD / UPDATE TODO
  // ==========================
  const saveTodo = async () => {
    if (title.trim() === "") {
      alert("Please enter title");
      return;
    }

    try {
      const todoData = {
        title,
        description,
        priority,
        dueDate,
      };

      if (isEditing) {
        await API.patch(`/todos/${editId}`, todoData);
        alert("Todo Updated Successfully");
      } else {
        await API.post("/todos", todoData);
        alert("Todo Added Successfully");
      }

      setTitle("");
      setDescription("");
      setPriority("Medium");
      setDueDate("");
      setEditId(null);
      setIsEditing(false);

      getTodos();
    } catch (error) {
      console.error("Error saving todo:", error);
      alert(error.response?.data?.message || "Failed to save todo");
    }
  };

  // ==========================
  // DELETE TODO
  // ==========================
  const deleteTodo = async (id) => {
    try {
      await API.delete(`/todos/${id}`);
      getTodos();
    } catch (error) {
      console.error("Error deleting todo:", error);
      alert(error.response?.data?.message || "Failed to delete todo");
    }
  };

  // ==========================
  // EDIT TODO (LOAD INTO FORM)
  // ==========================
  const editTodo = (todo) => {
    setTitle(todo.title);
    setDescription(todo.description || "");
    setPriority(todo.priority || "Medium");
    setDueDate(
      todo.dueDate ? todo.dueDate.substring(0, 10) : ""
    );

    setEditId(todo._id);
    setIsEditing(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================
  // TOGGLE COMPLETE / UNDO
  // ==========================
  const toggleComplete = async (todo) => {
    try {
      await API.patch(`/todos/${todo._id}`, {
        completed: !todo.completed,
      });
      getTodos();
    } catch (error) {
      console.error("Error toggling todo complete state:", error);
      alert(error.response?.data?.message || "Failed to update todo status");
    }
  };

  // ==========================
  // LOGOUT
  // ==========================
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ==========================
  // SEARCH + FILTER
  // ==========================
  const filteredTodos = todos.filter((todo) => {
    const matchesSearch =
      (todo.title && todo.title.toLowerCase().includes(search.toLowerCase())) ||
      (todo.description && todo.description.toLowerCase().includes(search.toLowerCase()));

    if (filter === "completed") {
      return matchesSearch && todo.completed;
    }

    if (filter === "pending") {
      return matchesSearch && !todo.completed;
    }

    return matchesSearch;
  });

  // ==========================
  // STATISTICS
  // ==========================
  const totalTodos = todos.length;

  const completedTodos = todos.filter((todo) => todo.completed).length;

  const pendingTodos = totalTodos - completedTodos;

  const completionPercentage =
    totalTodos === 0
      ? 0
      : Math.round((completedTodos / totalTodos) * 100);

  // ==========================
  // RETURN JSX
  // ==========================
  return (
    <div className={darkMode ? "container dark" : "container"}>
      {/* HEADER */}
      <div className="header">
        <div>
          <h1>📝 My Todo App</h1>
          <p>Manage your tasks with priority and deadlines</p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            className="dark-btn"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
          </button>

          <button
            className="dark-btn"
            style={{ background: "#ef4444", color: "white" }}
            onClick={handleLogout}
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* STATISTICS DASHBOARD */}
      <div className="dashboard">
        <div className="dashboard-card">
          <h2>📋 {totalTodos}</h2>
          <p>Total Tasks</p>
        </div>

        <div className="dashboard-card">
          <h2>✅ {completedTodos}</h2>
          <p>Completed</p>
        </div>

        <div className="dashboard-card">
          <h2>⏳ {pendingTodos}</h2>
          <p>Pending</p>
        </div>
      </div>

      {/* PROGRESS */}
      <div className="progress-box">
        <h3>Progress</h3>
        <div className="progress-container">
          <div
            className="progress-bar"
            style={{
              width: `${completionPercentage}%`,
            }}
          ></div>
        </div>
        <h4>{completionPercentage}% Completed</h4>
      </div>

      {/* TODO FORM */}
      <div className="form">
        <input
          type="text"
          placeholder="Enter Todo Title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          rows="4"
          placeholder="Enter Description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* PRIORITY */}
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="High">🔴 High</option>
          <option value="Medium">🟡 Medium</option>
          <option value="Low">🟢 Low</option>
        </select>

        {/* DUE DATE */}
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <button className="add-btn" onClick={saveTodo}>
          {isEditing ? "Update Todo" : "Add Todo"}
        </button>
      </div>

      {/* SEARCH */}
      <input
        className="search-box"
        placeholder="🔍 Search your tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* FILTERS */}
      <div className="filters">
        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          All
        </button>

        <button
          className={filter === "completed" ? "active" : ""}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>

        <button
          className={filter === "pending" ? "active" : ""}
          onClick={() => setFilter("pending")}
        >
          Pending
        </button>
      </div>

      {/* TODO CARDS */}
      <div className="todo-list">
        {filteredTodos.length === 0 ? (
          <div className="empty">
            <h2>📭 No Todos Found</h2>
            <p>Add your first task.</p>
          </div>
        ) : (
          filteredTodos.map((todo) => (
            <div
              key={todo._id}
              className={
                todo.completed ? "todo-card completed" : "todo-card"
              }
            >
              <h3>
                {todo.completed ? "✅ " : "📌 "}
                {todo.title}
              </h3>

              <p>{todo.description}</p>

              <p className="priority">
                ⭐ Priority: {todo.priority || "Medium"}
              </p>

              <p className="date">
                📅 Due Date:{" "}
                {todo.dueDate
                  ? new Date(todo.dueDate).toLocaleDateString()
                  : "No Date"}
              </p>

              <div className="button-group">
                <button
                  className="edit-btn"
                  onClick={() => editTodo(todo)}
                >
                  ✏ Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => deleteTodo(todo._id)}
                >
                  🗑 Delete
                </button>

                <button
                  className="complete-btn"
                  onClick={() => toggleComplete(todo)}
                >
                  {todo.completed ? "↩ Undo" : "✅ Complete"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TodoPage;