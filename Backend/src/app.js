const express = require('express');
const app = express(); 
app.use(express.json());
const todoRoutes = require("./routes/todoRoutes");
app.use("/api", todoRoutes);
app.get("/", (req,res)=>{
    res.send("Backend Running");
})
module.exports = app;