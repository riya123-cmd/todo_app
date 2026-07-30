const Todo = require("../models/Todo");

// ==========================
// CREATE TODO
// ==========================
const createTodo = async (req, res) => {
    try {
        const { title, description, priority, dueDate } = req.body;

        if (!title || title.trim() === "") {
            return res.status(400).json({
                message: "Title is required"
            });
        }

        const todo = await Todo.create({
            user: req.user.id,
            title,
            description,
            priority: priority || "Medium",
            dueDate: dueDate || null
        });

        res.status(201).json(todo);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// ==========================
// GET ALL TODOS (User Specific)
// ==========================
const getTodos = async (req, res) => {
    try {
        const todos = await Todo.find({ user: req.user.id }).sort({
            createdAt: -1
        });

        res.json(todos);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// ==========================
// UPDATE TODO
// ==========================
const updateTodo = async (req, res) => {
    try {
        const { title, description, completed, priority, dueDate } = req.body;

        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (completed !== undefined) updateData.completed = completed;
        if (priority !== undefined) updateData.priority = priority;
        if (dueDate !== undefined) updateData.dueDate = dueDate;

        const todo = await Todo.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            updateData,
            { new: true }
        );

        if (!todo) {
            return res.status(404).json({
                message: "Todo not found or unauthorized"
            });
        }

        res.json(todo);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// ==========================
// DELETE TODO
// ==========================
const deleteTodo = async (req, res) => {
    try {
        const todo = await Todo.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!todo) {
            return res.status(404).json({
                message: "Todo not found or unauthorized"
            });
        }

        res.json({
            message: "Todo deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    createTodo,
    getTodos,
    updateTodo,
    deleteTodo
};