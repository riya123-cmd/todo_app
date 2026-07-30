const express = require("express");
const router = express.Router();

// Authentication Middleware
const auth = require("../middleware/auth");

// Todo Controller
const {
    createTodo,
    getTodos,
    updateTodo,
    deleteTodo
} = require("../controllers/todoController");


// ==========================
// CREATE TODO
// ==========================
router.post("/todos", auth, createTodo);


// ==========================
// GET ALL TODOS
// ==========================
router.get("/todos", auth, getTodos);


// ==========================
// UPDATE TODO
// ==========================
router.patch("/todos/:id", auth, updateTodo);


// ==========================
// PUT UPDATE (Optional)
// ==========================
router.put("/todos/:id", auth, updateTodo);


// ==========================
// DELETE TODO
// ==========================
router.delete("/todos/:id", auth, deleteTodo);


module.exports = router;
