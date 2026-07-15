const express = require("express");
const router = express.Router();

const { createTodo } = require("../controllers/todoController");

router.post("/todos", createTodo);
const { getTodos } = require("../controllers/todoController");
router.get("/todos", getTodos);
const { updateTodo } = require("../controllers/todoController");
router.patch("/todos/:id", updateTodo);
const { deleteTodo } = require("../controllers/todoController");
router.delete("/todos/:id", deleteTodo);

module.exports = router;
