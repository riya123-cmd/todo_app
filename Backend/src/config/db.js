const mongoose = require("mongoose");

async function connectDB() {
    try {
        const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/Usernotes";
        await mongoose.connect(mongoURI);

        console.log("Database Connected Successfully");
    } catch (error) {
        console.log("Error in DB Connection", error);
    }
}

module.exports = connectDB;