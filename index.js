const express = require("express")
const app = express();

app.use(express.json());
const port = 1908;
app.set("view engine" , "ejs");
//const notes = [];

app.get("/" , (req , res) =>{
    res.render("home.ejs");
});

app.get("/addnotes" , (req , res) =>{
    //res.status(200).send("notes added  ");
    res.render("addnotes.ejs");
});

app.post("/addnotes", (req, res) => {
    res.send("POST request received!");
    notes.push(req.body);
    res.status(201).json(
        {
            message:"notes added succesfully."
        }
    )
});

// app.patch("addnotes" , (req,res) =>{

// });

app.listen(port , (req, res) => {
    console.log(`listening on the port ${port}`);
});


